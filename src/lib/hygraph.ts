import { GraphQLClient } from "graphql-request"
import { GetAllPostsDocument, GetPostBySlugDocument, GetPostBySlugQuery } from "@/types/generated"

const endpoint = process.env.HYGRAPH_ENDPOINT!
const token = process.env.HYGRAPH_TOKEN

const client = new GraphQLClient(endpoint, {
  headers: {
    ...(token && { Authorization: `Bearer ${token}` }),
  },
})

export async function getAllPosts() {
  try {
    const data = await client.request(GetAllPostsDocument) as { posts: any[] }
    if (data.posts) {
      console.log("Available slugs:", data.posts.map(post => post.slug))
    }
    return data.posts || []
  } catch (error) {
    console.error("Error fetching posts:", error)
    return []
  }
}

export async function getPostBySlug(slug: string) {
  try {
    const query = `
      query GetPostBySlug($slug: String!) {
        posts(where: { slug: $slug }) {
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
    `;

    const variables = { slug };
    const data = await client.request(query, variables) as { posts: any[] };
    const post = data.posts?.[0];

    if (post) {
      console.log("Post found:", post);
      return post;
    } else {
      console.warn("No post found for slug:", slug);
      return null;
    }
  } catch (error) {
    console.error("Error fetching post:", error);
    return null;
  }
}



