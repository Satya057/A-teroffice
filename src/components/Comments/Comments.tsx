import { CommentType } from "../../types";
import CommentCard from "./CommentCard";

interface CommentsProps {
  comments: CommentType[];
  reactionCountHandler: (reaction: string, id: number) => void;
  insertComment: (comment: string, commentId: number) => void;
}

const CommentsContainer = ({ children }: { children: React.ReactNode }) => (
  <div
    className="comments-container"
    style={{
      width: "90%",
      overflowY: "scroll",
      marginTop: "20px",
    }}
  >
    <div style={{ padding: "20px" }}>
      {children}
    </div>
  </div>
);

const Comments = ({ comments, reactionCountHandler, insertComment }: CommentsProps) => (
  <CommentsContainer>
    {comments.map((comment) => (
      <CommentCard
        key={comment.id} // Use comment id directly as key for uniqueness
        insertComment={insertComment}
        reactionCountHandler={reactionCountHandler}
        comment={comment}
      />
    ))}
  </CommentsContainer>
);

export default Comments;
