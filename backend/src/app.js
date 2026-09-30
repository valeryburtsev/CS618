import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import { ApolloServer } from '@apollo/server'
import { expressMiddleware } from '@as-integrations/express5'
import { typeDefs, resolvers } from './graphql/index.js'
import { postsRoutes } from './routes/posts.js'
import { userRoutes } from './routes/users.js'
import { eventRoutes } from './routes/events.js'
import { optionalAuth } from './middleware/jwt.js'

const app = express()
app.use(express.json())
app.use(bodyParser.json())
app.use(cors())

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
})

apolloServer.start().then(() =>
  app.use(
    '/graphql',
    optionalAuth,
    expressMiddleware(apolloServer, {
      context: async ({ req }) => {
        return { auth: req.auth }
      },
    }),
  ),
)

app.get('/', (req, res) => {
  res.send('test11')
})

postsRoutes(app)
userRoutes(app)
eventRoutes(app)

export { app }
