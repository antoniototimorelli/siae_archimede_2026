import { Router } from 'express'
import { healthRouter } from './health.routes'
import { authRouter } from './auth.routes'
import { userRouter } from './user.routes'
import { registerRouter } from './register.routes'

export const router: Router = Router()

router.use('/health', healthRouter)
router.use('/auth', authRouter)
router.use('/users', userRouter)
router.use(registerRouter)
