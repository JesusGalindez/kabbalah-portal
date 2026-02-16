declare module 'hebcal' {
    export class HDate {
        constructor(date?: Date | string | number);
        getDate(): number;
        getMonth(): number;
        getMonthName(): string;
        getFullYear(): number;
        toString(): string;
        static getHolidaysOnDate(hDate: HDate): any[];
    }

    export class HebrewCalendar {
        static getHolidaysOnDate(hDate: HDate): any[];
    }

    export class Location {
        constructor(lat: number, long: number);
    }
}
