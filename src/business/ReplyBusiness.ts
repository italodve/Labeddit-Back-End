import { ReplyDatabase } from "../database/ReplyDatabase";
import { CreatePostInputDTO, DeletePostInputDTO, EditPostInputDTO, GetPostsInputDTO, GetPostsOutputDTO, LikeOrDislikePostInputDTO, GetReplysOutputDTO, CreateReplyInputDTO } from "../dtos/userDTO";
import { BadRequestError } from "../errors/BadRequestError";
import { NotFoundError } from "../errors/NotFoundError";
import { Reply } from "../models/Reply";
import { IdGenerator } from "../services/IdGenerator";
import { TokenManager } from "../services/TokenManager";
import { ReplyLikeDislikeDB, ReplyECreatorDB, REPLY_LIKE, USER_ROLES, TokenPayloadReplys } from "../type";
import { PostDatabase } from "../database/PostDatabase";
import { Post } from "../models/Post";

export class ReplyBusiness {
    constructor(
        private replyDatabase: ReplyDatabase,
        private idGenerator: IdGenerator,
        private tokenManager: TokenManager
    ) {}
   
    
    public getReplys = async (
        input: GetPostsInputDTO
    ): Promise<GetReplysOutputDTO> => {
        const { token, } = input

        if (token === undefined) {
            throw new BadRequestError("token ausente")
        }

        const payload = this.tokenManager.getPayload(token)

        if (payload === null) {
            throw new BadRequestError("token inválido")
        }

        const replyECreatorsDB: ReplyECreatorDB[] =
            await this.replyDatabase
                .getReplysECreators()
        
        
        const replys = replyECreatorsDB.map(
            (replyECreatorDB) => {
                const reply = new Reply(
                    replyECreatorDB.id,
                    replyECreatorDB.post_Id,
                    replyECreatorDB.content,
                    replyECreatorDB.likes,
                    replyECreatorDB.dislikes,
                    replyECreatorDB.created_at,
                    replyECreatorDB.updated_at,
                  replyECreatorDB.creator_id,
                    replyECreatorDB.creator_name,
                    
                )

                return reply.toBusinessModel()
            }
        )

        const output: GetReplysOutputDTO = replys

        return output
    }

    public createReply = async (
        input: CreateReplyInputDTO
    ): Promise<void> => {
        const { token, content, postId } = input

        if (token === undefined) {
            throw new BadRequestError("token ausente")
        }
       

        const payload = this.tokenManager.getPayload(token)

        if (payload === null) {
            throw new BadRequestError("token inválido")
        }

        if (typeof content !== "string") {
            throw new BadRequestError("'name' deve ser string")
        }

        const id = this.idGenerator.generate()
        const createdAt = new Date().toISOString()
        const updatedAt = new Date().toISOString()
        const creatorId = payload.id
        const creatorName = payload.name
       
        const reply = new Reply(
            id,
            postId,
            content,
            0,
            0,
            createdAt,
            updatedAt,
            creatorId,
            creatorName,
            
        )
        


    
        const replyDB = reply.toDBModel()

        await this.replyDatabase.insert(replyDB)
    }

    public editReply = async (
        input: EditPostInputDTO
    ): Promise<void> => {
        const { idToEdit, token, content } = input

        if (token === undefined) {
            throw new BadRequestError("token ausente")
        }

        const payload = this.tokenManager.getPayload(token)

        if (payload === null) {
            throw new BadRequestError("token inválido")
        }

        if (typeof content !== "string") {
            throw new BadRequestError("'content' deve ser string")
        }

        const replyDB = await this.replyDatabase.findById(idToEdit)

        if (!replyDB) {
            throw new NotFoundError("'id' não encontrado")
        }

        const creatorId = payload.id

        if (replyDB.creator_id !== creatorId) {
            throw new BadRequestError("somente quem criou o post pode editar")
        }

        const creatorName = payload.name
        const postId = payload.id

        const reply =  new Reply(
            replyDB.id,
            postId,
            replyDB.content,
            replyDB.likes,
            replyDB.dislikes,
            replyDB.created_at,
            replyDB.updated_at,
            creatorId,
            creatorName,
           
        )

        reply.setContent(content)
        reply.setUpdatedAt(new Date().toISOString())

        const updatedReplyDB = reply.toDBModel()

        await this.replyDatabase.update(idToEdit, updatedReplyDB)
    }

    public deleteReply = async (
        input: DeletePostInputDTO
    ): Promise<void> => {
        const { idToDelete, token } = input

        if (token === undefined) {
            throw new BadRequestError("token ausente")
        }

        const payload = this.tokenManager.getPayload(token)

        if (payload === null) {
            throw new BadRequestError("token inválido")
        }

        const postDB = await this.replyDatabase.findById(idToDelete)

        if (!postDB) {
            throw new NotFoundError("'id' não encontrado")
        }

        const creatorId = payload.id

        if (
            payload.role !== USER_ROLES.ADMIN
            && postDB.creator_id !== creatorId
        ) {
            throw new BadRequestError("somente quem criou o post")
        }

        await this.replyDatabase.delete(idToDelete)
    }

    public likeOrDislikeReply = async (
        input: LikeOrDislikePostInputDTO
    ): Promise<void> => {
        const { idToLikeOrDislike, token, like } = input

        if (token === undefined) {
            throw new BadRequestError("token ausente")
        }

        const payload = this.tokenManager.getPayload(token)

        if (payload === null) {
            throw new BadRequestError("token inválido")
        }

        if (typeof like !== "boolean") {
            throw new BadRequestError("'like' deve ser boolean")
        }

        const replyECreatorDB = await this.replyDatabase
            .findPostECreatorById(idToLikeOrDislike)

        if (!replyECreatorDB) {
            throw new NotFoundError("'id' não encontrado")
        }

        const userId = payload.id
        const likeSQLite = like ? 1 : 0

        const likeDislikeDB: ReplyLikeDislikeDB = {
            user_id: userId,
            reply_id: replyECreatorDB.id,
            like: likeSQLite
        }

        const reply = new Reply(
            replyECreatorDB.id,
            replyECreatorDB.post_Id,
            replyECreatorDB.content,
            replyECreatorDB.likes,
            replyECreatorDB.dislikes,
            replyECreatorDB.created_at,
            replyECreatorDB.updated_at,
            replyECreatorDB.creator_id,
            replyECreatorDB.creator_name,
            
        )

        const likeDislikeExists = await this.replyDatabase
            .findLikeDislike(likeDislikeDB)

        if (likeDislikeExists === REPLY_LIKE.ALREADY_LIKED) {
            if (like) {
                await this.replyDatabase.removeLikeDislike(likeDislikeDB)
                reply.removeLike()
            } else {
                await this.replyDatabase.updateLikeDislike(likeDislikeDB)
                reply.removeLike()
                reply.addDislike()
            }

        } else if (likeDislikeExists === REPLY_LIKE.ALREADY_DISLIKED) {
            if (like) {
                await this.replyDatabase.updateLikeDislike(likeDislikeDB)
                reply.removeDislike()
                reply.addLike()
            } else {
                await this.replyDatabase.removeLikeDislike(likeDislikeDB)
                reply.removeDislike()
            }

        } else {
            await this.replyDatabase.likeOrDislikeReply(likeDislikeDB)
    
            like ? reply.addLike() : reply.addDislike()
        }

        const updatedReplyDB = reply.toDBModel()
    
        await this.replyDatabase.update(idToLikeOrDislike, updatedReplyDB)
    }
}