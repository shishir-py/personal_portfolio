import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';

// Local file upload function
async function saveFileLocally(file: File): Promise<{ secure_url: string; public_id: string }> {
  const fs = require('fs').promises;
  
  // Generate a unique filename
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  
  const timestamp = Date.now();
  const randomId = Math.random().toString(36).substring(2, 15);
  const fileExtension = file.name.split('.').pop();
  const filename = `${timestamp}-${randomId}.${fileExtension}`;
  
  // Save to public/uploads directory
  const uploadDir = path.join(process.cwd(), 'public/uploads');
  const filepath = path.join(uploadDir, filename);
  
  try {
    // Ensure uploads directory exists
    await fs.mkdir(uploadDir, { recursive: true });
    
    // Write the file
    await writeFile(filepath, buffer);
    
    console.log(`File uploaded successfully: ${filename}`);
    
    return {
      secure_url: `/uploads/${filename}`,
      public_id: filename
    };
  } catch (error) {
    console.error('Error saving file:', error);
    throw new Error(`Failed to save file: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function POST(request: Request) {
  try {
    console.log('Upload API called');
    
    // Get form data with file
    const formData = await request.formData();
    console.log('FormData keys:', Array.from(formData.keys()));
    
    // Try different possible field names
    let file = formData.get('file') as File;
    if (!file) file = formData.get('image') as File;
    if (!file) file = formData.get('resume') as File;
    
    console.log('File found:', file ? `${file.name} (${file.type}, ${file.size} bytes)` : 'No file');
    
    if (!file) {
      return NextResponse.json(
        { success: false, message: 'No file provided' },
        { status: 400 }
      );
    }
    
    // Check file type based on the field name or file type
    const fileType = file.type;
    const isImage = fileType.startsWith('image/');
    const isPDF = fileType === 'application/pdf';
    
    if (!isImage && !isPDF) {
      return NextResponse.json(
        { success: false, message: 'File must be an image (JPG, PNG, GIF) or PDF' },
        { status: 400 }
      );
    }
    
    // Save file locally
    const result = await saveFileLocally(file);
    
    return NextResponse.json({
      success: true,
      url: result.secure_url,
      public_id: result.public_id
    });
  } catch (error: any) {
    console.error('Error uploading file:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to upload file' },
      { status: 500 }
    );
  }
}