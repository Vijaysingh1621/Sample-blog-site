

import type { GetStaticProps, GetStaticPaths } from "next"
import Head from "next/head"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Calendar, User, Clock, Share2, Tag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { getPostBySlug, getAllPosts } from "@/lib/hygraph"
import type { Post } from "@/types/generated"

interface PostPageProps {
  post: Post
}

export default function PostPage({ post }: PostPageProps) {
  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h2 className="text-2xl font-bold">Post not found</h2>
        <Link href="/">
          <Button variant="ghost" className="ml-4">Back to Blog</Button>
        </Link>
      </div>
    );
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: post.excerpt,
          url: window.location.href,
        });
      } catch (error) {
        console.log("Error sharing:", error);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <>
      <Head>
        <title>{post.title} - Modern Blog</title>
        <meta name="description" content={post.excerpt} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.excerpt} />
        <meta property="og:image" content={post.coverImage && post.coverImage[0]?.url} />
        <meta property="og:type" content="article" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen bg-white">
        {/* Header */}
        <header className="border-b border-gray-200">
          <div className="container mx-auto px-4 py-4">
            <Link href="/">
              <Button variant="ghost" className="flex items-center gap-2 text-black hover:bg-gray-100">
                <ArrowLeft className="h-4 w-4" />
                Back to Blog
              </Button>
            </Link>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8 max-w-4xl">
          {/* Article Header */}
          <div className="mb-8">
            <div className="mb-4">
              <Badge className="bg-black text-white">{post.category}</Badge>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-black mb-4 leading-tight">{post.title}</h1>

            <p className="text-xl text-gray-600 mb-6 leading-relaxed">{post.excerpt}</p>

            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 mb-6">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>
                  {post.publishedAt
                    ? new Date(post.publishedAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    : ""}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>{post.content ? Math.ceil(post.content.split(" ").length / 200) : 1} min read</span>
              </div>
              <Button
                onClick={handleShare}
                variant="ghost"
                size="sm"
                className="flex items-center gap-2 text-gray-500 hover:text-black"
              >
                <Share2 className="h-4 w-4" />
                Share
              </Button>
            </div>

            <div className="flex flex-wrap gap-2">
              {(() => {
                const tagArr: string[] = Array.isArray(post.tags)
                  ? post.tags
                  : (typeof post.tags === "string" && post.tags.length > 0
                      ? post.tags.split(",")
                      : []);
                return tagArr.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    <Tag className="h-2 w-2 mr-1" />
                    {tag}
                  </Badge>
                ));
              })()}
            </div>
          </div>

          {/* Featured Image */}
          {post.coverImage && post.coverImage[0] && (
            <div className="mb-8">
              <Image
                src={post.coverImage[0].url || "/placeholder.svg?height=400&width=800"}
                alt={post.title}
                width={800}
                height={400}
                className="w-full h-64 md:h-96 object-cover rounded-lg shadow-lg"
              />
            </div>
          )}

          {/* Article Content */}
          <Card className="border-0 shadow-none">
            <CardContent className="p-0">
              <div
                className="prose prose-lg max-w-none prose-headings:text-black prose-p:text-gray-700 prose-a:text-black prose-strong:text-black"
                dangerouslySetInnerHTML={{ __html: post.content || "" }}
              />
            </CardContent>
          </Card>

        </main>
      </div>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = await getAllPosts()
  const paths = posts.map((post) => ({
    params: { slug: post.slug },
  }))

  return {
    paths,
    fallback: "blocking",
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  try {
    const post = await getPostBySlug(params?.slug as string)

    if (!post) {
      return {
        notFound: true,
      }
    }

    return {
      props: {
        post,
      },
      revalidate: 60,
    }
  } catch (error) {
    console.error("Error fetching post:", error)
    return {
      notFound: true,
    }
  }
}
