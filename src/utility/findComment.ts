import { CommentType } from "../types"

export function findIdAndEditReaction(
        comments : CommentType[],
        reaction : string, 
        id: Number
    ) : CommentType[]
{
    return comments.map(comment => {
      if(comment.id === id){
        return {
          ...comment,
          //@ts-expect-error
          [reaction] : comment[reaction] + 1
        } 
      } else if(comment.replies && comment.replies.length > 0){
        return {
          ...comment,
          replies : findIdAndEditReaction(comment.replies, reaction, id)
        }
      }

      return comment
    })
}

export function findIdAndInsertComment(
    prevComments: CommentType[], 
    newComment : CommentType, 
    commentId : Number
) : CommentType[]
{
    return prevComments.map(comment => {
      if(comment.id === commentId){
        return {
          ...comment,
          replies : [...comment.replies, newComment]
        }
      }else if (comment.replies && comment.replies.length > 0) {
        return {
          ...comment,
          replies : findIdAndInsertComment(comment.replies, newComment, commentId)
        }
      }

      return comment;
    })
  }