import Head from 'next/head';
import { htmlToText } from 'html-to-text';

function cleanUsingHtmlToText(html = "") {
  return htmlToText(html, {
    wordwrap: false,
    selectors: [{ selector: 'br', format: 'lineBreak' }],
  }).trim();
}

export default function SeoHead({
  title,
  description,
  url,
  image = "https://amarprosno.com/og-image.jpg",
  keywords,
  type = "website",
  structuredData
}) {
  if (!title || !description || !url) return null;

  // 🧼 Clean inputs before rendering
  const safeTitle = cleanUsingHtmlToText(title);
  const safeDescription = cleanUsingHtmlToText(description);
  const safeKeywords = cleanUsingHtmlToText(keywords || "");

  return (
    <Head>
      <title>{safeTitle}</title>
      <meta property="og:locale" content="bn_BD" />
<meta property="og:site_name" content="Amar Prosno" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="description" content={safeDescription} />
      <meta name="keywords" content={safeKeywords} />
      <meta name="robots" content="index, follow" />
      <meta name="author" content="Amar Prosno Team" />
      <link rel="canonical" href={url} />

      {/* OG Tags */}
      <meta property="og:title" content={safeTitle} />
      <meta property="og:description" content={safeDescription} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />

      {/* Twitter Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={safeTitle} />
      <meta name="twitter:description" content={safeDescription} />
      <meta name="twitter:image" content={image} />

      {/* Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Head>
  );
}
