import 'dotenv/config'
import express, { type Request, type Response } from 'express'
import cors from 'cors'
import { router } from './routes'

const app = express()
const port: number = Number(process.env.PORT) || 3000

app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
}))
app.use(express.json({ limit: '10mb' }))
  credentials: true
}))
app.use(express.json({ limit: '100kb' }))

app.get('/api/health', (_req: Request, res: Response) => res.json({ status: 'ok' }))
app.use('/api', router)

app.use((_req: Request, res: Response) => {
  res.status(404).json({ error: 'Not Found' })
})

app.listen(port, () => {
  console.log(`[siae-plus-backend] listening on http://localhost:${port}`)
})
