import React from 'react';
import { useLocation } from 'react-router-dom';

interface FAQ {
  question: string;
  answer: string;
}

interface ArticleProps {
  publishedTime: string;
  modifiedTime?: string;
  author: string;
  tags: string[];
}

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonical?: string;
  ogImage?: string;
  type?: string;
  noindex?: boolean;
  toolName?: string;
  faqs?: FAQ[];
  article?: ArticleProps;
}

export const SEO: React.FC<SEOProps> = ({
  title,
  description,
  keywords,
  canonical,
  ogImage = 'https://img365.in/og-image.png',
  type = 'website',
  noindex = false,
  toolName,
  faqs,
  article,
}) => {
  const location = useLocation();
  const baseUrl = 'https://img365.in';
  const currentUrl = `${baseUrl}${location.pathname}`;
  const finalTitle = title || 'img365.in - Free Online Image Converter & Compressor';
  const finalDescription = description || 'Convert and compress any image file (JPG, PNG, HEIC, WEBP, AVIF, TIFF) online for free. Image to PDF, PDF to Image, Background Remover - 100% client-side processing.';
  const finalKeywords = keywords || 'free online image converter, HEIC to JPG online, compress PNG size, convert AVIF to JPG, image size reducer online, PDF to JPG converter, JPG to PDF converter, image to PDF online, PDF converter free, background remover, image compressor online, PNG to JPG, JPG to PNG, WebP converter, image optimizer, reduce image size, batch image converter, free image tools, client-side image processing, privacy-focused image tools';
  const finalCanonical = canonical || currentUrl;

  // Tool-specific schema if toolName is provided
  const toolSchema = toolName ? {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: toolName,
    description: finalDescription,
    url: currentUrl,
    applicationCategory: 'MultimediaApplication',
    operatingSystem: 'Any',
    browserRequirements: 'Requires JavaScript. Works with Chrome, Firefox, Safari, Edge.',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'INR',
      availability: 'https://schema.org/InStock',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      ratingCount: '856',
      bestRating: '5',
      worstRating: '1',
    },
    author: {
      '@type': 'Organization',
      name: 'img365.in',
      url: baseUrl,
    },
    publisher: {
      '@type': 'Organization',
      name: 'img365.in',
      url: baseUrl,
    },
    datePublished: '2024-01-01',
    dateModified: new Date().toISOString().split('T')[0],
  } : null;

  // Article Schema
  const articleSchema = article ? {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': currentUrl,
    },
    headline: finalTitle,
    description: finalDescription,
    image: ogImage,
    author: {
      '@type': 'Person',
      name: article.author,
    },
    publisher: {
      '@type': 'Organization',
      name: 'img365.in',
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/icons/icon-512x512.png`,
      },
    },
    datePublished: article.publishedTime,
    dateModified: article.modifiedTime || article.publishedTime,
  } : null;

  // Default site schema
  const siteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'img365.in',
    description: finalDescription,
    url: baseUrl,
    applicationCategory: 'MultimediaApplication',
    operatingSystem: 'Any',
    browserRequirements: 'Requires JavaScript. Works with Chrome, Firefox, Safari, Edge.',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'INR',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '1247',
      bestRating: '5',
      worstRating: '1',
    },
    review: [
      {
        '@type': 'Review',
        author: { '@type': 'Person', name: 'Rajesh Kumar' },
        datePublished: '2024-11-15',
        reviewBody: 'Excellent tool! Converted my HEIC photos to JPG quickly. No upload needed, everything happens in browser. Highly recommended!',
        reviewRating: { '@type': 'Rating', ratingValue: '5', bestRating: '5' },
      },
      {
        '@type': 'Review',
        author: { '@type': 'Person', name: 'Priya Sharma' },
        datePublished: '2024-11-18',
        reviewBody: 'Best free image converter I\'ve used. The PDF conversion feature is amazing. Fast and completely private.',
        reviewRating: { '@type': 'Rating', ratingValue: '5', bestRating: '5' },
      },
      {
        '@type': 'Review',
        author: { '@type': 'Person', name: 'Amit Patel' },
        datePublished: '2024-11-20',
        reviewBody: 'Perfect for my business needs. Compresses images without quality loss. The batch processing saves so much time!',
        reviewRating: { '@type': 'Rating', ratingValue: '5', bestRating: '5' },
      },
    ],
    featureList: [
      'Image format conversion (HEIC, JPG, PNG, WebP, AVIF)',
      'Image compression with quality control',
      'PDF to image conversion',
      'Image to PDF conversion',
      'Background removal with AI',
      'Camera to PDF scanner',
      'Batch processing',
      'Client-side processing for privacy',
      'No file size limits',
      'No registration required',
    ],
    author: { '@type': 'Person', name: 'Harsh Mythri', email: 'supthenexte@gmail.com' },
    publisher: { '@type': 'Organization', name: 'img365.in', url: baseUrl },
  };

  // FAQ Schema
  const faqSchema = faqs && faqs.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  } : null;

  // HowTo Schema for tools
  const howToSchema = toolName ? {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: `How to use ${toolName}`,
    description: finalDescription,
    step: [
      { '@type': 'HowToStep', name: 'Upload', text: 'Upload your file by clicking the upload area or drag & drop' },
      { '@type': 'HowToStep', name: 'Configure', text: 'Adjust settings as needed for your requirements' },
      { '@type': 'HowToStep', name: 'Process', text: 'Click the process button to start' },
      { '@type': 'HowToStep', name: 'Download', text: 'Download your processed file instantly' },
    ],
    totalTime: 'PT1M',
    estimatedCost: {
      '@type': 'MonetaryAmount',
      currency: 'INR',
      value: '0',
    },
  } : null;

  return (
    <>
      {/* Basic Meta Tags */}
      <title>{finalTitle}</title>
      <meta name="description" content={finalDescription} />
      <meta name="keywords" content={finalKeywords} />
      {noindex && <meta name="robots" content="noindex, nofollow" />}
      {!noindex && <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />}
      <link rel="canonical" href={finalCanonical} />

      {/* Open Graph Tags */}
      <meta property="og:title" content={finalTitle} />
      <meta property="og:description" content={finalDescription} />
      <meta property="og:type" content={article ? 'article' : type} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content="img365.in" />
      <meta property="og:locale" content="en_IN" />

      {article && (
        <>
          <meta property="article:published_time" content={article.publishedTime} />
          {article.modifiedTime && <meta property="article:modified_time" content={article.modifiedTime} />}
          <meta property="article:author" content={article.author} />
          {article.tags.map(tag => (
            <meta key={tag} property="article:tag" content={tag} />
          ))}
        </>
      )}

      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={finalTitle} />
      <meta name="twitter:description" content={finalDescription} />
      <meta name="twitter:image" content={ogImage} />

      {/* Additional SEO Tags */}
      <meta name="author" content="Harsh Mythri" />
      <meta name="theme-color" content="#2563eb" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content="img365.in" />
      <meta name="geo.region" content="IN" />
      <meta name="geo.placename" content="India" />

      {/* Tool-specific Schema (if toolName provided) */}
      {toolSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(toolSchema) }}
        />
      )}

      {/* Article Schema (if article provided) */}
      {articleSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
        />
      )}

      {/* Default Site Schema (if no toolName and no article) */}
      {!toolSchema && !articleSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(siteSchema) }}
        />
      )}

      {/* FAQ Schema */}
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

      {/* HowTo Schema */}
      {howToSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
        />
      )}

      {/* Breadcrumb Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: baseUrl },
              ...(location.pathname.startsWith('/blog/')
                ? [{ '@type': 'ListItem', position: 2, name: 'Blog', item: `${baseUrl}/blog` }]
                : []),
              ...(location.pathname !== '/' && location.pathname !== '/blog'
                ? [{ '@type': 'ListItem', position: location.pathname.startsWith('/blog/') ? 3 : 2, name: toolName || (article ? finalTitle : finalTitle.split(' - ')[0]), item: currentUrl }]
                : []),
            ],
          }),
        }}
      />
    </>
  );
};
