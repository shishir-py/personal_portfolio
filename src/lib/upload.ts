/**
 * Interface for the uploaded file response
 */
export interface UploadedFile {
  url: string;
  public_id: string;
}

/**
 * Uploads a file to Cloudinary via our API route
 * @param file The file to upload
 * @returns The URL and public ID of the uploaded file
 */
export async function uploadToCloudinary(file: File): Promise<UploadedFile> {
  try {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to upload file');
    }
    
    const data = await response.json();
    
    return {
      url: data.url,
      public_id: data.public_id
    };
  } catch (error: any) {
    console.error('Error uploading file:', error);
    throw new Error(error.message || 'Failed to upload file');
  }
}