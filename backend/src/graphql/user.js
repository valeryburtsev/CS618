import { listPostsByAuthor } from '../services/post.js'

export const userSchema = `#graphql
  type User {
    username: String!
    posts: [Post!]!
  }
`

export const userResolver = {
  User: {
    posts: async (user) => {
      return await listPostsByAuthor(user.username)
    },
  },
}
