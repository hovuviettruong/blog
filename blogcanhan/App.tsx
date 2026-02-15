
import React, { useState, useEffect, useMemo } from 'react';
import { Post, Page, Category } from './types';
import { INITIAL_POSTS, CATEGORIES } from './constants';
import { 
  Sun, Moon, Search, Plus, Home, BookOpen, User, Mail, 
  ChevronRight, Github, Twitter, Instagram, ArrowLeft, Clock, Calendar, Tag
} from 'lucide-react';

// --- Utility Hooks ---
const useLocalStorage = <T,>(key: string, initialValue: T): [T, (value: T) => void] => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setValue = (value: T) => {
    try {
      setStoredValue(value);
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue];
};

// --- Sub-components ---

const Navbar: React.FC<{
  currentPage: Page;
  setPage: (p: Page) => void;
  darkMode: boolean;
  toggleTheme: () => void;
}> = ({ currentPage, setPage, darkMode, toggleTheme }) => {
  const navItems = [
    { label: 'Trang chủ', icon: Home, value: 'home' as Page },
    { label: 'Blog', icon: BookOpen, value: 'blog' as Page },
    { label: 'Giới thiệu', icon: User, value: 'about' as Page },
    { label: 'Liên hệ', icon: Mail, value: 'contact' as Page },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <div 
          className="flex items-center gap-2 cursor-pointer group"
          onClick={() => setPage('home')}
        >
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-xl group-hover:rotate-12 transition-transform">
            B
          </div>
          <span className="font-serif text-xl font-bold tracking-tight hidden sm:block">ModernBlog</span>
        </div>

        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <button
              key={item.value}
              onClick={() => setPage(item.value)}
              className={`text-sm font-medium transition-colors hover:text-indigo-600 dark:hover:text-indigo-400 ${
                currentPage === item.value ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title={darkMode ? "Chế độ sáng" : "Chế độ tối"}
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button
            onClick={() => setPage('create-post')}
            className="hidden sm:flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-full text-sm font-medium transition-all transform hover:scale-105 active:scale-95 shadow-lg shadow-indigo-500/20"
          >
            <Plus size={18} />
            <span>Viết bài</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

const Footer: React.FC = () => (
  <footer className="bg-slate-100 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 mt-20">
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="col-span-1 md:col-span-2">
          <h2 className="font-serif text-2xl font-bold mb-4">ModernBlog</h2>
          <p className="text-slate-600 dark:text-slate-400 max-w-sm mb-6">
            Một không gian tối giản để chia sẻ suy nghĩ, trải nghiệm và những hiểu biết về kỹ thuật với thế giới. Được xây dựng với đam mê dành cho thiết kế tuyệt vời.
          </p>
          <div className="flex gap-4">
            <a href="#" className="p-2 bg-white dark:bg-slate-800 rounded-lg hover:text-indigo-600 transition-colors shadow-sm">
              <Twitter size={20} />
            </a>
            <a href="#" className="p-2 bg-white dark:bg-slate-800 rounded-lg hover:text-indigo-600 transition-colors shadow-sm">
              <Github size={20} />
            </a>
            <a href="#" className="p-2 bg-white dark:bg-slate-800 rounded-lg hover:text-indigo-600 transition-colors shadow-sm">
              <Instagram size={20} />
            </a>
          </div>
        </div>
        <div>
          <h3 className="font-bold mb-4 uppercase text-xs tracking-widest text-slate-400">Liên kết nhanh</h3>
          <ul className="space-y-2 text-slate-600 dark:text-slate-400">
            <li><a href="#" className="hover:text-indigo-600 transition-colors">Dự án</a></li>
            <li><a href="#" className="hover:text-indigo-600 transition-colors">Tài nguyên</a></li>
            <li><a href="#" className="hover:text-indigo-600 transition-colors">Chính sách bảo mật</a></li>
            <li><a href="#" className="hover:text-indigo-600 transition-colors">Điều khoản dịch vụ</a></li>
          </ul>
        </div>
        <div>
          <h3 className="font-bold mb-4 uppercase text-xs tracking-widest text-slate-400">Bản tin</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">Nhận những bài viết mới nhất trực tiếp qua email của bạn.</p>
          <div className="flex gap-2">
            <input 
              type="email" 
              placeholder="Email của bạn" 
              className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm w-full focus:ring-2 focus:ring-indigo-500 outline-none"
            />
            <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-indigo-700 transition-colors">
              Đăng ký
            </button>
          </div>
        </div>
      </div>
      <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800 text-center text-sm text-slate-500">
        © 2024 ModernBlog Platform. Bảo lưu mọi quyền.
      </div>
    </div>
  </footer>
);

const BlogCard: React.FC<{ post: Post; onClick: (id: string) => void }> = ({ post, onClick }) => (
  <article 
    className="group bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
    onClick={() => onClick(post.id)}
  >
    <div className="relative h-56 overflow-hidden">
      <img 
        src={post.imageUrl} 
        alt={post.title} 
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
      />
      <div className="absolute top-4 left-4">
        <span className="bg-white/90 dark:bg-slate-900/90 backdrop-blur px-3 py-1 rounded-full text-xs font-semibold text-indigo-600 dark:text-indigo-400 shadow-sm uppercase tracking-wider">
          {post.category}
        </span>
      </div>
    </div>
    <div className="p-6">
      <div className="flex items-center gap-3 text-xs text-slate-500 mb-3">
        <span className="flex items-center gap-1"><Calendar size={14} /> {post.date}</span>
        <span className="flex items-center gap-1"><Clock size={14} /> {post.readTime}</span>
      </div>
      <h3 className="text-xl font-bold mb-3 group-hover:text-indigo-600 transition-colors line-clamp-2 leading-tight">
        {post.title}
      </h3>
      <p className="text-slate-600 dark:text-slate-400 text-sm line-clamp-3 mb-4 leading-relaxed">
        {post.excerpt}
      </p>
      <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-xs font-bold uppercase">
            {post.author.charAt(0)}
          </div>
          <span className="text-sm font-medium">{post.author}</span>
        </div>
        <ChevronRight size={18} className="text-indigo-600 group-hover:translate-x-1 transition-transform" />
      </div>
    </div>
  </article>
);

const PostDetail: React.FC<{ post: Post; onBack: () => void }> = ({ post, onBack }) => (
  <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-3xl mx-auto py-12 px-4">
    <button 
      onClick={onBack}
      className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium mb-8 transition-colors group"
    >
      <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
      Quay lại Blog
    </button>
    
    <header className="mb-10 text-center">
      <div className="flex justify-center mb-6">
        <span className="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-widest">
          {post.category}
        </span>
      </div>
      <h1 className="font-serif text-4xl md:text-5xl font-bold mb-6 leading-tight">
        {post.title}
      </h1>
      <div className="flex items-center justify-center gap-6 text-slate-500 dark:text-slate-400 text-sm">
        <span className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold">
            {post.author.charAt(0)}
          </div>
          {post.author}
        </span>
        <span className="flex items-center gap-2"><Calendar size={16} /> {post.date}</span>
        <span className="flex items-center gap-2"><Clock size={16} /> {post.readTime}</span>
      </div>
    </header>

    <div className="rounded-3xl overflow-hidden mb-12 shadow-2xl">
      <img src={post.imageUrl} alt={post.title} className="w-full h-auto" />
    </div>

    <div className="prose prose-slate dark:prose-invert max-w-none">
      <p className="text-xl text-slate-600 dark:text-slate-400 italic mb-8 border-l-4 border-indigo-600 pl-6 leading-relaxed">
        {post.excerpt}
      </p>
      <div className="text-lg leading-loose space-y-6">
        {post.content.split('\n').map((para, idx) => (
          <p key={idx}>{para}</p>
        ))}
      </div>
    </div>

    <div className="mt-16 pt-12 border-t border-slate-200 dark:border-slate-800">
      <div className="flex flex-wrap gap-2 mb-8">
        <span className="flex items-center gap-1 text-sm bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full"><Tag size={14}/> Cảm hứng</span>
        <span className="flex items-center gap-1 text-sm bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full"><Tag size={14}/> Viết lách</span>
        <span className="flex items-center gap-1 text-sm bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full"><Tag size={14}/> Tư duy</span>
      </div>
      <div className="bg-slate-100 dark:bg-slate-900 rounded-3xl p-8 flex items-center gap-6">
        <div className="w-20 h-20 rounded-2xl bg-indigo-600 shrink-0 flex items-center justify-center text-3xl text-white font-bold">
          {post.author.charAt(0)}
        </div>
        <div>
          <h4 className="font-bold text-lg mb-1">{post.author}</h4>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Một người viết lách đầy đam mê và khám phá những chân trời kỹ thuật số mới. Chia sẻ những câu chuyện và góc nhìn để truyền cảm hứng cho thế hệ sáng tạo tiếp theo.
          </p>
        </div>
      </div>
    </div>
  </div>
);

const CreatePost: React.FC<{ onSave: (p: Post) => void; onCancel: () => void }> = ({ onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    category: 'Design' as Category,
    author: 'Tác giả mới',
    imageUrl: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=1000'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newPost: Post = {
      ...formData,
      id: Date.now().toString(),
      date: new Date().toLocaleDateString('vi-VN', { month: 'short', day: '2-digit', year: 'numeric' }),
      readTime: '5 phút đọc'
    };
    onSave(newPost);
  };

  return (
    <div className="max-w-2xl mx-auto py-12 px-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h2 className="font-serif text-3xl font-bold mb-8">Đăng bài viết mới</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-semibold mb-2">Tiêu đề</label>
          <input 
            required
            value={formData.title}
            onChange={e => setFormData({...formData, title: e.target.value})}
            className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            placeholder="Nhập tiêu đề thu hút..."
          />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-2">Chủ đề</label>
          <select 
            value={formData.category}
            onChange={e => setFormData({...formData, category: e.target.value as Category})}
            className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
          >
            {['Technology', 'Lifestyle', 'Travel', 'Food', 'Design'].map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold mb-2">Mô tả ngắn</label>
          <input 
            required
            value={formData.excerpt}
            onChange={e => setFormData({...formData, excerpt: e.target.value})}
            className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            placeholder="Một bản tóm tắt ngắn gọn cho bài viết..."
          />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-2">Nội dung bài viết</label>
          <textarea 
            required
            rows={10}
            value={formData.content}
            onChange={e => setFormData({...formData, content: e.target.value})}
            className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            placeholder="Viết nội dung tuyệt vời của bạn ở đây..."
          />
        </div>
        <div className="flex gap-4 pt-4">
          <button 
            type="submit"
            className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-xl transition-all transform active:scale-95 shadow-lg shadow-indigo-200 dark:shadow-none"
          >
            Đăng bài
          </button>
          <button 
            type="button"
            onClick={onCancel}
            className="px-6 py-3 border border-slate-200 dark:border-slate-800 rounded-xl font-medium hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            Hủy
          </button>
        </div>
      </form>
    </div>
  );
};

// --- Main App Component ---

const App: React.FC = () => {
  const [posts, setPosts] = useLocalStorage<Post[]>('blog_posts', INITIAL_POSTS);
  const [darkMode, setDarkMode] = useLocalStorage<boolean>('dark_mode', false);
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Tất cả');

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const filteredPosts = useMemo(() => {
    return posts.filter(post => {
      const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           post.content.toLowerCase().includes(searchQuery.toLowerCase());
      
      const categoryMap: Record<string, string> = {
        'Technology': 'Công nghệ',
        'Lifestyle': 'Đời sống',
        'Travel': 'Du lịch',
        'Food': 'Ẩm thực',
        'Design': 'Thiết kế'
      };
      
      const matchesCategory = selectedCategory === 'Tất cả' || categoryMap[post.category] === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [posts, searchQuery, selectedCategory]);

  const handlePostClick = (id: string) => {
    setSelectedPostId(id);
    setCurrentPage('post-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCreatePost = (newPost: Post) => {
    setPosts([newPost, ...posts]);
    setCurrentPage('blog');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const selectedPost = useMemo(() => 
    posts.find(p => p.id === selectedPostId), 
    [posts, selectedPostId]
  );

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar 
        currentPage={currentPage} 
        setPage={setCurrentPage} 
        darkMode={darkMode} 
        toggleTheme={() => setDarkMode(!darkMode)} 
      />

      <main className="flex-grow">
        {currentPage === 'home' && (
          <section className="animate-in fade-in duration-700">
            {/* Hero Section */}
            <div className="relative h-[600px] overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=2000&auto=format&fit=crop" 
                alt="Hero" 
                className="w-full h-full object-cover brightness-[0.4]"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
                <h1 className="font-serif text-5xl md:text-7xl font-bold text-white mb-6 drop-shadow-lg max-w-4xl">
                  Những Câu Chuyện <br/>& Ý Tưởng Hiện Đại
                </h1>
                <p className="text-white/80 text-lg md:text-xl max-w-2xl mb-10 font-light leading-relaxed">
                  Gia nhập cộng đồng những người ham học hỏi, khám phá sự giao thoa giữa công nghệ, đời sống và thiết kế hiện đại.
                </p>
                <div className="flex gap-4">
                  <button 
                    onClick={() => setCurrentPage('blog')}
                    className="bg-white text-slate-900 px-8 py-3 rounded-full font-bold hover:bg-slate-100 transition-all transform hover:scale-105 active:scale-95"
                  >
                    Bắt đầu đọc
                  </button>
                  <button 
                    onClick={() => setCurrentPage('about')}
                    className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-8 py-3 rounded-full font-bold hover:bg-white/20 transition-all"
                  >
                    Về chúng tôi
                  </button>
                </div>
              </div>
            </div>

            {/* Featured Post Grid */}
            <div className="max-w-6xl mx-auto px-4 py-20">
              <div className="flex items-center justify-between mb-12">
                <h2 className="font-serif text-3xl font-bold">Bài viết mới nhất</h2>
                <button 
                  onClick={() => setCurrentPage('blog')}
                  className="text-indigo-600 hover:text-indigo-700 font-bold flex items-center gap-1 group"
                >
                  Xem tất cả <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {posts.slice(0, 3).map(post => (
                  <BlogCard key={post.id} post={post} onClick={handlePostClick} />
                ))}
              </div>
            </div>
          </section>
        )}

        {(currentPage === 'blog') && (
          <div className="max-w-6xl mx-auto px-4 py-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <header className="mb-12">
              <h1 className="font-serif text-4xl font-bold mb-4">Kho lưu trữ Blog</h1>
              <p className="text-slate-600 dark:text-slate-400">Khám phá các bài viết, hướng dẫn và thông tin chi tiết từ các cộng tác viên của chúng tôi.</p>
            </header>

            {/* Filter & Search */}
            <div className="flex flex-col md:flex-row gap-6 mb-12">
              <div className="relative flex-grow">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="text" 
                  placeholder="Tìm kiếm bài viết..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all shadow-sm"
                />
              </div>
              <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 rounded-xl whitespace-nowrap text-sm font-medium transition-all ${
                      selectedCategory === cat 
                        ? 'bg-indigo-600 text-white shadow-md' 
                        : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-indigo-400'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Results */}
            {filteredPosts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredPosts.map(post => (
                  <BlogCard key={post.id} post={post} onClick={handlePostClick} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-slate-100 dark:bg-slate-900/50 rounded-3xl border border-dashed border-slate-300 dark:border-slate-800">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-400 mb-4">
                  <Search size={32} />
                </div>
                <h3 className="text-xl font-bold mb-2">Không tìm thấy kết quả phù hợp</h3>
                <p className="text-slate-500">Hãy thử điều chỉnh từ khóa tìm kiếm hoặc bộ lọc chủ đề.</p>
                <button 
                  onClick={() => {setSearchQuery(''); setSelectedCategory('Tất cả');}}
                  className="mt-6 text-indigo-600 font-bold hover:underline"
                >
                  Xóa tất cả bộ lọc
                </button>
              </div>
            )}
          </div>
        )}

        {currentPage === 'post-detail' && selectedPost && (
          <PostDetail post={selectedPost} onBack={() => setCurrentPage('blog')} />
        )}

        {currentPage === 'create-post' && (
          <CreatePost 
            onSave={handleCreatePost} 
            onCancel={() => setCurrentPage('blog')} 
          />
        )}

        {currentPage === 'about' && (
          <div className="max-w-4xl mx-auto px-4 py-20 animate-in fade-in duration-500">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div className="rounded-3xl overflow-hidden shadow-2xl">
                  <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1000" alt="About" className="w-full h-auto" />
                </div>
                <div>
                  <h1 className="font-serif text-4xl font-bold mb-6">Viết lách là <br/>Linh hồn của Sự biểu đạt</h1>
                  <p className="text-lg text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
                    ModernBlog được thành lập dựa trên ý tưởng rằng mọi câu chuyện đều xứng đáng có một sân khấu đẹp. Trong một thế giới đầy ồn ào, chúng tôi cố gắng tạo ra một góc yên tĩnh cho những suy nghĩ sâu sắc và hiểu biết sáng tạo.
                  </p>
                  <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
                    Cho dù bạn là một chuyên gia công nghệ dày dạn kinh nghiệm, một người du hành lang thang, hay đơn giản là một người yêu thích chia sẻ những niềm vui giản dị của cuộc sống, bạn sẽ tìm thấy một mái nhà ở đây.
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                      <div className="text-3xl font-bold text-indigo-600 mb-1">50k+</div>
                      <div className="text-xs font-bold uppercase tracking-widest text-slate-400">Độc giả hàng tháng</div>
                    </div>
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                      <div className="text-3xl font-bold text-indigo-600 mb-1">200+</div>
                      <div className="text-xs font-bold uppercase tracking-widest text-slate-400">Câu chuyện tuyển chọn</div>
                    </div>
                  </div>
                </div>
             </div>
          </div>
        )}

        {currentPage === 'contact' && (
          <div className="max-w-6xl mx-auto px-4 py-20 animate-in fade-in duration-500">
            <div className="bg-white dark:bg-slate-900 rounded-[3rem] overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row">
              <div className="bg-indigo-600 p-12 text-white md:w-1/3">
                <h2 className="text-3xl font-bold mb-8">Liên hệ với chúng tôi</h2>
                <p className="text-indigo-100 mb-12">
                  Bạn có câu hỏi, phản hồi hoặc chỉ muốn gửi lời chào? Nhóm của chúng tôi luôn sẵn sàng lắng nghe.
                </p>
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center"><Mail size={20} /></div>
                    <span>hello@modernblog.com</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center"><Twitter size={20} /></div>
                    <span>@modern_blog</span>
                  </div>
                </div>
              </div>
              <div className="p-12 md:w-2/3">
                <form className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold mb-2">Họ và tên</label>
                      <input type="text" className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">Email</label>
                      <input type="email" className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Tiêu đề</label>
                    <input type="text" className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Tin nhắn</label>
                    <textarea rows={5} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"></textarea>
                  </div>
                  <button type="button" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg">
                    Gửi tin nhắn
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default App;
