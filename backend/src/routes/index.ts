import { Router } from 'express'
import { healthRouter } from './health.routes'
import { authRouter } from './auth.routes'
import { userRouter } from './user.routes'

export const router: Router = Router()

router.use('/health', healthRouter)
router.use('/auth', authRouter)
router.use('/users', userRouter)
