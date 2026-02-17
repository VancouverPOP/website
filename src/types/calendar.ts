export interface CalendarEvent {
    summary?: string;
    description?: string;
    location?: string;
    start: { date?: string; dateTime?: string };
    end: { date?: string; dateTime?: string };
}
