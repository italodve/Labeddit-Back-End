import express  from "express";
import { ReplyBusiness } from '../business/ReplyBusiness'
import { ReplyController } from '../controller/ReplyController'
import { ReplyDatabase } from '../database/ReplyDatabase'
import { IdGenerator } from '../services/IdGenerator'
import { TokenManager } from '../services/TokenManager'

export const replysRouter = express.Router()


const replyController = new ReplyController(
    new ReplyBusiness(
        new ReplyDatabase(),
        new IdGenerator(),
        new TokenManager()
    )
)

replysRouter.get("/", replyController.getReply)
replysRouter.post("/", replyController.createReply)
replysRouter.put("/:id", replyController.editReply)
replysRouter.delete("/:id", replyController.deleteReply)
replysRouter.put("/:id/like", replyController.likeOrDislikeReply)
