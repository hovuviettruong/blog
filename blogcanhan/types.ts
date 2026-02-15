
export type Category = 'Technology' | 'Lifestyle' | 'Travel' | 'Food' | 'Design';

export interface Post {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  category: Category;
  author: string;
  date: string;
  imageUrl: string;
  readTime: string;
}

export type Page = 'home' | 'blog' | 'about' | 'contact' | 'post-detail' | 'create-post';

export interface AppState {
  posts: Post[];
  darkMode: boolean;
  currentPage: Page;
  selectedPostId: string | null;
  searchQuery: string;
  selectedCategory: Category | 'All';
}
