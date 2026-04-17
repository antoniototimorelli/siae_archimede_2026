import { Router } from 'express'
import { authMiddleware } from '../middleware/auth.middleware'
import { getMe } from '../controllers/user.controller'

export const userRouter: Router = Router()

userRouter.get('/me', authMiddleware, getMe)
