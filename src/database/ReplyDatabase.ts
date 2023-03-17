
import { ReplyLikeDislikeDB,ReplyDB, ReplyECreatorDB, REPLY_LIKE, PostRDB } from "../type";
import { BaseDatabase } from "./BaseDatabase";

export class ReplyDatabase extends BaseDatabase {
    public static TABLE_REPLYS = "replys"
    public static TABLE_REPLYS_LIKES_DISLIKES = "replys_likes_dislikes"
    public static TABLE_POSTS = "posts"

    public getReplysECreators = async (): Promise<ReplyECreatorDB[]> => {
        const result: ReplyECreatorDB[] = await BaseDatabase
            .connection(ReplyDatabase.TABLE_REPLYS)
            .select(
                "replys.id",
                "posts.id",
                "replys.creator_id",
                "replys.content",
                "replys.likes",
                "replys.dislikes",
                "replys.created_at",
                "replys.updated_at",
                "users.name AS creator_name",
                
            )
            .join("users", "replys.creator_id", "=", "users.id")
            .join("posts","replys.post_id", "=", "posts.id")
            
        
        return result
    }

    public insert = async (replyDB: ReplyDB): Promise<void> => {
        await BaseDatabase
            .connection(ReplyDatabase.TABLE_REPLYS)
            .insert(replyDB)
    }
    public insertReply = async (replyDB: PostRDB): Promise<void> => {
        await BaseDatabase
            .connection(ReplyDatabase.TABLE_POSTS)
            .insert(replyDB)
    }

    public findById = async (id: string): Promise<ReplyDB | undefined> => {
        const result: ReplyDB[] = await BaseDatabase
            .connection(ReplyDatabase.TABLE_REPLYS)
            .select()
            .where({ id })
        
        return result[0]
    }

    public update = async (
        id: string,
        replyDB: ReplyDB
    ): Promise<void> => {
        await BaseDatabase.connection(ReplyDatabase.TABLE_REPLYS)
            .update(replyDB)
            .where({ id })
    }

    public delete = async (id: string): Promise<void> => {
        await BaseDatabase.connection(ReplyDatabase.TABLE_REPLYS)
            .delete()
            .where({ id })
    }

    public findPostECreatorById = async (
        replyId: string
    ): Promise<ReplyECreatorDB | undefined> => {
        const result: ReplyECreatorDB[] = await BaseDatabase
            .connection(ReplyDatabase.TABLE_REPLYS)
            .select(
                "replys.id",
                "replys.creator_id",
                "replys.content",
                "replys.likes",
                "replys.dislikes",
                "replys.created_at",
                "replys.updated_at",
                "users.name AS creator_name",
               
            )
            .join("users","replys.creator_id", "=", "users.id")
            .join("posts","replys.post_id", "=", "posts.id")
            .where("replys.id", replyId)
        
        return result[0]
    }

    public likeOrDislikeReply= async (
        likeDislike: ReplyLikeDislikeDB
    ): Promise<void> => {
        await BaseDatabase.connection(ReplyDatabase.TABLE_REPLYS_LIKES_DISLIKES)
            .insert(likeDislike)
    }

    public findLikeDislike = async (
        likeDislikeDBToFind: ReplyLikeDislikeDB
    ): Promise<REPLY_LIKE | null> => {
        const [ likeDislikeDB ]: ReplyLikeDislikeDB[] = await BaseDatabase
            .connection(ReplyDatabase.TABLE_REPLYS_LIKES_DISLIKES)
            .select()
            .where({
                user_id: likeDislikeDBToFind.user_id,
                reply_id: likeDislikeDBToFind.reply_id
            })

        if (likeDislikeDB) {
            return likeDislikeDB.like === 1
                ? REPLY_LIKE.ALREADY_LIKED
                : REPLY_LIKE.ALREADY_DISLIKED

        } else {
            return null
        }
    }

    public removeLikeDislike = async (
        likeDislikeDB: ReplyLikeDislikeDB
    ): Promise<void> => {
        await BaseDatabase.connection(ReplyDatabase.TABLE_REPLYS_LIKES_DISLIKES)
            .delete()
            .where({
                user_id: likeDislikeDB.user_id,
                reply_id: likeDislikeDB.reply_id
            })
    }

    public updateLikeDislike = async (
        likeDislikeDB: ReplyLikeDislikeDB
    ) => {
        await BaseDatabase.connection(ReplyDatabase.TABLE_REPLYS_LIKES_DISLIKES)
            .update(likeDislikeDB)
            .where({
                user_id: likeDislikeDB.user_id,
                reply_id: likeDislikeDB.reply_id
            })
    }
}
