import { HDate } from 'hebcal';
// If typical ESM fail, might need: import hebcal from 'hebcal'; const { HDate } = hebcal;


export interface HebrewDateInfo {
    day: number;
    month: number;
    year: number;
    monthName: string;
    hebrewString: string;
    isHoliday: boolean;
    holidays: string[];
}

export function getHebrewDate(date: Date): HebrewDateInfo {
    const hDate = new HDate(date);

    // Get holidays for this date if any
    // Based on hebcal API, holidays() is a method on the HDate instance
    const holidays = hDate.holidays() || [];
    const holidayNames = holidays.map(h => typeof h === 'string' ? h : h.desc);

    return {
        day: hDate.getDate(),
        month: hDate.getMonth(),
        year: hDate.getFullYear(),
        monthName: hDate.getMonthName(),
        hebrewString: hDate.toString(), // e.g. "15th of Nisan, 5784"
        isHoliday: holidayNames.length > 0,
        holidays: holidayNames,
    };
}

/**
 * Calculates the rough "Kabbalistic Sign" based on the Hebrew Month.
 * This is a simplification; precise calculation uses the exact sun position.
 */
export function getKabbalisticSign(hebrewMonth: string): string {
    const signs: Record<string, string> = {
        'Nisan': 'Aries (Taleh)',
        'Iyyar': 'Taurus (Shor)',
        'Sivan': 'Gemini (Teomim)',
        'Tamuz': 'Cancer (Sartan)',
        'Av': 'Leo (Aryeh)',
        'Elul': 'Virgo (Betulah)',
        'Tishrei': 'Libra (Moznayim)',
        'Cheshvan': 'Scorpio (Akrav)',
        'Kislev': 'Sagittarius (Keshet)',
        'Tevet': 'Capricorn (Gedi)',
        'Shvat': 'Aquarius (Dli)',
        'Adar': 'Pisces (Dagim)',
        'Adar I': 'Pisces A (Dagim A)',
        'Adar II': 'Pisces B (Dagim B)'
    };
    return signs[hebrewMonth] || 'Unknown';
}
