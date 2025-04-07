/**
 * Translation utility for ENIT-JE Web Platform
 * This module provides functions to translate content between French and English
 * using the Google Translate API.
 */

/**
 * Translates text from French to English or English to French
 * 
 * @param text - The text to be translated
 * @param targetLang - The target language ('en' or 'fr')
 * @param sourceLang - The source language (optional, will be auto-detected if not provided)
 * @returns Promise with translated text
 */
export async function translateText(
  text: string, 
  targetLang: 'en' | 'fr', 
  sourceLang?: 'en' | 'fr'
): Promise<string> {
  // If text is empty, return as is
  if (!text || text.trim() === '') {
    return text;
  }
  
  try {
    // Google Translate API endpoint
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_TRANSLATE_API_KEY;
    
    // If no API key is configured, return original text
    if (!apiKey) {
      console.warn('Google Translate API key not configured. Returning original text.');
      return text;
    }
    
    const url = new URL('https://translation.googleapis.com/language/translate/v2');
    url.searchParams.append('key', apiKey);
    url.searchParams.append('q', text);
    url.searchParams.append('target', targetLang);
    
    // Add source language if provided
    if (sourceLang) {
      url.searchParams.append('source', sourceLang);
    }
    
    const response = await fetch(url.toString(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`Translation API error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Extract the translated text from the response
    if (data?.data?.translations?.[0]?.translatedText) {
      return data.data.translations[0].translatedText;
    } else {
      throw new Error('Unexpected translation API response format');
    }
  } catch (error) {
    console.error('Translation error:', error);
    return text; // Return original text on error
  }
}

/**
 * Translates an article's content between languages
 * 
 * @param article - The article object to translate
 * @param targetLang - The target language ('en' or 'fr')
 * @returns Promise with translated article
 */
export async function translateArticle(
  article: any, 
  targetLang: 'en' | 'fr'
): Promise<any> {
  // If article is not provided, return null
  if (!article) return null;
  
  try {
    // Determine source language (opposite of target)
    const sourceLang = targetLang === 'en' ? 'fr' : 'en';
    
    // Only translate these specific fields
    const fieldsToTranslate = ['title', 'description', 'excerpt', 'content'];
    
    // Create a new object with translated fields
    const translatedArticle = { ...article };
    
    // Translate each field
    for (const field of fieldsToTranslate) {
      if (article[field]) {
        translatedArticle[field] = await translateText(
          article[field], 
          targetLang, 
          sourceLang
        );
      }
    }
    
    return translatedArticle;
  } catch (error) {
    console.error('Article translation error:', error);
    return article; // Return original article on error
  }
}

/**
 * Helper function to detect if text is HTML content
 * 
 * @param text - The text to check
 * @returns boolean indicating if text contains HTML tags
 */
export function isHtmlContent(text: string): boolean {
  // Simple regex to detect HTML tags
  const htmlTagRegex = /<\/?[a-z][\s\S]*>/i;
  return htmlTagRegex.test(text);
}

/**
 * Preserves HTML tags during translation
 * This is a more complex implementation that would need to:
 * 1. Parse the HTML to extract text nodes
 * 2. Translate only the text nodes
 * 3. Reconstruct the HTML with translated text
 * 
 * For now, it's a placeholder for potential future implementation
 */
export async function translateHtmlContent(
  htmlContent: string,
  targetLang: 'en' | 'fr',
  sourceLang?: 'en' | 'fr'
): Promise<string> {
  // For simplicity, we'll just translate the whole HTML content
  // A more robust implementation would preserve HTML structure
  
  // Warning: This simple approach might break HTML structure in complex cases
  // A proper implementation would use an HTML parser
  
  return translateText(htmlContent, targetLang, sourceLang);
} 