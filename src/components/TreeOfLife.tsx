'use client';

import { motion } from 'framer-motion';
import styles from './TreeOfLife.module.css';

interface SefiraProps {
    cx: number;
    cy: number;
    r: number;
    color: string;
    name: string;
    onClick: (name: string) => void;
}

const Sefira = ({ cx, cy, r, color, name, onClick }: SefiraProps) => (
    <motion.g
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => onClick(name)}
        className={styles.sefira}
    >
        <circle cx={cx} cy={cy} r={r} fill={color} stroke="var(--color-gold)" strokeWidth="2" />
        <text x={cx} y={cy + 5} textAnchor="middle" fill="white" fontSize="10" fontFamily="var(--font-sans)">
            {name}
        </text>
    </motion.g>
);

const Path = ({ d }: { d: string }) => (
    <path d={d} stroke="var(--color-gold)" strokeWidth="1" opacity="0.5" fill="none" />
);

export default function TreeOfLife() {
    const handleSefiraClick = (name: string) => {
        alert(`You selected ${name}. Energy details coming soon.`);
    };

    // Coordinates for 10 Sefirot (simplified vertical layout)
    // Keter (top), Malchut (bottom)
    const sefirot = [
        { name: 'Keter', cx: 200, cy: 50, color: '#FFFFFF' },
        { name: 'Chokmah', cx: 350, cy: 120, color: '#C0C0C0' },
        { name: 'Binah', cx: 50, cy: 120, color: '#000000' },
        { name: 'Chesed', cx: 350, cy: 220, color: '#0000FF' },
        { name: 'Gevurah', cx: 50, cy: 220, color: '#FF0000' },
        { name: 'Tiferet', cx: 200, cy: 270, color: '#FFFF00' },
        { name: 'Netzach', cx: 350, cy: 370, color: '#00FF00' },
        { name: 'Hod', cx: 50, cy: 370, color: '#FFA500' },
        { name: 'Yesod', cx: 200, cy: 420, color: '#800080' },
        { name: 'Malchut', cx: 200, cy: 520, color: '#964B00' },
    ];

    // Paths logic (simplified connections)
    // Connect Keter to Chokmah, Binah
    // Chokmah to Binah, Chesed, Tiferet
    // etc.
    const paths = [
        "M 200 50 L 350 120", // Keter - Chokmah
        "M 200 50 L 50 120",  // Keter - Binah
        "M 350 120 L 50 120", // Chokmah - Binah
        "M 350 120 L 350 220", // Chokmah - Chesed
        "M 50 120 L 50 220",   // Binah - Gevurah
        "M 350 120 L 200 270", // Chokmah - Tiferet
        "M 50 120 L 200 270",  // Binah - Tiferet
        // ... more paths needed for full tree, keeping simple for prototype
        "M 200 50 L 200 270", // Keter - Tiferet (Middle Pillar)
        "M 200 270 L 200 420", // Tiferet - Yesod
        "M 200 420 L 200 520", // Yesod - Malchut
    ];

    return (
        <div className={styles.container}>
            <svg viewBox="0 0 400 600" className={styles.svg}>
                {paths.map((d, i) => <Path key={i} d={d} />)}
                {sefirot.map((s) => (
                    <Sefira
                        key={s.name}
                        cx={s.cx}
                        cy={s.cy}
                        r={30}
                        color={s.color}
                        name={s.name}
                        onClick={handleSefiraClick}
                    />
                ))}
            </svg>
        </div>
    );
}
