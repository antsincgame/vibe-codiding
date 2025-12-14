const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://zxywgueplrosvdwgpmvb.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp4eXdndWVwbHJvc3Zkd2dwbXZiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMxMzE4NDcsImV4cCI6MjA3ODcwNzg0N30.xyJkFplsbLrBIWEHNksO681xR9htWpV0N45keuc-Uro';

export async function uploadStudentWorkImage(file: File): Promise<string> {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(
      `${supabaseUrl}/functions/v1/upload-student-work-image`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${supabaseAnonKey}`,
        },
        body: formData,
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to upload image');
    }

    const data = await response.json();
    return data.url;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
}

export async function deleteStudentWorkImage(imageUrl: string): Promise<void> {
  try {
    const fileName = imageUrl.split('/').pop();
    if (!fileName) return;

    const filePath = `student-works/${fileName}`;

    const response = await fetch(
      `${supabaseUrl}/storage/v1/object/student-works-images/${filePath}`,
      {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${supabaseAnonKey}`,
        },
      }
    );

    if (!response.ok) {
      console.error('Failed to delete file');
    }
  } catch (error) {
    console.error('Error deleting file:', error);
  }
}
