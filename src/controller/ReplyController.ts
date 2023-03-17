import { Request, Response } from "express"
import { ReplyBusiness } from "../business/ReplyBusiness"
import { CreatePostInputDTO,CreateReplyInputDTO, DeletePostInputDTO, EditPostInputDTO, GetPostsInputDTO, LikeOrDislikePostInputDTO, ReplyPostInputDTO } from "../dtos/userDTO"
import { BaseError } from "../errors/BaseError"

export class ReplyController {
    constructor(
        private replyBusiness: ReplyBusiness
    ) {}

    public getReply = async (req: Request, res: Response) => {
        try {
            const input: GetPostsInputDTO = {
                token: req.headers.authorization
            }

            const output = await this.replyBusiness.getReplys(input)

            res.status(200).send(output)
        } catch (error) {
            console.log(error)
            if (error instanceof BaseError) {
                res.status(error.statusCode).send(error.message)
            } else {
                res.status(500).send("Erro inesperado")
            }
        }
    }

    public createReply = async (req: Request, res: Response) => {
        try {
            const input: CreateReplyInputDTO = {
                token: req.headers.authorization,
                content: req.body.content,
               postId: req.body.id
            }

            await this.replyBusiness.createReply(input)

            res.status(201).end()
        } catch (error) {
            console.log(error)
            if (error instanceof BaseError) {
                res.status(error.statusCode).send(error.message)
            } else {
                res.status(500).send("Erro inesperado")
            }
        }
    }
 

    public editReply= async (req: Request, res: Response) => {
        try {
            const input: EditPostInputDTO = {
                idToEdit: req.params.id,
                content: req.body.content,
                token: req.headers.authorization
            }

            await this.replyBusiness.editReply(input)

            res.status(200).end()
        } catch (error) {
            console.log(error)
            if (error instanceof BaseError) {
                res.status(error.statusCode).send(error.message)
            } else {
                res.status(500).send("Erro inesperado")
            }
        }
    }


    public deleteReply = async (req: Request, res: Response) => {
        try {
            const input: DeletePostInputDTO = {
                idToDelete: req.params.id,
                token: req.headers.authorization
            }

            await this.replyBusiness.deleteReply(input)

            res.status(200).end()
        } catch (error) {
            console.log(error)
            if (error instanceof BaseError) {
                res.status(error.statusCode).send(error.message)
            } else {
                res.status(500).send("Erro inesperado")
            }
        }
    }

    public likeOrDislikeReply = async (req: Request, res: Response) => {
        try {
            const input: LikeOrDislikePostInputDTO = {
                idToLikeOrDislike: req.params.id,
                token: req.headers.authorization,
                like: req.body.like
            }

            await this.replyBusiness.likeOrDislikeReply(input)

            res.status(200).end()
        } catch (error) {
            console.log(error)
            if (error instanceof BaseError) {
                res.status(error.statusCode).send(error.message)
            } else {
                res.status(500).send("Erro inesperado")
            }
        }
    }}
    