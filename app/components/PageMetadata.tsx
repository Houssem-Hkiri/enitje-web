import { Metadata } from 'next';

export interface PageMetadataProps {
  title: string;
  description: string;
  canonicalPath?: string;
  ogImage?: string;
  ogType?: 'website' | 'article';
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  keywords?: string[];
  noIndex?: boolean;
}

/**
 * Generates metadata for a specific page
 * Usage:
 * export const metadata = generateMetadata({
 *   title: 'Page Title',
 *   description: 'Page description'
 * });
 */
export function generateMetadata({
  title,
  description,
  canonicalPath = '',
  ogImage = '/images/og/default.jpg',
  ogType = 'website',
  publishedTime,
  modifiedTime,
  author = 'ENIT Junior Entreprise',
  keywords = [],
  noIndex = false,
}: PageMetadataProps): Metadata {
  // Base URL from environment or default
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://enitje.com';
  
  // Combine base keywords with page-specific keywords
  const baseKeywords = [
    'ENIT',
    'Junior Entreprise',
    'Tunisia',
    'engineering',
    'innovation',
  ];
  
  const allKeywords = [...baseKeywords, ...keywords];
  
  // Construct the canonical URL
  const canonicalUrl = `${baseUrl}${canonicalPath}`;
  
  // Construct the OG image URL
  const ogImageUrl = ogImage.startsWith('http') ? ogImage : `${baseUrl}${ogImage}`;
  
  return {
    title,
    description,
    keywords: allKeywords,
    authors: [{ name: author }],
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: 'ENIT Junior Entreprise',
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: 'fr_TN',
      type: ogType,
      ...(publishedTime && { publishedTime }),
      ...(modifiedTime && { modifiedTime }),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImageUrl],
    },
    robots: noIndex
      ? { index: false, follow: false }
      : {
          index: true,
          follow: true,
          nocache: false,
          googleBot: {
            index: true,
            follow: true,
            'max-image-preview': 'large',
            'max-snippet': -1,
            'max-video-preview': -1,
          },
        },
  };
}

/**
 * Generates article structured data for blog posts
 */
export function generateArticleSchema({
  title,
  description,
  canonicalPath,
  ogImage = '/images/og/default.jpg',
  publishedTime,
  modifiedTime,
  author = 'ENIT Junior Entreprise',
}: PageMetadataProps) {
  // Base URL from environment or default
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://enitje.com';
  
  // Construct the canonical URL
  const canonicalUrl = `${baseUrl}${canonicalPath}`;
  
  // Construct the OG image URL
  const ogImageUrl = ogImage.startsWith('http') ? ogImage : `${baseUrl}${ogImage}`;
  
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description: description,
    image: ogImageUrl,
    datePublished: publishedTime,
    dateModified: modifiedTime || publishedTime,
    author: {
      '@type': 'Organization',
      name: author,
      url: baseUrl,
    },
    publisher: {
      '@type': 'Organization',
      name: 'ENIT Junior Entreprise',
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/images/logo.webp`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': canonicalUrl,
    },
  };
} 