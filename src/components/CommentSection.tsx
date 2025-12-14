'use client';

import { useState } from 'react';
import { MessageSquare, Send } from 'lucide-react';

interface CommentSectionProps {
    projectId?: string;
    postId?: string;
}

export const CommentSection = ({ projectId, postId }: CommentSectionProps) => {
    const [newComment, setNewComment] = useState('');
    const [authorName, setAuthorName] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        setSubmitting(true);
        try {
            const response = await fetch('/api/comments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    content: newComment,
                    author: authorName || 'Anonymous',
                    projectId,
                    postId
                })
            });

            if (response.ok) {
                const data = await response.json();
                if (data.success) {
                    setNewComment('');
                    setSubmitted(true);
                    setTimeout(() => setSubmitted(false), 5000);
                }
            }
        } catch (error) {
            console.error('Error submitting comment:', error);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="bg-dark-200 rounded-2xl p-6 border border-gray-700/50 mt-12">
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <MessageSquare className="w-6 h-6 text-primary-500" />
                Leave a Comment
            </h3>
            <p className="text-gray-400 mb-6 text-sm">
                Your comment will be sent to the author and will not be publicly visible.
            </p>

            {submitted ? (
                <div className="bg-green-500/10 border border-green-500/50 text-green-400 px-4 py-3 rounded-lg mb-6">
                    Thank you! Your comment has been sent successfully.
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <input
                            type="text"
                            placeholder="Your Name (Optional)"
                            value={authorName}
                            onChange={(e) => setAuthorName(e.target.value)}
                            className="w-full bg-dark-100 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 transition-colors"
                        />
                    </div>
                    <div className="relative">
                        <textarea
                            placeholder="Share your thoughts..."
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            className="w-full bg-dark-100 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 transition-colors min-h-[100px] resize-y"
                            required
                        />
                        <button
                            type="submit"
                            disabled={submitting || !newComment.trim()}
                            className="absolute bottom-3 right-3 p-2 bg-primary-500 text-white rounded-full hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <Send className="w-4 h-4" />
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
};
