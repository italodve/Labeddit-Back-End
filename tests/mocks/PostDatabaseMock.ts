import { BaseDatabase } from "../../src/database/BaseDatabase"
import { PostDB,PostRDB,PostECreatorDB,LikeDislikeDB,POST_LIKE } from "../../src/type"



export class PostDatabaseMock extends BaseDatabase {
    public static TABLE_POSTS = "posts"

    public insert = async (postDB: PostDB): Promise<void> => {
        // não precisa retornar nada, porque é void
    }

public insertReply = async (replyDB: PostRDB): Promise<void> => {

}

          

public getPostsECreators = async (): Promise<PostECreatorDB[]>  => {
    return [
        {
            id: "post-id",
            creator_id: "creator-id",
            creator_name: "creator-name",
            content: "creator content",
            replys: 0,
            likes: 0,
              dislikes: 0,
              created_at: "",
              updated_at: ""
        },
        {
            id: "post-id",
            creator_id: "creator-id",
            creator_name: "creator-name",
            content: "creator content",
            replys: 0,
            likes: 0,
              dislikes: 0,
              created_at: "",
              updated_at: ""
        }
    ]
}
public findById = async (id: string): Promise<PostDB | undefined> => {
    if(id === "p001"){
return  {
    id: 'p001',
    creator_id: 'id-mock',
    content: 'publicacao1',
    replys: 0,
    likes: 1,
    dislikes: 1,
    created_at: expect.any(String),
    updated_at: expect.any(String),
}

    }
}


public update = async (
    id: string,
    postDB: PostDB): Promise<void> => {
    
}

public delete = async (id: string): Promise<void> => {

}

public findPostECreatorById = async (
    postId: string
): Promise<PostECreatorDB | undefined> => {
   if(postId === "p001"){
return {
    id: "p001",
    creator_id: "id-mock",
    creator_name: "Normal Mock",
    content: "content-mock",
    replys: 0,
      likes: 0,
      dislikes: 0,
      created_at: "",
      updated_at: ""
}
   }
}

public likeOrDislikePost = async (
    likeDislike: LikeDislikeDB
): Promise<void> => {
   
}




public removeLikeDislike = async (
    likeDislikeDB: LikeDislikeDB
): Promise<void> => {
    
}

public updateLikeDislike = async (
    likeDislikeDB: LikeDislikeDB
) => {
    
}
}