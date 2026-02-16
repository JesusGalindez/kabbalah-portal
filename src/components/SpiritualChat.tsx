'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Sparkles, X } from 'lucide-react';
import styles from './SpiritualChat.module.css';

interface Message {
    id: string;
    role: 'user' | 'ai';
    text: string;
}

export default function SpiritualChat() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { id: '1', role: 'ai', text: 'Shalom. I am the Oracle of the Tree. What wisdom do you seek?' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMsg: Message = { id: Date.now().toString(), role: 'user', text: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsLoading(true);

        try {
            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: userMsg.text }),
            });

            const data = await res.json();
            const aiMsg: Message = { id: (Date.now() + 1).toString(), role: 'ai', text: data.reply };

            setMessages(prev => [...prev, aiMsg]);
        } catch {
            setMessages(prev => [...prev, { id: Date.now().toString(), role: 'ai', text: "The Light is unreachable at this moment." }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {/* Floating Trigger */}
            <motion.button
                className={styles.trigger}
                onClick={() => setIsOpen(true)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
            >
                <Sparkles size={24} />
            </motion.button>

            {/* Chat Interface */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className={styles.overlay}
                        initial={{ opacity: 0, y: 50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 50, scale: 0.9 }}
                    >
                        <div className={styles.header}>
                            <h3>Oracle AI</h3>
                            <button onClick={() => setIsOpen(false)} className={styles.closeBtn}><X size={20} /></button>
                        </div>

                        <div className={styles.messages} ref={scrollRef}>
                            {messages.map((msg) => (
                                <div key={msg.id} className={`${styles.message} ${msg.role === 'user' ? styles.user : styles.ai}`}>
                                    <p>{msg.text}</p>
                                </div>
                            ))}
                            {isLoading && <div className={styles.typing}>Consulting the Zohar...</div>}
                        </div>

                        <form onSubmit={handleSubmit} className={styles.inputArea}>
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Ask about love, purpose, protection..."
                                disabled={isLoading}
                            />
                            <button type="submit" disabled={isLoading || !input.trim()}>
                                <Send size={18} />
                            </button>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
