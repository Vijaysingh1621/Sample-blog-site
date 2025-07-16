"use client"

import { useState, useEffect } from "react"
import type { GetStaticProps } from "next"
import Head from "next/head"
import Image from "next/image"
import Link from "next/link"
import { Search, RefreshCw, Calendar, User, ArrowRight, Tag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import client from "@/lib/apolloClient"
import { gql } from "@apollo/client"
import type { Post } from "@/types/generated"
import { getAllPosts } from "../lib/hygraph"

interface HomeProps {
  initialPosts: Post[]
}

export default function Home({ initialPosts }: HomeProps) {
  const [posts, setPosts] = useState<Post[]>(initialPosts)
  const [filteredPosts, setFilteredPosts] = useState<Post[]>(initialPosts)
  const [searchQuery, setSearchQuery] = useState("")
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Filter posts based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredPosts(posts)
      return
    }

    const filtered = posts.filter(
      (post) =>
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (Array.isArray(post.tags)
          ? post.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
          : post.tags.toLowerCase().includes(searchQuery.toLowerCase())),
    )
    setFilteredPosts(filtered)
  }, [searchQuery, posts])

  const handleRefresh = async () => {
    setIsRefreshing(true)
    try {
      const { data } = await client.query({
        query: gql`
          query GetAllPosts {
            posts(orderBy: publishedAt_DESC) {
              id
              title
              slug
              excerpt
              publishedAt
              category
              tags
              coverImage {
                url
              }
            }
          }
        `,
      })
      setPosts(data.posts)
      setFilteredPosts(data.posts)
    } catch (error) {
      console.error("Error refreshing posts:", error)
    } finally {
      setIsRefreshing(false)
    }
  }

  return (
    <>
      <Head>
        <title>Modern Blog - Latest Articles & Insights</title>
        <meta
          name="description"
          content="Discover the latest articles, insights, and stories on our modern blog platform."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-white">
        {/* Header */}
        <header className="border-b border-gray-200 bg-white sticky top-0 z-50">
          <div className="container mx-auto px-4 py-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-black">Modern Blog</h1>
                <p className="text-gray-600 mt-1">Discover amazing stories and insights</p>
              </div>

              <div className="flex items-center gap-4">
                <div className="relative flex-1 md:w-80">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    type="text"
                    placeholder="Search articles, tags, categories..."
                    value={searchQuery}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                    className="pl-10 border-gray-300 focus:border-black focus:ring-black"
                  />
                </div>

                <Button
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  variant="outline"
                  className="border-gray-300 hover:bg-gray-50 flex items-center gap-2 bg-transparent"
                >
                  <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
                  Refresh
                </Button>
              </div>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          {/* Search Results Info */}
          {searchQuery && (
            <div className="mb-6">
              <p className="text-gray-600">
                Found {filteredPosts.length} article{filteredPosts.length !== 1 ? "s" : ""} for "{searchQuery}"
              </p>
            </div>
          )}

          {/* Blog Posts Grid */}
          {filteredPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post) => (
                <Card
                  key={post.id}
                  className="group hover:shadow-lg transition-all duration-300 border-gray-200 hover:border-gray-300"
                >
                  <div className="relative overflow-hidden">
                    <Image
                      src={post.coverImage?.[0]?.url || "/placeholder.svg?height=200&width=400"}
                      alt={post.title}
                      width={400}
                      height={200}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-black text-white hover:bg-gray-800">{post.category}</Badge>
                    </div>
                  </div>

                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-2">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>
                          {post.publishedAt
                            ? new Date(post.publishedAt).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })
                            : ""}
                        </span>
                      </div>
                    </div>

                    <h2 className="text-xl font-bold text-black group-hover:text-gray-700 transition-colors line-clamp-2">
                      {post.title}
                    </h2>
                  </CardHeader>

                  <CardContent className="pt-0">
                    <p className="text-gray-600 line-clamp-2 mb-4">{post.excerpt}</p>

                    <div className="flex flex-wrap gap-1 mb-4">
                      {(() => {
                        const tagArr: string[] = Array.isArray(post.tags)
                          ? post.tags
                          : (typeof post.tags === "string" && post.tags.length > 0
                              ? post.tags.split(",")
                              : []);
                        return tagArr.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            <Tag className="h-2 w-2 mr-1" />
                            {tag}
                          </Badge>
                        ));
                      })()}
                      {(() => {
                        const tagArr = Array.isArray(post.tags) ? post.tags : (post.tags ? post.tags.split(",") : []);
                        return tagArr.length > 3 ? (
                          <Badge variant="outline" className="text-xs">
                            +{tagArr.length - 3}
                          </Badge>
                        ) : null;
                      })()}
                    </div>

                    <Link href={`/posts/${post.slug}`}>
                      <Button
                        variant="ghost"
                        className="w-full justify-between group-hover:bg-gray-50 text-black hover:text-black"
                      >
                        Read Article
                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <Search className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-black mb-2">No articles found</h3>
              <p className="text-gray-600 mb-4">
                {searchQuery
                  ? `No articles match your search for "${searchQuery}"`
                  : "No articles available at the moment"}
              </p>
              {searchQuery && (
                <Button
                  onClick={() => setSearchQuery("")}
                  variant="outline"
                  className="border-gray-300 hover:bg-gray-50"
                >
                  Clear Search
                </Button>
              )}
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="border-t border-gray-200 bg-gray-50 mt-16">
          <div className="container mx-auto px-4 py-8">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-black mb-2">Modern Blog</h3>
              <p className="text-gray-600 text-sm">© 2024 Modern Blog. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  try {
    const posts = await getAllPosts()

    return {
      props: {
        initialPosts: posts,
      },
      revalidate: 60, // Revalidate every minute
    }
  } catch (error) {
    console.error("Error fetching posts:", error)
    return {
      props: {
        initialPosts: [],
      },
      revalidate: 60,
    }
  }
}
