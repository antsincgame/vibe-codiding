const API_URL = import.meta.env.VITE_API_URL || 'https://vibecoding.by/functions/v1';

export type ImageType = 'courses' | 'blog' | 'student-works' | 'general';

export async function uploadImage(file: File, type: ImageType = 'general'): Promise<string> {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    const response = await fetch(`${API_URL}/upload-image`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      let errorMessage = 'Failed to upload image';
      try {
        const error = await response.json();
        errorMessage = error.details || error.error || errorMessage;
      } catch {
        errorMessage = await response.text() || errorMessage;
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    if (!data.url) throw new Error('No URL returned from upload');
    return data.url;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error instanceof Error ? error : new Error('Unknown upload error');
  }
}

export async function uploadStudentWorkImage(file: File): Promise<string> {
  return uploadImage(file, 'student-works');
}

export async function uploadCourseImage(file: File): Promise<string> {
  return uploadImage(file, 'courses');
}

export async function uploadBlogImage(file: File): Promise<string> {
  return uploadImage(file, 'blog');
}

export async function deleteStudentWorkImage(imageUrl: string): Promise<void> {
  // Handled server-side now
  console.log('Delete image:', imageUrl);
}
