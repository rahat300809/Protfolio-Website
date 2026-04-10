import React from 'react';
import { motion } from 'motion/react';
import { usePortfolio } from '../context/PortfolioContext';
import { Calendar, ArrowRight, BookOpen, PlayCircle } from 'lucide-react';
import { ShuffleDeck } from '../components/ui/shuffle-deck';

export default function Blog() {
  const { blogPosts, settings } = usePortfolio();

  const getEmbedUrl = (url?: string) => {
    if (!url) return null;
    let videoId = url;
    const match = url.match(/\/d\/(.+?)\//);
    if (match && match[1]) {
      videoId = match[1];
    } else if (url.includes('id=')) {
      const urlParams = new URL(url).searchParams;
      videoId = urlParams.get('id') || videoId;
    }
    return `https://drive.google.com/file/d/${videoId}/preview`;
  };

  const videoUrl = getEmbedUrl(settings?.blogVideoUrl);
  const blogDeckItems = blogPosts.slice(0, 5).map(post => ({
    id: post.id,
    title: post.title,
    subtitle: post.publishedAt,
    description: post.summary,
    image: post.image
  }));

  return (
    <div className="pt-32 pb-20 container mx-auto px-6">
      <div className="mb-16 text-center">
        <h1 className="text-5xl font-display font-bold mb-6">Latest <span className="text-gradient">Articles</span></h1>
        <p className="text-slate-400 max-w-2xl mx-auto">
          Thoughts, tutorials, and insights on IoT, embedded systems, and the future of technology.
        </p>
      </div>

      {videoUrl && (
        <div className="max-w-4xl mx-auto mb-20 relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 rounded-[2rem] to-cyan-500 blur-sm opacity-20"></div>
          <div className="relative glass-card rounded-[2rem] overflow-hidden aspect-video border border-white/10 shadow-2xl flex items-center justify-center group bg-slate-900">
            <iframe
              src={videoUrl}
              className="w-full h-full border-0 absolute z-10"
              allow="autoplay"
              allowFullScreen
            ></iframe>
            <div className="absolute inset-0 flex flex-col items-center justify-center opacity-50 z-0 text-slate-400 gap-4">
               <PlayCircle size={48} className="animate-pulse" />
               <p className="font-bold">Loading Video securely...</p>
            </div>
          </div>
        </div>
      )}

      {/* Featured Blog Deck */}
      {blogPosts.length > 0 && (
        <div className="mb-20">
            <ShuffleDeck items={blogDeckItems} />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {blogPosts.map((post) => (
          <motion.div
            key={post.id}
            whileHover={{ y: -5 }}
            className="glass-card group overflow-hidden flex flex-col md:flex-row"
          >
            <div className="w-full md:w-2/5 aspect-video md:aspect-square overflow-hidden bg-slate-800">
              {post.image ? (
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 opacity-20">
                  <BookOpen size={48} />
                </div>
              )}
            </div>
            <div className="p-8 flex-1 flex flex-col">
              <div className="flex items-center gap-3 text-emerald-400 mb-4">
                <Calendar size={16} />
                <span className="text-sm font-medium">{post.publishedAt}</span>
                {post.readTime && (
                  <>
                    <span className="text-slate-500 px-2">•</span>
                    <span className="text-sm text-slate-400">{post.readTime}</span>
                  </>
                )}
              </div>
              <h3 className="text-2xl font-display font-bold mb-4 group-hover:text-emerald-400 transition-colors">{post.title}</h3>
              <p className="text-slate-400 mb-6 flex-1 line-clamp-3">{post.summary}</p>

              {post.link ? (
                <a href={post.link} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-emerald-400 font-bold hover:gap-4 transition-all w-fit">
                  Read Article <ArrowRight size={20} />
                </a>
              ) : (
                <button onClick={() => alert('Full article viewing is coming soon!')} className="flex items-center gap-2 text-emerald-400 font-bold hover:gap-4 transition-all w-fit">
                  Read More <ArrowRight size={20} />
                </button>
              )}
            </div>
          </motion.div>
        ))}
        {blogPosts.length === 0 && (
          <div className="col-span-full text-center py-20 text-slate-500">
            <BookOpen size={48} className="mx-auto mb-4 opacity-20" />
            <p>No articles published yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
