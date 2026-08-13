import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, User, ArrowRight } from 'lucide-react';
import { SEO } from '../components/SEO';
import { blogPosts } from '../data/blogData';

export const BlogList: React.FC = () => {
    return (
        <>
            <SEO
                title="img365.in Blog - Privacy, Security & Image Tools Guide"
                description="Read the latest articles about document safety, client-side processing, and how to use img365.in for your daily image and PDF tasks."
                keywords="img365 blog, image tools guide, privacy blog, client-side processing, secure document handling, aadhaar safety tips"
            />

            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                            img365.in Blog
                        </h1>
                        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                            Insights on privacy, security, and getting the most out of our free tools.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                        {blogPosts.map((post) => (
                            <article
                                key={post.id}
                                className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col"
                            >
                                <div className="p-6 flex-grow">
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {post.tags.map(tag => (
                                            <span
                                                key={tag}
                                                className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-semibold rounded-full"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>

                                    <Link to={`/blog/${post.slug}`}>
                                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                                            {post.title}
                                        </h2>
                                    </Link>

                                    <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                                        {post.excerpt}
                                    </p>
                                </div>

                                <div className="px-6 pb-6 mt-auto">
                                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-4 space-x-4">
                                        <div className="flex items-center">
                                            <User className="w-4 h-4 mr-1" />
                                            {post.author}
                                        </div>
                                        <div className="flex items-center">
                                            <Calendar className="w-4 h-4 mr-1" />
                                            {post.date}
                                        </div>
                                        <div className="flex items-center">
                                            <Clock className="w-4 h-4 mr-1" />
                                            {post.readTime}
                                        </div>
                                    </div>

                                    <Link
                                        to={`/blog/${post.slug}`}
                                        className="inline-flex items-center text-blue-600 dark:text-blue-400 font-semibold hover:underline"
                                    >
                                        Read Article <ArrowRight className="w-4 h-4 ml-1" />
                                    </Link>
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
};
