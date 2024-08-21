import { Avatar, Button, ButtonGroup, Chip, Divider, Typography } from "@mui/material";
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import { useState } from "react";
import { CommentType } from "../../types";
import { dhm } from "../../utility/date";
import InputComment from "../InputComment/InputComment";

// Separate ReactionButton component
const ReactionButton = ({
    icon,
    count,
    disabled,
    onClick,
}: {
    icon: JSX.Element;
    count: number;
    disabled: boolean;
    onClick: () => void;
}) => (
    <Button disabled={disabled} onClick={onClick}>
        {icon}
        <span style={{ fontSize: "16px", paddingLeft: "4px" }}>{count}</span>
    </Button>
);

// Separate CommentContent component
const CommentContent = ({
    commentText,
    isExpanded,
    setIsExpanded,
}: {
    commentText: string;
    isExpanded: boolean;
    setIsExpanded: (expanded: boolean) => void;
}) => {
    const words = commentText.split(" ");
    const textCanOverflow = words.length > 50;
    const truncatedText = textCanOverflow ? words.slice(0, 49).join(' ') : commentText;
    const remainingText = words.slice(49).join(' ');

    return (
        <Typography variant="body1" gutterBottom>
            <span dangerouslySetInnerHTML={{ __html: truncatedText }} />
            {textCanOverflow && (
                <>
                    {!isExpanded && <span>... </span>}
                    <span style={{ display: isExpanded ? "inline" : "none" }}>
                        <span dangerouslySetInnerHTML={{ __html: remainingText }} />
                    </span>
                    <span
                        role="button"
                        style={{ color: "#3333cc", cursor: "pointer" }}
                        onClick={() => setIsExpanded(!isExpanded)}
                    >
                        {isExpanded ? 'show less' : 'show more'}
                    </span>
                </>
            )}
        </Typography>
    );
};

// Main CommentCard component
const CommentCard = ({ comment, reactionCountHandler, insertComment }: CommentCardProps) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isReplying, setIsReplying] = useState(false);
    const [reactions, setReactions] = useState<ReactionState>({ smile: false, like: false, dislike: false });

    const elapsedTime = (): string => {
        const currentTime = new Date();
        const commentTime = new Date(comment.timestamp);
        const timeDifference = currentTime.getTime() - commentTime.getTime();
        return dhm(timeDifference);
    };

    const handleReactionClick = (reaction: string, id: number) => {
        reactionCountHandler(reaction, id);
        setReactions((prevReactions) => ({
            ...prevReactions,
            [reaction]: true,
        }));
    };

    return (
        <div style={{ marginBottom: "20px" }}>
            <div style={{ display: 'flex', alignItems: "center", marginBottom: "10px" }}>
                <Avatar alt="user_image" src={comment.user_image} />
                <span style={{ paddingLeft: "10px", fontSize: "18px", fontWeight: 'bold', letterSpacing: '0.5px' }}>
                    {comment.user_name}
                </span>
            </div>
            <div>
                {comment.parent_comment.length > 0 && (
                    <Typography variant="body2" gutterBottom>
                        Hi <Chip label={`@${comment.parent_comment}`} color="primary" />{" "}
                    </Typography>
                )}
                <CommentContent
                    commentText={comment.comment_text}
                    isExpanded={isExpanded}
                    setIsExpanded={setIsExpanded}
                />
            </div>
            <Divider style={{ paddingTop: "10px" }} />
            <div style={{ display: "flex", alignItems: "center", gap: "20px", paddingTop: "10px" }}>
                <ButtonGroup variant="text" aria-label="reaction buttons">
                    <ReactionButton
                        icon={<EmojiEmotionsIcon />}
                        count={comment.smile_count}
                        disabled={reactions.smile}
                        onClick={() => handleReactionClick('smile_count', comment.id)}
                    />
                    <ReactionButton
                        icon={<ThumbUpAltIcon />}
                        count={comment.like_count}
                        disabled={reactions.like}
                        onClick={() => handleReactionClick('like_count', comment.id)}
                    />
                    <ReactionButton
                        icon={<ThumbDownIcon />}
                        count={comment.dislike_count}
                        disabled={reactions.dislike}
                        onClick={() => handleReactionClick('dislike_count', comment.id)}
                    />
                </ButtonGroup>
                <Typography variant="subtitle2" gutterBottom>
                    {elapsedTime()}
                </Typography>
                <Button onClick={() => setIsReplying(true)} variant="contained">Reply</Button>
            </div>
            {isReplying && (
                <div style={{ paddingLeft: "30px", paddingTop: "20px" }}>
                    <InputComment
                        type="reply"
                        userEmail={comment.user_name}
                        hideReply={setIsReplying}
                        insertComment={insertComment}
                        parentId={comment.id}
                    />
                </div>
            )}
            {comment.replies.length > 0 && (
                <div style={{ paddingLeft: "30px", paddingTop: "20px" }}>
                    {comment.replies.map((reply, id) => (
                        <CommentCard
                            key={id}
                            comment={reply}
                            reactionCountHandler={reactionCountHandler}
                            insertComment={insertComment}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default CommentCard;
