import { Router } from 'express'
import { healthRouter } from './health.routes'

export const router: Router = Router()

router.use('/health', healthRouter)
