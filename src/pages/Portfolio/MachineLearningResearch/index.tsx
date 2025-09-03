// Machine Learning Research

import { useEffect, useState, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from "framer-motion"
import Tag from '../../../components/Tag';

const MachineLearningResearch = () => {
    const tags = useMemo(() => [
        'Deep Learning',
        'Natural Language Processing',
        'Reinforcement Learning',
        'Convolutional Neural Networks',
        'Recurrent Neural Networks'
    ], []);

    const topics = useMemo(() => [
        {
            title: 'Tic-Tac-Toe using Markov Decision Processes',
            tags: ['Markov Decision Process', 'Game Theory', 'Reinforcement Learning'],
            github: 'https://github.com/aarondavis-git/TicTacToe-MarkovDecisionProcess'
        },

        {
            title: 'Pong using Policy Gradients',
            tags: ['Policy Gradients', 'Deep Learning', 'Reinforcement Learning'],
            github: 'https://github.com/aarondavis-git/Pong-PolicyGradients'
        },

        {
            title: 'Pruning using the Lottery Ticket Hypothesis',
            tags: ['Neural Networks', 'Pruning', 'Optimization'],
            github: 'https://github.com/aarondavis-git/Pruning-LotteryTicketHypothesis'
        }
    ], []);

    const [openMenu, setOpenMenu] = useState<number | null>(null);
    const [activeTag, setActiveTag] = useState<string | null>(null);
    const [filteredTopicTitles, setFilteredTopicTitles] = useState<string[] | null>(null);
    const menuRef = useRef<HTMLDivElement>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    // Recommended Tags
    const recommendedTags = useMemo(() => {
        if (!activeTag) return [];
        const relatedTags = new Set<string>();
        topics.forEach(topic => {
            if (topic.tags.includes(activeTag)) {
                topic.tags.forEach(tag => {
                    if (tag !== activeTag) relatedTags.add(tag);
                })
            }
        })
        return Array.from(relatedTags);
    }, [activeTag, topics]);

    // Search
    useEffect(() => {
        if (searchTerm.trim() === '') {
            setSuggestions([]);
            return
        }
        const lowered = searchTerm.toLowerCase();
        const matchingTags = tags.filter(tag =>
            tag.toLowerCase().includes(lowered));
        const matchingTopics = topics
            .map(t => t.title)
            .filter(title => title.toLowerCase().includes(lowered));

        setSuggestions([...matchingTags, ...matchingTopics]);
    }, [searchTerm, tags, topics]);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                wrapperRef.current &&
                !wrapperRef.current.contains(event.target as Node)

            ) {
                setShowSuggestions(false)
                setSuggestions([]); //reset when clicking outside
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node))
                setOpenMenu(null);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Compute filtered topics
    const filteredTopics = useMemo(() => {
        if (filteredTopicTitles) {
            return topics.filter(topic => filteredTopicTitles.includes(topic.title));
        }
        if (activeTag) {
            return topics.filter(topic => topic.tags.includes(activeTag));
        }
        return topics;
    }, [activeTag, topics, filteredTopicTitles]);

    return (
        <div className="w-full max-w-6xl mx-auto px-4 py-12 mb-6">

            {/* Top Section */}
            <section className="text-center mb-12">
                <h2 className="text-2xl md:text-4xl font-bold mb-4"
                >
                    Research Topics
                </h2>
            </section>

            {/* Home Botton */}
            <div className='flex flex-row gap-4 mb-6'>
                <div
                    onClick={() => {
                        setActiveTag(null);
                        setFilteredTopicTitles(null);
                    }}
                    className='flex-shrink-0 bg-[#36454f] dark:bg-[#d4af7f] aspect-square rounded-xl'
                    style={{ width: '5rem', height: '5rem' }}
                />

                {/* Tag List */}
                <div className='flex flex-wrap justify-center items-center gap-3 overflow-hidden'
                    style={{ maxHeight: 'calc(2 * 2.5rem)' }}>
                    {!activeTag && (
                        tags.map(tag =>
                            <Tag
                                key={tag}
                                label={tag}
                                onClick={() => setActiveTag(tag)}
                            />
                        ))
                    }
                    {activeTag && (
                        <Tag
                            label={activeTag}
                            onClick={() => setActiveTag(null)}
                        />
                    )}
                    {recommendedTags.map(tag => (
                        <Tag
                            key={`recommended-${tag}`}
                            label={tag}
                            onClick={() =>
                                setActiveTag(tag)}
                        />
                    ))}
                </div>
            </div>

            {/* Search */}
            <div className='relative mb-6' ref={wrapperRef}>
                <input
                    type="text"
                    placeholder=''
                    value={searchTerm}
                    onChange={e => {
                        setSearchTerm(e.target.value);
                        setShowSuggestions(true);
                    }}
                    className='w-full px-4 py-2 border rounded-xl'
                />
                {showSuggestions && suggestions.length > 0 && (
                    <ul className='absolute top-[calc(100%+4px)] overflow-auto  z-50 max-h-60 w-full rounded-xl divide-y divide-[#fff0f5] dark:divide-[#722f37]
                        bg-[#99627a] text-[#fff0f5] 
                                    dark:bg-[#f4dec2] dark:text-[#722f37]'>
                        {suggestions.map((suggest, i) => (
                            <li
                                key={i}
                                onClick={() => {
                                    const isTag = tags.includes(suggest);
                                    if (isTag) {
                                        setActiveTag(suggest);
                                    } else {
                                        const matched = topics.find(t => t.title === suggest);
                                        if (matched) {
                                            setActiveTag(null);
                                            setFilteredTopicTitles([matched.title]);
                                        }
                                    }
                                    setSearchTerm('');
                                    setSuggestions([]);
                                    setShowSuggestions(false);

                                }}
                                className='py-1 hover:bg-[#36454f] dark:hover:bg-[#d4af7f]'
                            >
                                {suggest}
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* Topics Section */}
            <div className='flex flex-col gap-4 w-full justify-center'>
                {filteredTopics.map((topic, idx) => (
                    <div key={idx}
                        className="relative flex flex-row items-center gap-4 bg-black/10 dark:bg-white/10 rounded-xl w-full h-20"
                    >
                        {/* Picture */}
                        <div
                            className='flex-shrink-0 bg-[#36454f] dark:bg-[#d4af7f] aspect-square rounded-xl'
                            style={{ width: '5rem', height: '5rem' }}
                        />
                        {/* Topic */}
                        <a
                            href={topic.github}
                            target='_blank'
                            rel="noopener norefferrer"
                            className='ml-4'
                        >
                            {topic.title}
                        </a>
                        {/* Conditional render of either the floating tag menu or + */}
                        {openMenu === idx ? (
                            <AnimatePresence>
                                {/* Floating Tag Menu*/}
                                <motion.div
                                    ref={menuRef}
                                    initial={{ opacity: 0, scale: 0.9, y: 8 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.9, y: 8 }}
                                    transition={{ duration: 0.2 }}
                                    className="absolute bottom-0 right-0 origin-bottom-right mb-4 flex flex-col
                                         bg-[#36454f] dark:bg-white/10 rounded-xl backdrop-blur-md shadow-lg overflow-hidden"
                                >
                                    {/* #99627a - mauve/antique lavander, #36454f - charcoal, #fff0f5 - lavender blush
                                #f4dec2 - light gold champagne, #d4af7f - classic champagne, #722f37 - deep wine */}
                                    {topic.tags.map((tag, i) => (
                                        <div key={tag} className="bg-[#99627a] hover:bg-[#36454f] text-[#fff0f5] 
                                    dark:bg-[#f4dec2] dark:hover:bg-[#d4af7f] dark:text-[#722f37] text-shadow-none flex flex-col items-center w-full">
                                            <Tag
                                                label={tag}
                                                noBackground
                                                onClick={(label) => setActiveTag(label)}
                                            />
                                            {i < topic.tags.length - 1 && (
                                                <div className="w-full h-px bg-[#ffffff] dark:bg-[#d4af7f]" />
                                            )}
                                        </div>
                                    ))}
                                </motion.div>
                            </AnimatePresence>
                        ) : (
                            // Button
                            <button
                                onClick={() => setOpenMenu(openMenu === idx ? null : idx)}
                                className='absolute right-6 text-4xl font-bold leading-none'>
                                +
                            </button>
                        )}
                    </div>
                )
                )}
            </div>
        </div>
    )
};

export default MachineLearningResearch;
