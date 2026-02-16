'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { getHebrewDate, HebrewDateInfo } from '@/lib/kabbalah/date-converter';
import { getTikkun, TikkunInfo } from '@/lib/kabbalah/tikkun';
import styles from './CeremonialForm.module.css';

interface FormData {
    name: string;
    birthDate: string;
    birthTime: string;
    birthPlace: string;
}

export default function CeremonialForm() {
    const [step, setStep] = useState(0);
    const [formData, setFormData] = useState<FormData>({
        name: '',
        birthDate: '',
        birthTime: '',
        birthPlace: '',
    });

    const [results, setResults] = useState<{
        hebrewDate: HebrewDateInfo | null;
        tikkun: TikkunInfo | null;
    }>({ hebrewDate: null, tikkun: null });

    const questions = [
        { key: 'name', label: 'What is your name, seeker?', type: 'text' },
        { key: 'birthDate', label: 'When did your soul enter this world?', type: 'date' },
        { key: 'birthTime', label: 'At what hour?', type: 'time' },
        { key: 'birthPlace', label: 'Where were you born?', type: 'text' },
    ];

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const calculate = () => {
        const date = new Date(formData.birthDate);
        if (!isNaN(date.getTime())) {
            const hebrewDate = getHebrewDate(date);
            const tikkun = getTikkun(date);
            setResults({ hebrewDate, tikkun });
        }
    };

    const nextStep = () => {
        if (step === questions.length - 1) {
            calculate();
        }
        setStep(step + 1);
    };

    const prevStep = () => setStep(step - 1);

    return (
        <div className={styles.container}>
            <AnimatePresence mode="wait">
                {step < questions.length ? (
                    <motion.div
                        key={step}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.8, ease: "easeInOut" }}
                        className={styles.questionCard}
                    >
                        <h2 className={styles.question}>{questions[step].label}</h2>
                        <input
                            className={styles.input}
                            type={questions[step].type}
                            name={questions[step].key}
                            value={(formData as any)[questions[step].key]}
                            onChange={handleChange}
                            autoFocus
                            onKeyDown={(e) => e.key === 'Enter' && nextStep()}
                        />
                        <div className={styles.controls}>
                            {step > 0 && <button onClick={prevStep} className={styles.backButton}>Back</button>}
                            <button onClick={nextStep} className={styles.nextButton}>Continue</button>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className={styles.completion}
                    >
                        <h2>Your Journey Begins</h2>
                        {results.hebrewDate && (
                            <div className={styles.resultDetails}>
                                <p>Hebrew Date: {results.hebrewDate.hebrewString}</p>
                                <p>Kabbalistic Sign: {results.hebrewDate.monthName}</p>
                            </div>
                        )}
                        {results.tikkun && (
                            <div className={styles.resultDetails}>
                                <p>{results.tikkun.description}</p>
                                {/* <p>Correction: {results.tikkun.correction}</p> */}
                            </div>
                        )}
                        <Link href="/dashboard" className={styles.nextButton} style={{ marginTop: '2rem', textDecoration: 'none', display: 'inline-block' }}>
                            Enter the Tree
                        </Link>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
