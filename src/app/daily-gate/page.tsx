'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import styles from './page.module.css';

export default function DailyGatePage() {
    const [isScanning, setIsScanning] = useState(false);

    // Aramaic Zohar Text (Placeholder excerpt)
    const zoharText = [
        "בְּרֵאשִׁית בָּרָא אֱלֹהִים אֵת הַשָּׁמַיִם וְאֵת הָאָרֶץ",
        "וְהָאָרֶץ הָיְתָה תֹהוּ וָבֹהוּ וְחֹשֶׁךְ עַל־פְּנֵי תְהוֹם",
        "וְרוּחַ אֱלֹהִים מְרַחֶפֶת עַל־פְּנֵי הַמָּיִם",
        "וַיֹּאמֶר אֱלֹהִים יְהִי אוֹר וַיְהִי־אוֹר"
    ];

    const handleScan = () => {
        setIsScanning(true);
        setTimeout(() => setIsScanning(false), 5000); // 5s scan duration
    };

    return (
        <main className={styles.container}>
            <h1 className={styles.title}>The Daily Gate</h1>
            <p className={styles.subtitle}>Scan the Zohar to reveal the Light of the day.</p>

            <div className={styles.zoharContainer}>
                {zoharText.map((line, index) => (
                    <div key={index} className={styles.zoharLine}>
                        {line}
                    </div>
                ))}

                {/* Scanning Light overlay */}
                {isScanning && (
                    <motion.div
                        className={styles.scanner}
                        initial={{ top: '-10%', opacity: 0 }}
                        animate={{ top: '110%', opacity: [0, 1, 1, 0] }}
                        transition={{ duration: 4, ease: "linear" }}
                    />
                )}
            </div>

            <motion.button
                className={styles.scanButton}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleScan}
                disabled={isScanning}
            >
                {isScanning ? "Receiving Light..." : "Open the Gate"}
            </motion.button>
        </main>
    );
}
