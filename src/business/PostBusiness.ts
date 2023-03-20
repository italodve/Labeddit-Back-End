import { PostDatabase } from "../database/PostDatabase";
import { CreatePostInputDTO, DeletePostInputDTO, EditPostInputDTO, GetByIdOutputDTO, GetPostsInputDTO, GetPostsInputDTO2, GetPostsOutputDTO, LikeOrDislikePostInputDTO, ReplyPostInputDTO } from "../dtos/userDTO";
import { BadRequestError } from "../errors/BadRequestError";
import { NotFoundError } from "../errors/NotFoundError";
import { Post } from "../models/Post";
import { IdGenerator } from "../services/IdGenerator";
import { TokenManager } from "../services/TokenManager";
import { LikeDislikeDB, PostECreatorDB, PostRDB, POST_LIKE, POST_REPLYED, USER_ROLES } from "../type";

export class PostBusiness {
    constructor(
        private postDatabase: PostDatabase,
        private idGenerator: IdGenerator,
        private tokenManager: TokenManager
    ) {}

    public getPosts = async (
        input: GetPostsInputDTO
    ): Promise<GetPostsOutputDTO> => {
        const { token } = input

        if (token === undefined) {
            throw new BadRequestError("token ausente")
        }

        const payload = this.tokenManager.getPayload(token)

        if (payload === null) {
            throw new BadRequestError("token inválido")
        }

        const postECreatorsDB: PostECreatorDB[] =
            await this.postDatabase
                .getPostsECreators()
        
        
        const posts = postECreatorsDB.map(
            (postECreatorDB) => {
                const post = new Post(
                    postECreatorDB.id,
                    postECreatorDB.content,
                    postECreatorDB.likes,
                    postECreatorDB.dislikes,
                    postECreatorDB.replys,
                    postECreatorDB.created_at,
                    postECreatorDB.updated_at,
                    postECreatorDB.creator_id,
                    postECreatorDB.creator_name
                )

                return post.toBusinessModel()
            }
        )

        const output: GetPostsOutputDTO = posts

        return output
    }
   

    public createPost = async (
        input: CreatePostInputDTO
    ): Promise<void> => {
        const { token, content } = input

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

        const post = new Post(
            id,
            content,
            0,
            0,
            0,
            createdAt,
            updatedAt,
            creatorId,
            creatorName
        )
        
        
        const postDB = post.toDBModel()

        await this.postDatabase.insert(postDB)
    }

    public editPost = async (
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

        const postDB = await this.postDatabase.findById(idToEdit)

        if (!postDB) {
            throw new NotFoundError("'id' não encontrado")
        }

        const creatorId = payload.id

        if (postDB.creator_id !== creatorId) {
            throw new BadRequestError("somente quem criou o post pode editar")
        }

        const creatorName = payload.name

        const post = new Post(
            postDB.id,
            postDB.content,
            postDB.replys,
            postDB.likes,
            postDB.dislikes,
            postDB.created_at,
            postDB.updated_at,
            creatorId,
            creatorName
        )

        post.setContent(content)
        post.setUpdatedAt(new Date().toISOString())

        const updatedPostDB = post.toDBModel()

        await this.postDatabase.update(idToEdit, updatedPostDB)
    }

    public deletePost = async (
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

        const postDB = await this.postDatabase.findById(idToDelete)

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

        await this.postDatabase.delete(idToDelete)
    }

    public likeOrDislikePost = async (
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

        const postECreatorDB = await this.postDatabase
            .findPostECreatorById(idToLikeOrDislike)

        if (!postECreatorDB) {
            throw new NotFoundError("'id' não encontrado")
        }

        const userId = payload.id
        const likeSQLite = like ? 1 : 0

        const likeDislikeDB: LikeDislikeDB = {
            user_id: userId,
            post_id: postECreatorDB.id,
            like: likeSQLite
        }

        const post = new Post(
            postECreatorDB.id,
            postECreatorDB.content,
            postECreatorDB.likes,
            postECreatorDB.dislikes,
            postECreatorDB.replys,
            postECreatorDB.created_at,
            postECreatorDB.updated_at,
            postECreatorDB.creator_id,
            postECreatorDB.creator_name
        )

        const likeDislikeExists = await this.postDatabase
            .findLikeDislike(likeDislikeDB)

        if (likeDislikeExists === POST_LIKE.ALREADY_LIKED) {
            if (like) {
                await this.postDatabase.removeLikeDislike(likeDislikeDB)
                post.removeLike()
            } else {
                await this.postDatabase.updateLikeDislike(likeDislikeDB)
                post.removeLike()
                post.addDislike()
            }

        } else if (likeDislikeExists === POST_LIKE.ALREADY_DISLIKED) {
            if (like) {
                await this.postDatabase.updateLikeDislike(likeDislikeDB)
                post.removeDislike()
                post.addLike()
            } else {
                await this.postDatabase.removeLikeDislike(likeDislikeDB)
                post.removeDislike()
            }

        } else {
            await this.postDatabase.likeOrDislikePost(likeDislikeDB)
    
            like ? post.addLike() : post.addDislike()
        }

        const updatedPostDB = post.toDBModel()
    
        await this.postDatabase.update(idToLikeOrDislike, updatedPostDB)
    }
    public addReply = async (
        input: ReplyPostInputDTO
    ): Promise<void> => {
        const {  postIdToReply, token, reply } = input

        if (token === undefined) {
            throw new BadRequestError("token ausente")
        }

        const payload = this.tokenManager.getPayload(token)

        if (payload === null) {
            throw new BadRequestError("token inválido")
        }
        const postECreatorDB = await this.postDatabase
        .findPostECreatorById(postIdToReply)
       
        if (!postECreatorDB) {
            throw new NotFoundError("'id' não encontrado")
        }

        


        const post = new Post(
            postECreatorDB.id,
            postECreatorDB.content,
            postECreatorDB.likes,
            postECreatorDB.dislikes,
            postECreatorDB.replys,
            postECreatorDB.created_at,
            postECreatorDB.updated_at,
            postECreatorDB.creator_id,
            postECreatorDB.creator_name
        )

        
        if (reply) {
            
        
            post.addReplys()
        }


        const updatedPostDB = post.toDBModel()
    
        await this.postDatabase.update(postIdToReply, updatedPostDB)
    }
    public getPostsById = async (input: GetPostsInputDTO2): Promise<GetByIdOutputDTO> => {
        const { id, token } = input
        
        if (typeof token !== "string") {
            throw new BadRequestError("requer token")
        }
        const payload = this.tokenManager.getPayload(token)

        if (!payload) {
            throw new BadRequestError("token inválido")
        }
        const postECreatorDB = await this.postDatabase
        .findPostECreatorById(id)
        if (!postECreatorDB) {
            throw new NotFoundError("'id' não existe")
        }

        const post = new Post(
            postECreatorDB.id ,
            postECreatorDB.content,
            postECreatorDB.likes ,
            postECreatorDB.dislikes ,
            postECreatorDB.replys ,
            postECreatorDB.created_at ,
            postECreatorDB.updated_at ,
            postECreatorDB.creator_id ,
            postECreatorDB.creator_name
        )
        
        const output: GetByIdOutputDTO = {
            post: post.toBusinessModel()
        }
        return output
    }
}


