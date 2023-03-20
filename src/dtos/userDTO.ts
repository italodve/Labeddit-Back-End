import { PostModel } from "../type";
import { ReplyModel } from "../type";

export interface SignupInputDTO {
    name: unknown,
    email: unknown,
    password: unknown
} 
export interface SignupOutputDTO {
    token: string 
}

export interface LoginInputDTO {
    email:unknown,
    password:unknown
}

export interface  LoginOutputDTO  {
    token:string 
}

export interface GetPostsInputDTO {
    token: string | undefined
}
export interface GetPostsInputDTO2 {
    id: string,
    token: string | undefined
}
export interface GetByIdOutputDTO {
    post: PostModel

}
export interface GetByIdOutputDTO2 {
    reply: ReplyModel

}

export type GetPostsOutputDTO = PostModel[]
export type GetReplysOutputDTO = ReplyModel[]


export interface CreatePostInputDTO {
token: string | undefined,
content: unknown
}

export interface CreateReplyInputDTO {
    token: string | undefined,
    content: unknown,
    postId: string
    }

export interface EditPostInputDTO {
    idToEdit: string,
    token: string | undefined,
    content: unknown
}
export interface DeletePostInputDTO {
    idToDelete: string,
    token:string | undefined
}

export interface LikeOrDislikePostInputDTO {
    idToLikeOrDislike: string,
    token: string | undefined,
    like: unknown
}
export interface ReplyPostInputDTO {
    postIdToReply: string,
    token: string | undefined,
    reply: unknown
}

export interface LikeOrDislikePostReplyDTO {
    idToLikeOrDislike: string,
    token: string | undefined,
    like: unknown
}