# Modern Next.js 15 Blog with Hygraph, Apollo, and shadcn/ui

## Overview

This project is a modern, full-featured blog platform built with Next.js 15, TypeScript, Hygraph (GraphQL CMS), Apollo Client, and shadcn/ui (Radix UI components). It demonstrates best practices for building scalable, maintainable, and visually appealing web applications using the latest React and Next.js features. The blog supports static site generation, dynamic routing, GraphQL data fetching, and a beautiful, responsive UI with Tailwind CSS and shadcn/ui components.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Setup & Installation](#setup--installation)
- [Environment Variables](#environment-variables)
- [Development Workflow](#development-workflow)
- [GraphQL & Hygraph Integration](#graphql--hygraph-integration)
- [UI Components & Styling](#ui-components--styling)
- [Static Generation & Routing](#static-generation--routing)
- [API Routes](#api-routes)
- [Code Generation](#code-generation)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

---

## Features

- **Next.js 15**: Latest app and pages router support, static and dynamic routing, fast builds.
- **TypeScript**: Type-safe codebase for reliability and maintainability.
- **Hygraph (GraphQL CMS)**: Headless CMS for content management, with GraphQL API.
- **Apollo Client**: Modern GraphQL client for efficient data fetching and caching.
- **shadcn/ui & Radix UI**: Beautiful, accessible UI components.
- **Tailwind CSS**: Utility-first CSS for rapid, responsive design.
- **Static Site Generation (SSG)**: Fast, SEO-friendly blog pages.
- **Dynamic Routing**: Clean URLs for posts, e.g., `/posts/[slug]`.
- **API Routes**: Custom API endpoints for posts and more.
- **Codegen**: Automatic TypeScript types from GraphQL schema.
- **.env Support**: Secure environment variable management.

---

## Tech Stack

- **Framework**: Next.js 15, React 19
- **Language**: TypeScript
- **CMS**: Hygraph (GraphQL)
- **GraphQL Client**: Apollo Client
- **UI Library**: shadcn/ui, Radix UI, Tailwind CSS
- **Other**: class-variance-authority, clsx, date-fns, recharts, zod

---

## Project Structure

```
├── app/                # App router (API routes, etc.)
├── components/         # UI components (shadcn/ui, custom)
├── hooks/              # Custom React hooks
├── pages/              # Pages router (index, posts/[slug])
├── public/             # Static assets
├── src/
│   ├── lib/            # GraphQL, Apollo, utility functions
│   ├── pages/          # Main pages (for SSG)
│   ├── styles/         # Global styles
│   ├── types/          # Generated and custom types
├── styles/             # Tailwind global styles
├── .env                # Environment variables
├── package.json        # Project metadata and scripts
├── README.md           # Project documentation
```

---

## Setup & Installation

1. **Clone the repository:**
   ```sh
   git clone <repo-url>
   cd <project-folder>
   ```
2. **Install dependencies:**
   ```sh
   pnpm install
   # or
   npm install
   ```
3. **Configure environment variables:**
   - Copy `.env.example` to `.env` and fill in your Hygraph endpoint and token.
   ```env
   HYGRAPH_ENDPOINT=https://api-eu-west-2.hygraph.com/v2/your-project-id/master
   HYGRAPH_TOKEN=your-hygraph-permanent-auth-token
   ```
4. **Run the development server:**
   ```sh
   pnpm dev
   # or
   npm run dev
   ```
5. **Open your browser:**
   - Visit [http://localhost:3000](http://localhost:3000)

---

## Environment Variables

- `HYGRAPH_ENDPOINT`: Your Hygraph GraphQL API endpoint.
- `HYGRAPH_TOKEN`: (Optional) Auth token for private content.

Keep your `.env` file out of version control (see `.gitignore`).

---

## Development Workflow

- **Start Dev Server:** `pnpm dev` or `npm run dev`
- **Build for Production:** `pnpm build` or `npm run build`
- **Lint:** `pnpm lint` or `npm run lint`
- **Start Production Server:** `pnpm start` or `npm start`

---

## GraphQL & Hygraph Integration

- All content is managed in Hygraph and fetched via GraphQL.
- Apollo Client is used for client-side queries and caching.
- Static generation uses server-side GraphQL requests for fast, SEO-friendly pages.
- GraphQL queries and types are defined in `src/lib/queries` and `src/types/generated.ts`.
- Use the Hygraph UI to create, edit, and publish posts. Each post must have a unique `slug`.

---

## UI Components & Styling

- Uses shadcn/ui and Radix UI for accessible, modern components (buttons, cards, badges, etc.).
- Tailwind CSS for utility-first styling and responsive layouts.
- Custom components in `components/ui` and `components/`.
- Theme support via `theme-provider.tsx` and `next-themes`.

---

## Static Generation & Routing

- Blog index: `/` (lists all posts)
- Post detail: `/posts/[slug]` (dynamic route, statically generated)
- Uses `getStaticPaths` and `getStaticProps` for SSG.
- Handles 404s for missing/unpublished posts.

---

## API Routes

- Custom API route: `/api/posts` (see `app/api/posts/route.ts`)
- Returns all posts as JSON for client-side refresh and integration.

---

## Code Generation

- Uses GraphQL Code Generator to create TypeScript types from the Hygraph schema.
- Types are stored in `src/types/generated.ts`.
- To update types, run the codegen script (see `package.json` or `codegen.yml`).

---

## Troubleshooting

- **404 on post page:** Ensure the post exists and is published in Hygraph, and the slug matches exactly.
- **GraphQL 400 error:** Check for missing/null fields in Hygraph for the requested post. Only query fields that exist and are published.
- **Image not loading:** Make sure `coverImage` is set and published for the post, and the query requests `coverImage { url }`.
- **Environment variables not loaded:** Check your `.env` file and restart the dev server after changes.
- **Refresh button error:** Ensure the API route `/api/posts` exists and returns JSON.

---

## Contributing

1. Fork the repo and create your branch from `main`.
2. Make your changes and add tests if needed.
3. Ensure code style and linting pass.
4. Submit a pull request with a clear description.

---

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.

---

## Credits

- [Next.js](https://nextjs.org/)
- [Hygraph](https://hygraph.com/)
- [Apollo Client](https://www.apollographql.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Radix UI](https://www.radix-ui.com/)
- [Tailwind CSS](https://tailwindcss.com/)

---

For questions or support, open an issue or contact the maintainer.
