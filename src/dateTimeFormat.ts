export class LocaleDate {
    public readonly date: string;
    public readonly time: string;
    public readonly full: string;

    constructor(dateString: string) {
        const date = new Date(dateString);
        this.date = date.toLocaleDateString();
        this.time = date.toLocaleTimeString();
        this.full = date.toLocaleString();
    }
}

export class Duration {
    public readonly minutes: number;
    public readonly seconds: number;

    constructor(timeString: string) {
        const pattern = /^(\d+):([0-5]\d):([0-5]\d)$/;
        const match = timeString.match(pattern);

        if (!match) {
            throw new Error(
                `Invalid format: "${timeString}". Expected H:MM:SS`
            );
        }

        const hrs = parseInt(match[1], 10);
        const mins = parseInt(match[2], 10);
        const secs = parseInt(match[3], 10);

        this.minutes = hrs * 60 + mins;
        this.seconds = secs;
    }

    public getTotalSeconds(): number {
        return this.minutes * 60 + this.seconds;
    }
}