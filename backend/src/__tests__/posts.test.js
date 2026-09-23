import mongoose from 'mongoose'
import { describe, expect, test, beforeEach } from '@jest/globals'
import {
  createPost,
  listAllPosts,
  listPostsByAuthor,
  listPostsByTag,
  getPostById,
  updatePost,
  deletePost,
} from '../services/post.js'
import { Post } from '../db/models/post.js'

const samplePosts = [
  { title: 'Learning Redux', author: 'Daniel Bugl', tags: ['redux'] },
  { title: 'Learn React Hooks', author: 'Daniel Bugl', tags: ['react'] },
  {
    title: 'Full-Stack React Projects',
    author: 'Daniel Bugl',
    tags: ['react', 'nodejs'],
  },
  { title: 'Guide to TypeScript' },
]

let createdSamplePosts = []

beforeEach(async () => {
  await Post.deleteMany({})
  createdSamplePosts = []
  for (const post of samplePosts) {
    const createdPost = new Post(post)
    createdSamplePosts.push(await createdPost.save())
  }
})

describe('listing posts', () => {
  test('should return all posts', async () => {
    const posts = await listAllPosts()
    expect(posts.length).toBe(createdSamplePosts.length)
  })

  test('should be able to sort by title ascending', async () => {
    const posts = await listAllPosts({
      sortBy: 'title',
      sortOrder: 'ascending',
    })
    expect(posts.map((post) => post.title)).toEqual([
      'Full-Stack React Projects',
      'Guide to TypeScript',
      'Learn React Hooks',
      'Learning Redux',
    ])
  })

  test('should be able to filter posts by author', async () => {
    const posts = await listPostsByAuthor('Daniel Bugl')
    expect(posts.length).toBe(3)
    expect(posts.every((post) => post.author === 'Daniel Bugl')).toBe(true)
  })

  test('should return no posts for an unknown author', async () => {
    const posts = await listPostsByAuthor('Nobody At All')
    expect(posts).toEqual([])
  })

  test('should be able to filter posts by tag', async () => {
    const posts = await listPostsByTag('react')
    expect(posts.map((post) => post.title).sort()).toEqual([
      'Full-Stack React Projects',
      'Learn React Hooks',
    ])
  })
})

describe('getting a post', () => {
  test('should return the full post', async () => {
    const post = await getPostById(createdSamplePosts[0]._id)
    expect(post.toObject()).toEqual(createdSamplePosts[0].toObject())
  })

  test('should fail if the id does not exist', async () => {
    const post = await getPostById('000000000000000000000000')
    expect(post).toEqual(null)
  })
})

describe('updating posts', () => {
  test('should update the specified property', async () => {
    await updatePost(createdSamplePosts[0]._id, {
      author: 'Test Author',
    })

    const updatedPost = await Post.findById(createdSamplePosts[0]._id)
    expect(updatedPost.author).toEqual('Test Author')
  })

  test('should not update other properties', async () => {
    await updatePost(createdSamplePosts[0]._id, {
      author: 'Test Author',
    })

    const updatedPost = await Post.findById(createdSamplePosts[0]._id)
    expect(updatedPost.title).toEqual('Learning Redux')
    expect(updatedPost.tags).toEqual(['redux'])
  })

  test('should update the updatedAt timestamp', async () => {
    await updatePost(createdSamplePosts[0]._id, {
      author: 'Test Author',
    })

    const updatedPost = await Post.findById(createdSamplePosts[0]._id)
    expect(updatedPost.updatedAt.getTime()).toBeGreaterThan(
      createdSamplePosts[0].updatedAt.getTime(),
    )
  })

  test('should return the updated post', async () => {
    const returnedPost = await updatePost(createdSamplePosts[0]._id, {
      author: 'Test Author',
    })

    expect(returnedPost.author).toEqual('Test Author')
  })

  test('should fail if the id does not exist', async () => {
    const post = await updatePost('000000000000000000000000', {
      author: 'Test Author',
    })

    expect(post).toEqual(null)
  })

  test('should fail validation for an empty title', async () => {
    await expect(
      updatePost(createdSamplePosts[0]._id, { title: '' }),
    ).rejects.toThrow(mongoose.Error.ValidationError)
  })
})

describe('deleting posts', () => {
  test('should remove the post from the database', async () => {
    const result = await deletePost(createdSamplePosts[0]._id)
    expect(result.deletedCount).toEqual(1)

    const deletedPost = await Post.findById(createdSamplePosts[0]._id)
    expect(deletedPost).toEqual(null)
  })

  test('should fail if the id does not exist', async () => {
    const result = await deletePost('000000000000000000000000')
    expect(result.deletedCount).toEqual(0)
  })
})

describe('creating posts', () => {
  beforeEach(async () => {
    await Post.deleteMany({})
  })

  test('with all parameters should succeed', async () => {
    const payload = {
      title: 'Hello Mongoose!',
      author: 'Valery Burtsev',
      contents: 'This post is stored in a MongoDB database using Mongoose.',
      tags: ['mongoose', 'mongodb'],
    }

    const createdPost = await createPost(payload)
    expect(createdPost._id).toBeInstanceOf(mongoose.Types.ObjectId)

    const foundPost = await Post.findById(createdPost._id)
    expect(foundPost).toEqual(expect.objectContaining(payload))
    expect(foundPost.createdAt).toBeInstanceOf(Date)
    expect(foundPost.updatedAt).toBeInstanceOf(Date)
  })

  test('without title should fail', async () => {
    const post = {
      author: 'Valery Burtsev',
      contents: 'Post with no title',
      tags: ['empty'],
    }

    await expect(createPost(post)).rejects.toThrow(
      mongoose.Error.ValidationError,
    )
    await expect(createPost(post)).rejects.toThrow('`title` is required')
  })

  test('with minimal parameters should succeed', async () => {
    const post = { title: 'Only a title' }

    const createdPost = await createPost(post)
    expect(createdPost._id).toBeInstanceOf(mongoose.Types.ObjectId)
  })
})
