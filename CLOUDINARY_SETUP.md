# Cloudinary Setup Guide

This application uses Cloudinary for storing and serving images and PDF files.

## Setup Instructions

### 1. Create a Cloudinary Account

- Go to https://cloudinary.com
- Sign up for a free account
- Go to your Dashboard to find your credentials

### 2. Set Environment Variables

In your `.env` file in the backend directory, add:

```
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

You can find these values in your Cloudinary Dashboard:

- **Cloud Name**: Under Account Settings
- **API Key**: Under Account Settings
- **API Secret**: Under Account Settings

### 3. Install Dependencies

```bash
cd backend
npm install cloudinary
```

## File Upload Locations

Files are organized in Cloudinary folders:

- **Citizens Documents**: `municipality/documents/`
- **Properties - Cahier de Charge**: `municipality/properties/cahier/`
- **Properties - Rental Contracts**: `municipality/properties/rental/`

## Features

✅ Direct cloud storage - no local disk usage
✅ Files served via Cloudinary CDN - faster delivery
✅ Automatic file optimization
✅ Secure URL links
✅ File size limit: 20MB

## API Endpoints

### Documents

- `GET /api/documents` - List citizen's documents
- `POST /api/documents` - Upload a document
- `GET /api/documents/:id/download` - Redirect to Cloudinary URL

### Properties

- `GET /api/properties/:id/cahier` - Redirect to Cahier de Charge PDF

## File Upload Flow

1. Frontend sends FormData with file to backend
2. Multer stores file in memory (buffer)
3. Backend uploads to Cloudinary
4. Cloudinary returns secure_url
5. Backend stores URL in database
6. Frontend receives Cloudinary URL
7. Users can access files directly from Cloudinary

## Benefits Over Local Storage

- No disk space usage
- Automatic CDN delivery worldwide
- Built-in image optimization
- Secure, authenticated URLs
- Easy file management in Cloudinary Dashboard
- Scalable for large files
