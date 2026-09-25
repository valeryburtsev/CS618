import mongoose from 'mongoose'
import {
  createPost,
  listAllPosts,
  listPostsByAuthor,
  listPostsByTag,
  getPostById,
  updatePost,
  deletePost,
} from '../services/post.js'
import { requireAuth } from '../middleware/jwt.js'

function handleError(res, err) {
  if (err instanceof mongoose.Error.ValidationError) {
    return res.status(400).json({ error: err.message })
  }
  if (err instanceof mongoose.Error.CastError) {
    return res.status(400).json({ error: 'invalid id' })
  }
  console.error(err)
  return res.status(500).json({ error: 'internal server error' })
}

export function postsRoutes(app) {
  app.get('/api/v1/posts', async (req, res) => {
    const { sortBy, sortOrder, author, tag } = req.query
    const options = { sortBy, sortOrder }
    try {
      if (author && tag) {
        return res
          .status(400)
          .json({ error: 'query by either author or tag, not both' })
      } else if (author) {
        return res.json(await listPostsByAuthor(author, options))
      } else if (tag) {
        return res.json(await listPostsByTag(tag, options))
      } else {
        return res.json(await listAllPosts(options))
      }
    } catch (err) {
      return handleError(res, err)
    }
  })

  app.get('/api/v1/posts/:id', async (req, res) => {
    try {
      const post = await getPostById(req.params.id)
      if (post === null) return res.status(404).end()
      return res.json(post)
    } catch (err) {
      return handleError(res, err)
    }
  })

  app.post('/api/v1/posts', requireAuth, async (req, res) => {
    try {
      const post = await createPost(req.auth.sub, req.body)
      return res.status(201).json(post)
    } catch (err) {
      return handleError(res, err)
    }
  })

  app.patch('/api/v1/posts/:id', requireAuth, async (req, res) => {
    try {
      const post = await updatePost(req.auth.sub, req.params.id, req.body)
      if (post === null) return res.status(404).end()
      return res.json(post)
    } catch (err) {
      return handleError(res, err)
    }
  })

  app.delete('/api/v1/posts/:id', requireAuth, async (req, res) => {
    try {
      const { deletedCount } = await deletePost(req.auth.sub, req.params.id)
      if (deletedCount === 0) return res.status(404).end()
      return res.status(204).end()
    } catch (err) {
      return handleError(res, err)
    }
  })
}
