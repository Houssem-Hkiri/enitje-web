# ENIT-JE Web Platform

A website for ENIT Junior Enterprise built with Next.js, Tailwind CSS, and Supabase for storage and authentication.

## Recent Updates (Admin Dashboard)

### Enhanced Admin Dashboard

The admin dashboard has been completely redesigned with a unified layout featuring:
- A single sidebar navigation for all admin sections
- Improved UI/UX with responsive design
- Consolidated components for consistent appearance

### News Management Improvements

The news management section has been updated with the following features:
- Added required description field to prevent null constraint errors
- Replaced image URL field with direct file upload functionality
- Added image preview capability
- Made the Add Article button more prominent
- Enhanced validation for required fields
- **New**: Added category selection dropdown for better content organization
- **New**: Added publication date control for scheduling articles
- **New**: Added support for HTML content formatting in articles

### Projects Management Improvements

The projects management section has been updated with:
- Direct file upload functionality for project images
- Image preview capability before submission
- More visible Add Project button
- Improved form validation

### Gallery Management Improvements

The gallery management section has been enhanced with:
- **New**: Direct file upload functionality for gallery images
- **New**: Image preview before submission
- **New**: Category selection for gallery images
- Improved UI with hover actions for edit and delete

### Language Handling

The platform now includes enhanced language features:
- **New**: Automatic translation of news articles between French and English
- **New**: Translation status indicator during content translation
- Seamless content presentation in the user's selected language
- Preservation of HTML formatting during translation

### Database Schema

The database schema has been updated to include:
- Required `description` field for news articles
- Improved table structure for both news and projects
- Unique slug handling for SEO-friendly URLs
- Proper timestamps and audit tracking
- Row-level security policies for data protection
- **New**: Added `publication_date` for scheduling news articles
- **New**: Required `category` field for improved content organization

## File Upload Process

The platform now uses Supabase Storage for file management:
1. Users select an image file using the file input
2. A preview of the selected image is shown immediately
3. On form submission, the file is uploaded to Supabase Storage
4. The public URL of the uploaded file is stored in the database
5. Images are served from Supabase CDN for optimal performance

## HTML Content Support

News articles now support HTML formatting in the content field:
- Format text with tags like `<b>`, `<i>`, `<p>`, `<h2>`, etc.
- Create structured content with headers, paragraphs, and lists
- Insert links with anchor tags
- The content will be rendered with HTML formatting on the frontend

## Automatic Translation

The platform now includes automatic translation capabilities:
- News articles are automatically translated when the language is switched
- Translation happens in real-time using Google Translate API
- Only article content fields (title, description, excerpt, content) are translated
- Loading indicator displays during the translation process
- HTML formatting is preserved during translation

## Setup and Installation

1. Clone the repository
2. Install dependencies with `npm install`
3. Create a `.env.local` file with the following variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   NEXT_PUBLIC_GOOGLE_TRANSLATE_API_KEY=your_google_translate_api_key
   ```
4. Run the development server with `npm run dev`
5. Open [http://localhost:3000](http://localhost:3000) to view the application

## Database Setup

Run the included `setup_tables.sql` script in your Supabase SQL editor to create the necessary:
- Tables (news, projects, gallery)
- Triggers for timestamps and slug generation
- Row-level security policies
- Storage bucket configuration 