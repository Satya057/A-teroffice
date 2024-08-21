export interface UserDataType {
    aud : string,
    azp : string,
    email : string,
    email_verified : Boolean,
    exp : Number,
    family_name : string,
    given_name : string,
    iat : Number,
    iss : string,
    jti : string,
    name : string,
    nbf : string,
    picture : string,
    sub : string
}

export interface CommentType {
    id : Number,
    parent_comment : string,
    user_name : string | undefined,
    user_image : string | undefined,
    comment_text : string,
    timestamp : string,
    like_count : number,
    smile_count : number,
    dislike_count : number,
    replies : CommentType[]
}