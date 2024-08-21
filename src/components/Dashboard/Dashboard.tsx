import { Avatar, Box, Button, ButtonGroup, Container } from '@mui/material';
import { Dispatch, SetStateAction, useState, useCallback, useMemo } from 'react';
import { CommentType, UserDataType } from '../../types';
import { findIdAndEditReaction, findIdAndInsertComment } from '../../utility/findComment';
import InputComment from '../InputComment/InputComment';
import Comments from '../Comments/Comments';
import initialComments from '../../assets/mock-comments.json';
import Paginate from '../Pagination/Pagination';
import { signInWithGoogle, signOutUser } from '../../firebase';

interface DashboardProps {
  userData: UserDataType | null;
  setUser: Dispatch<SetStateAction<UserDataType | null>>;
}

const Dashboard = ({ userData, setUser }: DashboardProps) => {
  const [comments, setComments] = useState<CommentType[]>(initialComments);
  const [commentsVisible, setCommentsVisible] = useState<CommentType[]>([]);
  const [popularBtnActive, setPopularBtnActive] = useState<boolean>(false);
  const [latestBtnActive, setLatestBtnActive] = useState<boolean>(false);

  const totalPages = useMemo(() => Math.ceil(comments.length / 8), [comments.length]);

  const commentsPagination = useCallback((page: number) => {
    const showComments = comments.slice((page - 1) * 8, page * 8);
    setCommentsVisible(showComments);
  }, [comments]);

  const reactionCountHandler = useCallback((reaction: string, id: number): void => {
    setComments((prevComments) => findIdAndEditReaction(prevComments, reaction, id));
  }, []);

  const insertComment = useCallback(
    async (comment: string, commentId: number, parentUser?: string) => {
      if (!userData) {
        try {
          const user = await signInWithGoogle();
          setUser({
            name: user.displayName || '',
            email: user.email || '',
            picture: user.photoURL || '',
          });
        } catch (error) {
          console.error('Login failed', error);
          return;
        }
      }

      const newComment: CommentType = {
        id: Date.now(),
        parent_comment: parentUser || '',
        user_name: userData?.name || '',
        user_image: userData?.picture || '',
        comment_text: comment,
        timestamp: new Date().toISOString(),
        like_count: 0,
        smile_count: 0,
        dislike_count: 0,
        replies: [],
      };

      setComments((prevComments) => {
        if (commentId === 0) {
          return [...prevComments, newComment];
        } else {
          return findIdAndInsertComment(prevComments, newComment, commentId);
        }
      });
    },
    [userData, setUser]
  );

  const sortComments = useCallback((type: 'popular' | 'latest') => {
    setPopularBtnActive(type === 'popular');
    setLatestBtnActive(type === 'latest');

    setComments((prevComments) => {
      const sortedComments = [...prevComments];
      if (type === 'popular') {
        sortedComments.sort((a, b) => b.smile_count - a.smile_count);
      } else {
        sortedComments.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      }
      return sortedComments;
    });
  }, []);

  const logout = useCallback(async () => {
    try {
      await signOutUser(); // Sign out from Firebase
      localStorage.removeItem('userCredential');
      setUser(null);
    } catch (error) {
      console.error("Logout failed", error);
    }
  }, [setUser]);

  return (
    <div>
      <Container maxWidth="lg" sx={{ marginTop: '10px' }}>
        <UserHeader userData={userData} setUser={setUser} logout={logout} />
      </Container>
      <Container maxWidth="lg" style={{ marginTop: '20px' }}>
        <Box
          sx={{
            boxShadow: '3px 3px 10px grey',
            borderRadius: '10px',
            height: '90vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <CommentsHeader
            commentsLength={comments.length}
            popularBtnActive={popularBtnActive}
            latestBtnActive={latestBtnActive}
            sortComments={sortComments}
          />

          {userData ? (
            <InputComment userEmail={userData.name} insertComment={insertComment} />
          ) : (
            <p style={{ marginTop: '20px' }}>Please sign in to post a comment.</p>
          )}

          {comments.length > 0 && (
            <Comments
              reactionCountHandler={reactionCountHandler}
              comments={commentsVisible}
              insertComment={insertComment}
            />
          )}

          <Paginate comments={comments} commentsPagination={commentsPagination} totalPages={totalPages} />
        </Box>
      </Container>
    </div>
  );
};

const UserHeader = ({ userData, setUser, logout }: { userData: UserDataType | null; setUser: Dispatch<SetStateAction<UserDataType | null>>; logout: () => void }) => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      <Avatar alt="user_image" src={userData?.picture} />
      <span style={{ fontSize: '18px', fontWeight: 'bold' }}>{userData?.name || 'Guest'}</span>
    </div>
    {userData ? (
      <Button onClick={logout} variant="contained" color="error">
        Logout
      </Button>
    ) : (
      <button
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: '8px 12px',
          border: 'none',
          backgroundColor: 'white',
          borderRadius: '5px',
          boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
          cursor: 'pointer',
          transition: 'background-color 0.3s ease',
        }}
        onClick={async () => {
          try {
            const user = await signInWithGoogle();
            setUser({
              name: user.displayName || '',
              email: user.email || '',
              picture: user.photoURL || '',
            });
          } catch (error) {
            console.error("Login failed", error);
          }
        }}
      >
        <img
          src="/logos/google.png"
          alt="Google icon"
          style={{
            width: '20px',
            height: '20px',
            marginRight: '8px',
          }}
        />
        Sign in with Google
      </button>
    )}
  </div>
);

const CommentsHeader = ({
  commentsLength,
  popularBtnActive,
  latestBtnActive,
  sortComments,
}: {
  commentsLength: number;
  popularBtnActive: boolean;
  latestBtnActive: boolean;
  sortComments: (type: 'popular' | 'latest') => void;
}) => (
  <div
    style={{
      width: '90%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      margin: '10px 20px',
    }}
  >
    <h1>Comments ({commentsLength})</h1>
    <ButtonGroup aria-label="sort buttons">
      <Button variant={popularBtnActive ? 'contained' : 'outlined'} onClick={() => sortComments('popular')}>
        Popular
      </Button>
      <Button variant={latestBtnActive ? 'contained' : 'outlined'} onClick={() => sortComments('latest')}>
        Latest
      </Button>
    </ButtonGroup>
  </div>
);

export default Dashboard;
