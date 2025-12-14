export interface Course {
  id: string;
  title: string;
  description: string;
  duration: string;
  age_group: string;
  price: string;
  image_url: string;
  features: string[];
  is_active: boolean;
  order_index: number;
  slug?: string;
  created_at: string;
  updated_at: string;
}

export interface TrialRegistration {
  id?: string;
  age_group: 'child' | 'adult';
  parent_name: string;
  child_name: string | null;
  child_age: number | null;
  phone: string;
  email: string;
  course_id?: string;
  message?: string;
  status?: string;
  created_at?: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  order_index: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface SiteSetting {
  id: string;
  key: string;
  value: string;
  description: string;
  updated_at: string;
}

export interface EmailSettings {
  id?: string;
  smtp_host: string;
  smtp_port: number;
  smtp_user: string;
  smtp_password: string;
  from_email: string;
  from_name: string;
  notification_email: string;
  auto_reply_enabled: boolean;
  auto_reply_subject: string;
  auto_reply_body: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface StudentWork {
  id: string;
  student_name: string;
  student_age: number;
  project_title: string;
  project_description: string;
  project_url: string;
  image_url: string;
  tool_type: 'bolt' | 'cursor';
  is_active: boolean;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image_url: string;
  meta_title: string;
  meta_description: string;
  meta_keywords: string;
  is_published: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface HomePageSettings {
  title: string;
  subtitle: string;
  description: string;
  meta_title: string;
  meta_description: string;
  meta_keywords: string;
}
