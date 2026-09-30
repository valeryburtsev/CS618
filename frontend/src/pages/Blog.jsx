import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { getPosts } from '../api/posts.js'
import { CreatePost } from '../components/CreatePost.jsx'
import { Header } from '../components/Header.jsx'
import { PostFilter } from '../components/PostFilter.jsx'
import { PostSorting } from '../components/PostSorting.jsx'
import { PostList } from '../components/PostList.jsx'
import '../App.css'
import { Helmet } from 'react-helmet-async'

export function Blog() {
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
      <Helmet>
        <title>Full-Stack React Blog</title>
        <meta
          name='description'
          content='A blog full of articles about full-stack React development.'
        />
        <meta property='og:type' content='website' />
        <meta property='og:title' content='Full-Stack React Blog' />
        <meta
          property='og:description'
          content='A blog full of articles about full-stack React development.'
        />
      </Helmet>
      <Header />
      <hr />
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
