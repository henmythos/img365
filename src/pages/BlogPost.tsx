import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { Calendar, Clock, User, ArrowLeft, Share2 } from 'lucide-react';
import { SEO } from '../components/SEO';
import { blogPosts } from '../data/blogData';

export const BlogPost: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const post = blogPosts.find(p => p.slug === slug);

    if (!post) {
        return <Navigate to="/blog" replace />;
    }

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: post.title,
                    text: post.excerpt,
                    url: window.location.href,
                });
            } catch (err) {
                console.log('Error sharing:', err);
            }
        } else {
            // Fallback to clipboard
            navigator.clipboard.writeText(window.location.href);
            alert('Link copied to clipboard!');
        }
    };

    return (
        <>
            <SEO
                title={`${post.title} - img365.in Blog`}
                description={post.excerpt}
                keywords={post.tags.join(', ')}
                article={{
                    publishedTime: post.date,
                    author: post.author,
                    tags: post.tags,
                }}
            />

            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
                <article className="container mx-auto px-4 max-w-4xl">
                    <Link
                        to="/blog"
                        className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 mb-8 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Blog
                    </Link>

                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden p-8 md:p-12">
                        <header className="mb-8 border-b border-gray-200 dark:border-gray-700 pb-8">
                            <div className="flex flex-wrap gap-2 mb-6">
                                {post.tags.map(tag => (
                                    <span
                                        key={tag}
                                        className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-sm font-semibold rounded-full"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>

                            <h1 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
                                {post.title}
                            </h1>

                            <div className="flex flex-wrap items-center justify-between gap-4 text-gray-500 dark:text-gray-400">
                                <div className="flex items-center space-x-6">
                                    <div className="flex items-center">
                                        <User className="w-5 h-5 mr-2" />
                                        <span className="font-medium">{post.author}</span>
                                    </div>
                                    <div className="flex items-center">
                                        <Calendar className="w-5 h-5 mr-2" />
                                        <span>{post.date}</span>
                                    </div>
                                    <div className="flex items-center">
                                        <Clock className="w-5 h-5 mr-2" />
                                        <span>{post.readTime}</span>
                                    </div>
                                </div>

                                <button
                                    onClick={handleShare}
                                    className="inline-flex items-center px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-gray-700 dark:text-gray-200"
                                >
                                    <Share2 className="w-4 h-4 mr-2" /> Share
                                </button>
                            </div>
                        </header>

                        <div
                            className="prose prose-lg dark:prose-invert max-w-none prose-headings:text-gray-900 dark:prose-headings:text-white prose-a:text-blue-600 dark:prose-a:text-blue-400"
                            dangerouslySetInnerHTML={{ __html: post.content }}
                        />
                    </div>
                </article>
            </div>
        </>
    );
};
