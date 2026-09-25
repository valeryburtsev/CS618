import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { getPosts } from './api/posts.js'
import { CreatePost } from './components/CreatePost.jsx'
import { PostFilter } from './components/PostFilter.jsx'
import { PostSorting } from './components/PostSorting.jsx'
import { PostList } from './components/PostList.jsx'
import './App.css'

export function App() {
  const [author, setAuthor] = useState('')
  const [sortBy, setSortBy] = useState('createdAt')
  const [sortOrder, setSortOrder] = useState('descending')

  const postsQuery = useQuery({
    queryKey: ['posts', { author, sortBy, sortOrder }],
    queryFn: () => getPosts({ author, sortBy, sortOrder }),
  })

  const posts = postsQuery.data ?? []

  return (
    <div style={{ padding: 8 }}>
      <h1>Welcome to My Blog!!</h1>
      <CreatePost />
      <br />
      <hr />
      Filter by:
      <PostFilter field='author' value={author} onChange={setAuthor} />
      <br />
      <PostSorting
        fields={['createdAt', 'updatedAt']}
        value={sortBy}
        onChange={setSortBy}
        orderValue={sortOrder}
        onOrderChange={setSortOrder}
      />
      <hr />
      <PostList posts={posts} />
    </div>
  )
}
