'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';

interface LikeButtonProps {
    id: string;
    initialLikes: number;
    type: 'project' | 'post';
}

export const LikeButton = ({ id, initialLikes, type }: LikeButtonProps) => {
    const [likes, setLikes] = useState(initialLikes);
    const [liked, setLiked] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Check local storage on mount
        const storageKey = `liked_${type}_${id}`;
        const isLiked = localStorage.getItem(storageKey) === 'true';
        setLiked(isLiked);
    }, [id, type]);

    const handleLike = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (loading) return;

        setLoading(true);
        const previousLikes = likes;
        const previousLiked = liked;
        const storageKey = `liked_${type}_${id}`;

        // Optimistic update
        if (liked) {
            setLikes(prev => Math.max(0, prev - 1));
            setLiked(false);
            localStorage.removeItem(storageKey);
        } else {
            setLikes(prev => prev + 1);
            setLiked(true);
            localStorage.setItem(storageKey, 'true');
        }

        try {
            const response = await fetch('/api/likes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type,
                    id,
                    action: liked ? 'unlike' : 'like'
                })
            });

            if (!response.ok) {
                // Revert if failed
                setLikes(previousLikes);
                setLiked(previousLiked);
                if (previousLiked) {
                    localStorage.setItem(storageKey, 'true');
                } else {
                    localStorage.removeItem(storageKey);
                }
            }
        } catch (error) {
            console.error('Error toggling like:', error);
            // Revert if failed
            setLikes(previousLikes);
            setLiked(previousLiked);
            if (previousLiked) {
                localStorage.setItem(storageKey, 'true');
            } else {
                localStorage.removeItem(storageKey);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleLike}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all duration-300 ${liked
                ? 'bg-red-500/20 text-red-500 border border-red-500/50'
                : 'bg-dark-200 text-gray-400 border border-gray-700 hover:border-red-500/50 hover:text-red-500'
                }`}
        >
            <Heart className={`w-4 h-4 ${liked ? 'fill-current' : ''}`} />
            <span className="text-sm font-medium">{likes}</span>
        </motion.button>
    );
};
