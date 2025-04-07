# SEO Implementation Guide for ENIT Junior Entreprise

This document outlines the SEO improvements implemented for the ENIT Junior Entreprise website to enhance search visibility and user experience.

## SEO Enhancements Implemented

### 1. Optimized Sitemap

- **Enhanced sitemap.xml**: Added a comprehensive XML sitemap with updated pages, proper change frequencies, and priorities
- **Added image references**: Included image data for better image indexing
- **Updated lastmod dates**: Set to current dates to encourage more frequent crawling

### 2. Improved Robots.txt

- **Added crawler-specific directives**: Optimized crawling with rate limits for specific bots
- **Protected sensitive areas**: Blocked crawling of admin and API routes
- **Added sitemap reference**: Directly linked to the sitemap.xml file

### 3. Enhanced Metadata

- **Rich page metadata**: Added detailed title, description, and keywords throughout the site
- **Structured data**: Implemented Schema.org markup for organization information
- **Open Graph tags**: Added comprehensive social sharing metadata
- **Twitter Card Support**: Enhanced social sharing on Twitter
- **Language alternates**: Added proper hreflang tags for language variants

### 4. Security and Performance Headers

- **Enhanced HTTP headers**: Implemented security headers via Next.js middleware
- **Content Security Policy**: Added CSP to prevent XSS attacks
- **Strict Transport Security**: Enforced HTTPS across the site
- **Permissions Policy**: Limited sensitive browser features for enhanced privacy

### 5. Reusable Components

- **PageMetadata utility**: Created a reusable component for consistent metadata across pages
- **Article Schema Generator**: Added utility for rich article structured data

## How to Use the SEO Tools

### Page-Specific Metadata

To add SEO metadata to a specific page, create a `metadata.ts` file in the page directory:

```typescript
import { generateMetadata } from '../components/PageMetadata';

export default generateMetadata({
  title: 'Page Title',
  description: 'Detailed page description',
  canonicalPath: '/page-path',
  ogImage: '/images/og/page-image.jpg',
  // Add more page-specific properties as needed
});
```

### Adding Structured Data for Articles

For blog posts or news articles, use the article schema generator:

```typescript
import { generateArticleSchema } from '../components/PageMetadata';
import Script from 'next/script';

// In your page component:
return (
  <>
    <Script id="article-schema" type="application/ld+json">
      {JSON.stringify(
        generateArticleSchema({
          title: 'Article Title',
          description: 'Article description',
          canonicalPath: '/news/article-slug',
          publishedTime: '2024-04-07T00:00:00Z',
          // Add more article properties as needed
        })
      )}
    </Script>
    {/* Rest of your component */}
  </>
);
```

## Environment Variables

The SEO implementation uses these environment variables:

```
NEXT_PUBLIC_BASE_URL=https://enitje.com
NEXT_PUBLIC_GA_ID=G-XXXXXXXX
NEXT_PUBLIC_GOOGLE_VERIFICATION=verification-code
NEXT_PUBLIC_SITE_NAME=ENIT Junior Entreprise
```

Ensure these are properly set in your `.env.local` file and in your production environment.

## Google Search Console Integration

1. Register the site in [Google Search Console](https://search.google.com/search-console)
2. Use the HTML tag verification method and add the verification code to the `NEXT_PUBLIC_GOOGLE_VERIFICATION` environment variable
3. Submit the sitemap.xml URL in the Search Console

## SEO Monitoring and Maintenance

- Regularly update the `lastmod` date in the sitemap.xml when content changes
- Monitor Google Search Console for indexing issues
- Update page metadata for seasonal content changes or campaigns
- Add structured data for new content types as they're added to the site

---

For questions about the SEO implementation, contact the ENIT Junior Entreprise development team. 