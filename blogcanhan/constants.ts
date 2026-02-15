
import { Post } from './types';

export const INITIAL_POSTS: Post[] = [
  {
    id: '1',
    title: 'Chào mừng bạn đến với ModernBlog',
    excerpt: 'Đây là bài viết đầu tiên của bạn. Hãy bắt đầu chia sẻ những ý tưởng tuyệt vời của mình với mọi người ngay hôm nay!',
    content: 'Chào mừng bạn đến với nền tảng blog cá nhân hiện đại. Tại đây, bạn có thể tự do sáng tạo, viết lách và chia sẻ kiến thức của mình về Công nghệ, Đời sống, Du lịch và nhiều chủ đề khác.\n\nHệ thống hỗ trợ Markdown cơ bản, chế độ sáng/tối và giao diện tối ưu cho mọi thiết bị.',
    category: 'Design',
    author: 'Quản trị viên',
    date: new Date().toLocaleDateString('vi-VN', { month: 'short', day: '2-digit', year: 'numeric' }),
    imageUrl: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=1000&auto=format&fit=crop',
    readTime: '1 phút đọc'
  }
];

export const CATEGORIES: string[] = ['Tất cả', 'Công nghệ', 'Đời sống', 'Du lịch', 'Ẩm thực', 'Thiết kế'];

export const CATEGORY_MAP: Record<string, string> = {
  'Technology': 'Công nghệ',
  'Lifestyle': 'Đời sống',
  'Travel': 'Du lịch',
  'Food': 'Ẩm thực',
  'Design': 'Thiết kế',
  'All': 'Tất cả'
};
