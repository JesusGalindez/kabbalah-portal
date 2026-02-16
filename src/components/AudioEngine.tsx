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
            const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
            audioContextRef.current = new AudioContextClass();
            const gainNode = audioContextRef.current.createGain();
            gainNode.connect(audioContextRef.current.destination);
            gainNodeRef.current = gainNode;
        }
    };

    const playSound = (freq: number) => {
        if (!audioContextRef.current || !gainNodeRef.current) return;

        // Stop existing oscillators cleanly
        stopOscillators();

        const ctx = audioContextRef.current;
        const now = ctx.currentTime;
        const masterGain = gainNodeRef.current;

        // Master Filter (Low Pass) for softness
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(800, now); // Soft cutoff
        filter.Q.value = 1;
        filter.connect(masterGain);

        // Create 3 Oscillators for a "Pad" texture
        // 1. Root
        // 2. Lower Octave (Warmth)
        // 3. Perfect Fifth (Harmony)
        const frequencies = [freq, freq * 0.5, freq * 1.5];
        const gains = [0.15, 0.1, 0.05]; // Mix levels

        frequencies.forEach((f, i) => {
            const osc = ctx.createOscillator();
            const oscGain = ctx.createGain();

            osc.type = i === 1 ? 'triangle' : 'sine'; // Use triangle for bass warmth
            osc.frequency.setValueAtTime(f, now);

            // Detune slightly for "Chorus" effect
            if (i === 0) osc.detune.setValueAtTime(2, now);
            if (i === 2) osc.detune.setValueAtTime(-2, now);

            // Connect graph
            osc.connect(oscGain);
            oscGain.connect(filter);

            // Individual Envelope
            oscGain.gain.setValueAtTime(0, now);
            oscGain.gain.linearRampToValueAtTime(gains[i], now + 4); // Very slow attack (4s)

            osc.start();
            oscillatorsRef.current.push(osc);
        });

        // LFO for "Breathing" (Tremolo)
        const lfo = ctx.createOscillator();
        const lfoGain = ctx.createGain();
        lfo.frequency.value = 0.1; // 10 seconds per breath
        lfoGain.gain.value = 0.05; // Subtle depth

        lfo.connect(masterGain.gain);
        lfo.start();
        oscillatorsRef.current.push(lfo);

        // Master Gain Fade In
        masterGain.gain.cancelScheduledValues(now);
        masterGain.gain.setValueAtTime(0, now);
        masterGain.gain.linearRampToValueAtTime(0.5, now + 4);
    };

    const stopOscillators = () => {
        const ctx = audioContextRef.current;
        if (!ctx) return;
        oscillatorsRef.current.forEach(osc => {
            try {
                // Ramp down gently before stopping
                osc.stop(ctx.currentTime + 2);
            } catch { /* ignore */ }
        });
        oscillatorsRef.current = [];
    };

    const stopSound = () => {
        if (gainNodeRef.current && audioContextRef.current) {
            const now = audioContextRef.current.currentTime;
            gainNodeRef.current.gain.cancelScheduledValues(now);
            gainNodeRef.current.gain.setValueAtTime(gainNodeRef.current.gain.value, now);
            gainNodeRef.current.gain.exponentialRampToValueAtTime(0.001, now + 3); // 3s release

            setTimeout(() => {
                stopOscillators();
            }, 3000);
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
        // 639 Hz = Connection (Daily Gate)

        let freq = 396;
        if (pathname === '/ceremony') freq = 432;
        if (pathname === '/dashboard') freq = 528;
        // if (pathname === '/daily-gate') freq = 639;

        playSound(freq);
    };

    const toggleAudio = async () => {
        initAudio();
        if (!audioContextRef.current) return;
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
