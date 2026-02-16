import { NextResponse } from 'next/server';

const KABBALAH_WISDOM = {
    default: "The Light is infinite. Ask, and the vessel shall be filled.",
    love: "Love is the unification of the vessel and the light. In the Zohar, Chesed (Mercy) flows into Gevurah (Judgment) to create Tiferet (Beauty/Love).",
    money: "Sustenance comes from the Light. Money is energy (Shefa) that must flow. Tithing opens the gates of Malchut to receive.",
    purpose: "Your soul came to this world for Tikkun (Correction). Look to your challenges; they hold the keys to your purpose.",
    zohar: "The Zohar (Splendor) is the map of creation. Scanning its letters bypasses the intellect and speaks directly to the soul.",
    protection: "The 72 Names of God offers the sequence 'Aleph-Lamed-Dalet' for protection against the evil eye.",
    healing: "Healing is the restoration of wholeness. Meditate on the name 'Mem-Hey-Shin' to bring healing energy."
};

export async function POST(req: Request) {
    try {
        const { message } = await req.json();
        const lowerMsg = message.toLowerCase();

        // Simple keyword matching for prototype
        let response = KABBALAH_WISDOM.default;

        if (lowerMsg.includes('love') || lowerMsg.includes('relationship')) response = KABBALAH_WISDOM.love;
        if (lowerMsg.includes('money') || lowerMsg.includes('wealth')) response = KABBALAH_WISDOM.money;
        if (lowerMsg.includes('purpose') || lowerMsg.includes('why')) response = KABBALAH_WISDOM.purpose;
        if (lowerMsg.includes('zohar')) response = KABBALAH_WISDOM.zohar;
        if (lowerMsg.includes('protect') || lowerMsg.includes('evil')) response = KABBALAH_WISDOM.protection;
        if (lowerMsg.includes('heal') || lowerMsg.includes('health')) response = KABBALAH_WISDOM.healing;

        // Simulate network delay for "thinking"
        await new Promise(resolve => setTimeout(resolve, 1500));

        return NextResponse.json({ reply: response });
    } catch {
        return NextResponse.json({ reply: "The connection to the upper worlds is currently cloudy. Try again." }, { status: 500 });
    }
}
