import type { CalendarEvent } from '../types/calendar';

const MONTHS_TO_FETCH = 6;

interface FetchCalendarEventsResult {
    events: CalendarEvent[];
    fetchError: boolean;
}

export async function fetchCalendarEvents(
    calendarId: string,
    apiKey: string
): Promise<FetchCalendarEventsResult> {
    const now = new Date();
    const timeMin = now.toISOString();
    const futureDate = new Date(
        now.getFullYear(),
        now.getMonth() + MONTHS_TO_FETCH + 1,
        0
    );
    const timeMax = futureDate.toISOString();

    let events: CalendarEvent[] = [];
    let fetchError = false;

    try {
        const params = new URLSearchParams({
            key: apiKey,
            timeMin,
            timeMax,
            singleEvents: 'true',
            orderBy: 'startTime',
            maxResults: '250',
        });

        const url = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events?${params}`;
        const response = await fetch(url);

        if (response.ok) {
            const data = await response.json();
            events = data.items.map((item: CalendarEvent) => ({
                summary: item.summary,
                description: item.description,
                location: item.location,
                start: {
                    date: item.start.date,
                    dateTime: item.start.dateTime,
                },
                end: {
                    date: item.end.date,
                    dateTime: item.end.dateTime,
                },
            }));
        } else {
            console.error(
                `Google Calendar API error: ${response.status} ${response.statusText}`
            );
            fetchError = true;
        }
    } catch (err) {
        console.error('Failed to fetch calendar events at build time:', err);
        fetchError = true;
    }

    return { events, fetchError };
}
