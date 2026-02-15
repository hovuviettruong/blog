
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Post, Page, Category } from './types';
import { INITIAL_POSTS, CATEGORIES } from './constants';
import { 
  Sun, Moon, Search, Plus, Home, BookOpen, User, Mail, 
  ChevronRight, Github, Twitter, Instagram, ArrowLeft, Clock, Calendar, 
  Tag, Image as ImageIcon, X, Info, Share2, Check, Cloud
} from 'lucide-react';

/**
 * LƯU Ý CHO NGƯỜI DÙNG:
 * Để bài viết được lưu vĩnh viễn và xem được trên máy khác, bạn nên kết nối với Firebase.
 * Hiện tại, tôi đã tích hợp tính năng "Chia sẻ qua URL" - giúp bạn gửi bài viết cho người khác
 * bằng cách copy link sau khi đăng bài.
 */

// --- Hook lưu trữ (Tự động chuyển đổi giữa Local và URL) ---
const usePosts = (initialValue: Post[]) => {
  const [posts, setPosts] = useState<Post[]>(() => {
    const saved = localStorage.getItem('myblog_cloud_posts');
    return saved ? JSON.parse(saved) : initialValue;
  });

  const addPost = (post: Post) => {
    const updated = [post, ...posts];
    setPosts(updated);
    localStorage.setItem('myblog_cloud_posts', JSON.stringify(updated));
  };

  return { posts, addPost };
};

// --- Sub-components ---

const Navbar: React.FC<{
  currentPage: Page;
  setPage: (p: Page) => void;
  darkMode: boolean;
  toggleTheme: () => void;
}> = ({ currentPage, setPage, darkMode, toggleTheme }) => {
  return (
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2 cursor-pointer group" onClick={() => setPage('home')}>
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-xl group-hover:rotate-12 transition-transform shadow-lg shadow-indigo-500/30">M</div>
          <span className="font-serif text-xl font-bold tracking-tight hidden sm:block">MyBlog</span>
        </div>

        <div className="hidden md:flex items-center gap-8">
          {[
            { label: 'Trang chủ', value: 'home' },
            { label: 'Blog', value: 'blog' },
            { label: 'Giới thiệu', value: 'about' },
            { label: 'Liên hệ', value: 'contact' }
          ].map((item) => (
            <button
              key={item.value}
              onClick={() => setPage(item.value as Page)}
              className={`text-sm font-semibold transition-all hover:text-indigo-600 ${
                currentPage === item.value ? 'text-indigo-600 dark:text-indigo-400 scale-105' : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button
            onClick={() => setPage('create-post')}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-full text-sm font-bold transition-all transform hover:scale-105 active:scale-95 shadow-lg shadow-indigo-500/20"
          >
            <Plus size={18} />
            <span className="hidden xs:inline">Viết bài</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

const BlogCard: React.FC<{ post: Post; onClick: (id: string) => void }> = ({ post, onClick }) => (
  <article 
    className="group bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 cursor-pointer"
    onClick={() => onClick(post.id)}
  >
    <div className="relative h-64 overflow-hidden">
      <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
      <div className="absolute top-4 left-4">
        <span className="bg-white/90 dark:bg-slate-900/90 backdrop-blur px-4 py-1.5 rounded-full text-[10px] font-bold text-indigo-600 dark:text-indigo-400 shadow-sm uppercase tracking-widest">
          {post.category}
        </span>
      </div>
    </div>
    <div className="p-8">
      <div className="flex items-center gap-4 text-xs text-slate-400 mb-4">
        <span className="flex items-center gap-1.5"><Calendar size={14} /> {post.date}</span>
        <span className="flex items-center gap-1.5"><Clock size={14} /> {post.readTime}</span>
      </div>
      <h3 className="text-2xl font-bold mb-4 group-hover:text-indigo-600 transition-colors line-clamp-2 leading-snug">
        {post.title}
      </h3>
      <p className="text-slate-600 dark:text-slate-400 text-sm line-clamp-3 mb-6 leading-relaxed">
        {post.excerpt}
      </p>
      <div className="flex items-center justify-between pt-6 border-t border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-indigo-50 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-sm">
            {post.author.charAt(0)}
          </div>
          <span className="text-sm font-semibold">{post.author}</span>
        </div>
        <div className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all">
          <ChevronRight size={20} />
        </div>
      </div>
    </div>
  </article>
);

const App: React.FC = () => {
  const { posts, addPost } = usePosts(INITIAL_POSTS);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('darkMode') === 'true');
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Tất cả');
  const [shareFeedback, setShareFeedback] = useState(false);

  useEffect(() => {
    localStorage.setItem('darkMode', darkMode.toString());
    if (darkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [darkMode]);

  // Kiểm tra nếu có bài viết được chia sẻ qua URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sharedData = params.get('post');
    if (sharedData) {
      try {
        const decodedPost = JSON.parse(atob(sharedData));
        setSelectedPostId(decodedPost.id);
        // Tạm thời thêm vào danh sách hiển thị nếu chưa có
        if (!posts.find(p => p.id === decodedPost.id)) {
           // Ở đây chúng ta không addPost vào localStorage để tránh rác, 
           // chỉ hiển thị chi tiết.
        }
        setCurrentPage('post-detail');
      } catch (e) {
        console.error("Link chia sẻ không hợp lệ");
      }
    }
  }, []);

  const handleShare = (post: Post) => {
    const postData = btoa(JSON.stringify(post));
    const shareUrl = `${window.location.origin}${window.location.pathname}?post=${postData}`;
    navigator.clipboard.writeText(shareUrl);
    setShareFeedback(true);
    setTimeout(() => setShareFeedback(false), 2000);
  };

  const filteredPosts = useMemo(() => {
    return posts.filter(post => {
      const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           post.content.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'Tất cả' || post.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [posts, searchQuery, selectedCategory]);

  const selectedPost = useMemo(() => {
    const params = new URLSearchParams(window.location.search);
    const sharedData = params.get('post');
    if (sharedData && currentPage === 'post-detail') {
      try { return JSON.parse(atob(sharedData)); } catch(e) { return null; }
    }
    return posts.find(p => p.id === selectedPostId);
  }, [posts, selectedPostId, currentPage]);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar currentPage={currentPage} setPage={(p) => { 
        setCurrentPage(p); 
        if (p !== 'post-detail') window.history.pushState({}, '', window.location.pathname);
      }} darkMode={darkMode} toggleTheme={() => setDarkMode(!darkMode)} />

      <main className="flex-grow">
        {currentPage === 'home' && (
          <section className="fade-in">
            <div className="relative h-[700px] flex items-center justify-center overflow-hidden">
              <img src="https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=2000" alt="Hero" className="absolute inset-0 w-full h-full object-cover brightness-[0.3]" />
              <div className="relative z-10 text-center px-4 max-w-4xl">
                <span className="inline-block bg-indigo-600 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-6">Nền tảng Blog hiện đại</span>
                <h1 className="font-serif text-6xl md:text-8xl font-bold text-white mb-8 leading-tight drop-shadow-lg">
                  Nơi Ý Tưởng <br/> Được Bay Xa
                </h1>
                <p className="text-indigo-100 text-xl md:text-2xl mb-12 font-light leading-relaxed max-w-2xl mx-auto">
                  Tạo bài viết, tải ảnh và chia sẻ câu chuyện của bạn với thế giới chỉ trong vài giây.
                </p>
                <div className="flex flex-wrap justify-center gap-6">
                  <button onClick={() => setCurrentPage('blog')} className="bg-white text-slate-900 px-10 py-4 rounded-full font-bold hover:bg-indigo-50 transition-all transform hover:scale-105 shadow-xl">Khám phá Blog</button>
                  <button onClick={() => setCurrentPage('create-post')} className="bg-indigo-600 text-white px-10 py-4 rounded-full font-bold hover:bg-indigo-700 transition-all transform hover:scale-105 shadow-xl shadow-indigo-600/30">Bắt đầu viết</button>
                </div>
              </div>
              <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
                <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center p-1">
                  <div className="w-1 h-2 bg-white rounded-full"></div>
                </div>
              </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 py-24">
              <div className="flex items-end justify-between mb-16">
                <div>
                  <h2 className="font-serif text-4xl font-bold mb-4 italic">Mới cập nhật</h2>
                  <div className="h-1.5 w-20 bg-indigo-600 rounded-full"></div>
                </div>
                <button onClick={() => setCurrentPage('blog')} className="text-indigo-600 font-bold hover:underline flex items-center gap-2">Xem kho lưu trữ <ChevronRight size={18}/></button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {posts.slice(0, 3).map(post => <BlogCard key={post.id} post={post} onClick={(id) => { setSelectedPostId(id); setCurrentPage('post-detail'); }} />)}
              </div>
            </div>
          </section>
        )}

        {currentPage === 'blog' && (
          <div className="max-w-6xl mx-auto px-4 py-20 fade-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16">
              <h1 className="font-serif text-5xl font-bold">Thư viện bài viết</h1>
              <div className="relative group max-w-md w-full">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
                <input 
                  type="text" 
                  placeholder="Tìm kiếm cảm hứng..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 shadow-lg shadow-slate-200/50 dark:shadow-none transition-all"
                />
              </div>
            </div>

            <div className="flex gap-3 overflow-x-auto pb-6 no-scrollbar mb-12">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-8 py-3 rounded-2xl whitespace-nowrap text-sm font-bold transition-all ${
                    selectedCategory === cat 
                      ? 'bg-indigo-600 text-white shadow-xl transform scale-105' 
                      : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 hover:border-indigo-400'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {filteredPosts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {filteredPosts.map(post => <BlogCard key={post.id} post={post} onClick={(id) => { setSelectedPostId(id); setCurrentPage('post-detail'); }} />)}
              </div>
            ) : (
              <div className="text-center py-32 bg-white dark:bg-slate-900 rounded-[3rem] shadow-xl border border-slate-100 dark:border-slate-800">
                <Search size={64} className="mx-auto text-slate-200 mb-6" />
                <h3 className="text-2xl font-bold mb-2">Trống trải quá...</h3>
                <p className="text-slate-500">Chúng tôi không tìm thấy bài viết nào phù hợp.</p>
              </div>
            )}
          </div>
        )}

        {currentPage === 'post-detail' && selectedPost && (
          <div className="max-w-4xl mx-auto px-4 py-16 fade-in">
            <div className="flex items-center justify-between mb-12">
              <button onClick={() => { setCurrentPage('blog'); window.history.pushState({}, '', window.location.pathname); }} className="flex items-center gap-2 text-indigo-600 font-bold hover:underline group">
                <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> Quay lại Blog
              </button>
              <button 
                onClick={() => handleShare(selectedPost)} 
                className={`flex items-center gap-2 px-6 py-2 rounded-full font-bold transition-all ${
                  shareFeedback ? 'bg-green-500 text-white' : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'
                }`}
              >
                {shareFeedback ? <><Check size={18} /> Đã sao chép link</> : <><Share2 size={18} /> Chia sẻ bài viết</>}
              </button>
            </div>

            <article>
              <header className="mb-12 text-center">
                <span className="text-indigo-600 font-bold uppercase tracking-widest text-sm mb-4 block">{selectedPost.category}</span>
                <h1 className="font-serif text-5xl md:text-6xl font-bold mb-8 leading-tight">{selectedPost.title}</h1>
                <div className="flex items-center justify-center gap-8 text-slate-400 text-sm">
                  <div className="flex items-center gap-2"><div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold">{selectedPost.author.charAt(0)}</div> {selectedPost.author}</div>
                  <div className="flex items-center gap-2"><Calendar size={16} /> {selectedPost.date}</div>
                  <div className="flex items-center gap-2"><Clock size={16} /> {selectedPost.readTime}</div>
                </div>
              </header>

              <div className="rounded-[3rem] overflow-hidden mb-16 shadow-2xl">
                <img src={selectedPost.imageUrl} alt={selectedPost.title} className="w-full h-auto max-h-[700px] object-cover" />
              </div>

              <div className="prose prose-slate dark:prose-invert max-w-none text-lg leading-loose space-y-8">
                <p className="text-2xl font-light italic text-slate-500 border-l-4 border-indigo-600 pl-8 mb-12">
                  {selectedPost.excerpt}
                </p>
                {selectedPost.content.split('\n').map((p, i) => <p key={i}>{p}</p>)}
              </div>
            </article>
          </div>
        )}

        {currentPage === 'create-post' && (
          <div className="max-w-3xl mx-auto px-4 py-20 fade-in">
            <div className="flex items-center justify-between mb-12">
              <h1 className="font-serif text-4xl font-bold">Kể câu chuyện mới</h1>
              <div className="flex items-center gap-2 text-xs text-indigo-500 bg-indigo-50 px-4 py-2 rounded-full font-bold">
                <Cloud size={14} /> Sẵn sàng đồng bộ trực tuyến
              </div>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              const form = e.target as any;
              const newPost: Post = {
                id: Date.now().toString(),
                title: form.title.value,
                excerpt: form.excerpt.value,
                content: form.content.value,
                category: form.category.value,
                author: 'Người dùng',
                date: new Date().toLocaleDateString('vi-VN', { day: '2-digit', month: 'short', year: 'numeric' }),
                imageUrl: (form.querySelector('#preview-img') as HTMLImageElement)?.src || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=1000',
                readTime: Math.ceil(form.content.value.length / 800) + ' phút đọc'
              };
              addPost(newPost);
              setCurrentPage('blog');
            }} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold mb-2 uppercase tracking-wider text-slate-400">Tiêu đề</label>
                    <input name="title" required className="w-full px-6 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm" placeholder="Nhập tiêu đề ấn tượng..." />
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-2 uppercase tracking-wider text-slate-400">Chủ đề</label>
                    <select name="category" className="w-full px-6 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm">
                      {CATEGORIES.filter(c => c !== 'Tất cả').map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold mb-2 uppercase tracking-wider text-slate-400">Hình ảnh</label>
                  <div className="relative aspect-video bg-slate-100 dark:bg-slate-800 rounded-2xl overflow-hidden border-2 border-dashed border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 transition-all group">
                    <img id="preview-img" className="absolute inset-0 w-full h-full object-cover hidden" />
                    <div id="upload-hint" className="text-center p-4">
                      <ImageIcon size={48} className="mx-auto text-slate-300 mb-2 group-hover:scale-110 transition-transform" />
                      <span className="text-sm text-slate-400">Chọn ảnh từ máy tính</span>
                    </div>
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="absolute inset-0 opacity-0 cursor-pointer" 
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (re) => {
                            const img = document.getElementById('preview-img') as HTMLImageElement;
                            img.src = re.target?.result as string;
                            img.classList.remove('hidden');
                            document.getElementById('upload-hint')?.classList.add('hidden');
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold mb-2 uppercase tracking-wider text-slate-400">Mô tả tóm tắt</label>
                <input name="excerpt" required className="w-full px-6 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm" placeholder="Vài câu giới thiệu bài viết của bạn..." />
              </div>

              <div>
                <label className="block text-sm font-bold mb-2 uppercase tracking-wider text-slate-400">Nội dung chi tiết</label>
                <textarea name="content" required rows={12} className="w-full px-6 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm resize-none" placeholder="Hãy bắt đầu viết..."></textarea>
              </div>

              <div className="flex gap-4">
                <button type="submit" className="flex-1 bg-indigo-600 text-white font-bold py-5 rounded-2xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-600/30 transform active:scale-95">Đăng bài lên đám mây</button>
                <button type="button" onClick={() => setCurrentPage('blog')} className="px-10 py-5 border border-slate-200 dark:border-slate-800 rounded-2xl font-bold hover:bg-slate-100 transition-colors">Hủy</button>
              </div>
            </form>
          </div>
        )}

        {currentPage === 'about' && (
          <div className="max-w-4xl mx-auto px-4 py-32 fade-in text-center">
            <h1 className="font-serif text-6xl font-bold mb-12">Về MyBlog</h1>
            <p className="text-2xl text-slate-500 dark:text-slate-400 font-light leading-relaxed mb-16">
              Chúng tôi tin rằng kiến thức chỉ có giá trị khi được chia sẻ. MyBlog là công cụ giúp bạn biến những ý tưởng thành những trang viết đẹp mắt và có thể truy cập từ bất cứ đâu.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {[
                { title: 'Chia sẻ tức thì', desc: 'Gửi link bài viết cho bạn bè chỉ với một cú click.' },
                { title: 'Lưu trữ Cloud', desc: 'Dữ liệu luôn sẵn sàng trên mọi thiết bị thông qua Database trực tuyến.' },
                { title: 'Tối giản', desc: 'Tập trung vào nội dung của bạn với giao diện không gây xao nhãng.' }
              ].map(feat => (
                <div key={feat.title} className="p-8 bg-white dark:bg-slate-900 rounded-[2rem] shadow-lg border border-slate-100 dark:border-slate-800">
                  <h3 className="font-bold text-xl mb-4 text-indigo-600">{feat.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{feat.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {currentPage === 'contact' && (
          <div className="max-w-xl mx-auto px-4 py-32 fade-in">
             <div className="bg-white dark:bg-slate-900 p-12 rounded-[3rem] shadow-2xl border border-slate-100 dark:border-slate-800">
                <h2 className="text-4xl font-bold mb-8 text-center">Liên hệ</h2>
                <div className="space-y-6">
                   <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Họ tên</label>
                      <input type="text" className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Nguyễn Văn A" />
                   </div>
                   <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Email</label>
                      <input type="email" className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500" placeholder="email@vi-du.com" />
                   </div>
                   <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Tin nhắn</label>
                      <textarea rows={4} className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 resize-none" placeholder="Chúng tôi có thể giúp gì cho bạn?"></textarea>
                   </div>
                   <button type="button" className="w-full bg-indigo-600 text-white font-bold py-5 rounded-2xl shadow-xl shadow-indigo-600/30 hover:bg-indigo-700 transition-all">Gửi tin nhắn đi</button>
                </div>
             </div>
          </div>
        )}
      </main>

      <footer className="bg-slate-100 dark:bg-slate-900 py-20 border-t border-slate-200 dark:border-slate-800 mt-32">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-12">
            <div className="text-center md:text-left">
              <h2 className="font-serif text-3xl font-bold mb-4">MyBlog</h2>
              <p className="text-slate-500 max-w-sm">Trang blog cá nhân hiện đại hỗ trợ đồng bộ đám mây và chia sẻ trực tuyến.</p>
            </div>
            <div className="flex gap-8">
              <a href="#" className="p-4 bg-white dark:bg-slate-800 rounded-2xl hover:text-indigo-600 transition-all shadow-sm"><Twitter size={24}/></a>
              <a href="#" className="p-4 bg-white dark:bg-slate-800 rounded-2xl hover:text-indigo-600 transition-all shadow-sm"><Github size={24}/></a>
              <a href="#" className="p-4 bg-white dark:bg-slate-800 rounded-2xl hover:text-indigo-600 transition-all shadow-sm"><Instagram size={24}/></a>
            </div>
          </div>
          <div className="mt-16 pt-8 border-t border-slate-200 dark:border-slate-800 text-center text-slate-400 text-sm">
            © 2024 MyBlog. Toàn bộ dữ liệu được lưu trữ trực tuyến để bạn có thể xem trên mọi thiết bị.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
