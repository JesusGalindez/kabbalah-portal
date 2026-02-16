'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
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


    const initAudio = useCallback(() => {
        if (!audioContextRef.current) {
            const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
            audioContextRef.current = new AudioContextClass();
            const gainNode = audioContextRef.current.createGain();
            gainNode.connect(audioContextRef.current.destination);
            gainNodeRef.current = gainNode;
        }
    }, []);

    const stopOscillators = useCallback(() => {
        const ctx = audioContextRef.current;
        if (!ctx) return;
        oscillatorsRef.current.forEach(osc => {
            try {
                osc.stop(ctx.currentTime + 2);
            } catch { /* ignore */ }
        });
        oscillatorsRef.current = [];
    }, []);

    const stopSound = useCallback(() => {
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
    }, [stopOscillators]);

    const playSound = useCallback((freq: number) => {
        if (!audioContextRef.current || !gainNodeRef.current) return;

        stopOscillators();

        const ctx = audioContextRef.current;
        const now = ctx.currentTime;
        const masterGain = gainNodeRef.current;

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(800, now);
        filter.Q.value = 1;
        filter.connect(masterGain);

        const frequencies = [freq, freq * 0.5, freq * 1.5];
        const gains = [0.15, 0.1, 0.05];

        frequencies.forEach((f, i) => {
            const osc = ctx.createOscillator();
            const oscGain = ctx.createGain();

            osc.type = i === 1 ? 'triangle' : 'sine';
            osc.frequency.setValueAtTime(f, now);

            if (i === 0) osc.detune.setValueAtTime(2, now);
            if (i === 2) osc.detune.setValueAtTime(-2, now);

            osc.connect(oscGain);
            oscGain.connect(filter);

            oscGain.gain.setValueAtTime(0, now);
            oscGain.gain.linearRampToValueAtTime(gains[i], now + 4);

            osc.start();
            oscillatorsRef.current.push(osc);
        });

        const lfo = ctx.createOscillator();
        const lfoGain = ctx.createGain();
        lfo.frequency.value = 0.1;
        lfoGain.gain.value = 0.05;

        lfo.connect(masterGain.gain);
        lfo.start();
        oscillatorsRef.current.push(lfo);

        masterGain.gain.cancelScheduledValues(now);
        masterGain.gain.setValueAtTime(0, now);
        masterGain.gain.linearRampToValueAtTime(0.5, now + 4);
    }, [stopOscillators]);

    const updateFrequency = useCallback(() => {
        if (!audioContextRef.current) return;

        let freq = 396;
        if (pathname === '/ceremony') freq = 432;
        if (pathname === '/dashboard') freq = 528;

        playSound(freq);
    }, [pathname, playSound]);

    useEffect(() => {
        return () => {
            stopSound();
            if (audioContextRef.current) {
                audioContextRef.current.close();
            }
        };
    }, [stopSound]);

    useEffect(() => {
        if (isPlaying && !isMuted) {
            updateFrequency();
        }
    }, [pathname, isPlaying, isMuted, updateFrequency]);

    const toggleAudio = useCallback(async () => {
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
    }, [initAudio, isPlaying, stopSound, updateFrequency]);

    return (
        <button onClick={toggleAudio} className={styles.audioControl} aria-label="Toggle Sound">
            {isPlaying ? <Volume2 size={24} /> : <VolumeX size={24} />}
            <span className={styles.tooltip}>{isPlaying ? 'Sound On (Solfeggio)' : 'Enable Sound'}</span>
        </button>
    );
}
