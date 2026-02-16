declare module 'hebcal' {
    export class HDate {
        constructor(date: Date);
        toString(encoding?: string): string;
        getMonth(): number;
        getDate(): number;
        getFullYear(): number;
        greg(): Date;
        getMonthName(): string;
        static getHolidaysOnDate(hDate: HDate): any[];
    }

    export class HebrewCalendar {
        static getHolidaysOnDate(hDate: HDate): any[];
    }

    export class Location {
        constructor(lat: number, long: number);
    }
}
