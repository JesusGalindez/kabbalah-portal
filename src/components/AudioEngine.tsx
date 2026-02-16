'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Volume2, VolumeX } from 'lucide-react';
import styles from './AudioEngine.module.css';

export default function AudioEngine() {
    const pathname = usePathname();
    const audioContextRef = useRef<AudioContext | null>(null);
    const oscillatorsRef = useRef<OscillatorNode[]>([]);
    const gainNodeRef = useRef<GainNode | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);

    useEffect(() => {
        // Initialize Audio Context on first user interaction (handled by toggle)
        return () => {
            stopSound();
            if (audioContextRef.current) {
                audioContextRef.current.close();
            }
        };
    }, []);

    useEffect(() => {
        if (isPlaying && !isMuted) {
            updateFrequency();
        }
    }, [pathname, isPlaying, isMuted]);

    const initAudio = () => {
        if (!audioContextRef.current) {
            const AudioContextClass = (window.AudioContext || (window as any).webkitAudioContext);
            audioContextRef.current = new AudioContextClass();
            const gainNode = audioContextRef.current.createGain();
            gainNode.connect(audioContextRef.current.destination);
            gainNodeRef.current = gainNode;
        }
    };

    const playSound = (freq: number, type: OscillatorType = 'sine') => {
        if (!audioContextRef.current || !gainNodeRef.current) return;

        // Stop existing oscillators
        stopOscillators();

        const osc = audioContextRef.current.createOscillator();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, audioContextRef.current.currentTime);

        // Smooth transition
        gainNodeRef.current.gain.cancelScheduledValues(audioContextRef.current.currentTime);
        gainNodeRef.current.gain.setValueAtTime(0, audioContextRef.current.currentTime);
        gainNodeRef.current.gain.linearRampToValueAtTime(0.1, audioContextRef.current.currentTime + 2); // Soft attack

        osc.connect(gainNodeRef.current);
        osc.start();
        oscillatorsRef.current.push(osc);

        // Add a second harmonic for richness
        const osc2 = audioContextRef.current.createOscillator();
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(freq * 1.5, audioContextRef.current.currentTime); // Perfect fifth
        const gain2 = audioContextRef.current.createGain();
        gain2.gain.value = 0.05;
        gain2.connect(audioContextRef.current.destination);
        osc2.connect(gain2);
        osc2.start();
        oscillatorsRef.current.push(osc2);
    };

    const stopOscillators = () => {
        oscillatorsRef.current.forEach(osc => {
            try {
                osc.stop();
                osc.disconnect();
            } catch (e) { /* ignore already stopped */ }
        });
        oscillatorsRef.current = [];
    };

    const stopSound = () => {
        if (gainNodeRef.current && audioContextRef.current) {
            gainNodeRef.current.gain.exponentialRampToValueAtTime(0.0001, audioContextRef.current.currentTime + 1);
            setTimeout(() => stopOscillators(), 1000);
        } else {
            stopOscillators();
        }
    };

    const updateFrequency = () => {
        if (!audioContextRef.current) return;

        // Frequencies logic
        // 432 Hz = Verdict/Nature (Ceremony)
        // 528 Hz = DNA Repair/Miracle (Dashboard)
        // 396 Hz = Liberating Guilt (Home/Intro)

        if (pathname === '/ceremony') {
            playSound(432);
        } else if (pathname === '/dashboard') {
            playSound(528);
        } else {
            playSound(396); // Root
        }
    };

    const toggleAudio = async () => {
        initAudio();
        if (audioContextRef.current?.state === 'suspended') {
            await audioContextRef.current.resume();
        }

        if (isPlaying) {
            stopSound();
            setIsPlaying(false);
            setIsMuted(true);
        } else {
            setIsMuted(false);
            setIsPlaying(true);
            updateFrequency();
        }
    };

    return (
        <button onClick={toggleAudio} className={styles.audioControl} aria-label="Toggle Sound">
            {isPlaying ? <Volume2 size={24} /> : <VolumeX size={24} />}
            <span className={styles.tooltip}>{isPlaying ? 'Sound On (Solfeggio)' : 'Enable Sound'}</span>
        </button>
    );
}
