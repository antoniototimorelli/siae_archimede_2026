import { Router } from 'express'
import { register } from '../controllers/register.controller'

export const registerRouter: Router = Router()

registerRouter.post('/register', register)
