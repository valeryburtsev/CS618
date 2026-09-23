import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import { postsRoutes } from './routes/posts.js'

const app = express()
app.use(express.json())
app.use(bodyParser.json())
app.use(cors())

app.get('/', (req, res) => {
  res.send('test11')
})

postsRoutes(app)

export { app }
