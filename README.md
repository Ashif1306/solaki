This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## SEO configuration

The production domain defaults to `https://solaki.id`. Set `SITE_URL` to the
canonical production origin before building if using a different domain. This
value controls canonical URLs, social metadata, JSON-LD, and the sitemap.
Optionally set `GOOGLE_SITE_VERIFICATION` to the Search Console verification
token (the meta tag content value), then rebuild and deploy.

The public homepage is listed in `/sitemap.xml`, referenced by `/robots.txt`.
Admin routes under `/solaki` and API responses use `X-Robots-Tag: noindex,
nofollow`; admin pages also have a robots meta tag. They remain crawlable so
search engines can read these directives. Authentication remains separate.
`/opengraph-image` generates the social sharing image locally at build time.

After deployment, submit `/sitemap.xml` in Google Search Console and inspect
the homepage URL. Use Google's Rich Results Test or Schema Markup Validator
to check the Organization, WebSite, and WebPage JSON-LD. Add future public
pages to the sitemap and give each its own canonical URL and metadata.

## Local development

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
