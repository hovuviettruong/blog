
import { Post } from './types';

export const INITIAL_POSTS: Post[] = [
  {
    id: 'welcome-myblog',
    title: 'Chào mừng bạn đến với MyBlog!',
    excerpt: 'Hãy bắt đầu hành trình sáng tạo của bạn ngay hôm nay.',
    content: 'Chào bạn!\n\nĐây là MyBlog - nơi bạn có thể lưu trữ những suy nghĩ và kiến thức của mình một cách tối giản nhất.\n\nLưu ý quan trọng: Ứng dụng này sử dụng LocalStorage để lưu bài viết. Điều này có nghĩa là mọi dữ liệu bạn đăng tải sẽ CHỈ nằm trên trình duyệt của máy tính này. Nếu bạn xóa lịch sử trình duyệt hoặc đổi sang máy khác, các bài viết sẽ không xuất hiện.\n\nHãy thử nhấn nút "Viết bài" để đăng câu chuyện đầu tiên và tải lên một tấm ảnh thật đẹp nhé!',
    category: 'Thiết kế',
    author: 'MyBlog Team',
    date: new Date().toLocaleDateString('vi-VN', { month: 'short', day: '2-digit', year: 'numeric' }),
    imageUrl: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=1000&auto=format&fit=crop',
    readTime: '1 phút đọc'
  }
];

export const CATEGORIES: string[] = ['Tất cả', 'Công nghệ', 'Đời sống', 'Du lịch', 'Ẩm thực', 'Thiết kế'];
