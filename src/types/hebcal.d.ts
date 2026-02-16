declare module 'hebcal' {
    export interface Holiday {
        desc: string;
    }

    export class HDate {
        constructor(date?: Date);
        toString(encoding?: string): string;
        getMonth(): number;
        getDate(): number;
        getFullYear(): number;
        greg(): Date;
        getMonthName(): string;
        holidays(): Holiday[];
    }

    export class Location {
        constructor(lat: number, long: number);
    }
}
