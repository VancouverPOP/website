import type { CalendarEvent } from '../types/calendar';

export const MONTH_NAMES = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
];

export const DAY_NAMES = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
];

export function formatTime(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
    });
}

export function formatDayDate(dateStr: string): {
    dayName: string;
    dayNum: number;
    monthShort: string;
} {
    const date = new Date(dateStr);
    return {
        dayName: DAY_NAMES[date.getDay()],
        dayNum: date.getDate(),
        monthShort: MONTH_NAMES[date.getMonth()].slice(0, 3).toUpperCase(),
    };
}

export function isUrl(str: string): boolean {
    try {
        const url = new URL(str);
        return url.protocol === 'http:' || url.protocol === 'https:';
    } catch {
        return false;
    }
}

export function getLinkLabel(url: string): string {
    const hostname = new URL(url).hostname;
    if (hostname === 'zoom.us' || hostname.endsWith('.zoom.us')) {
        return 'Online (Zoom Meeting)';
    }
    return 'Link';
}

/**
 * Returns the venue name from a full Google Calendar location string.
 * Strips the street address, city, postal code, and country by taking
 * only the first comma-separated segment.
 *
 * Example: "Vancouver Public Library - Central Library, 350 W Georgia St, Vancouver, BC V6B 6B1, Canada"
 *       -> "Vancouver Public Library - Central Library"
 */
export function shortenLocation(location: string): string {
    const firstComma = location.indexOf(',');
    if (firstComma === -1) {
        return location.trim();
    }
    return location.slice(0, firstComma).trim();
}

export function renderLocation(
    locationWrapper: HTMLElement,
    locationEl: HTMLElement,
    location: string
): void {
    if (!location) {
        locationWrapper.classList.add('hidden');
        return;
    }

    if (isUrl(location)) {
        const anchor = document.createElement('a');
        anchor.href = location;
        anchor.target = '_blank';
        anchor.rel = 'noopener noreferrer';
        anchor.textContent = getLinkLabel(location);
        anchor.className = 'underline hover:text-vp-purple transition-colors';
        locationEl.replaceChildren(anchor);
    } else {
        locationEl.textContent = shortenLocation(location);
    }
}

export function isAllDay(event: CalendarEvent): boolean {
    return !!event.start.date && !event.start.dateTime;
}

export function getEventStartDate(event: CalendarEvent): string {
    return event.start.dateTime || event.start.date || '';
}

export function getEventEndDate(event: CalendarEvent): string {
    return event.end.dateTime || event.end.date || '';
}

export function getEventMonth(event: CalendarEvent): {
    year: number;
    month: number;
} {
    const dateStr = getEventStartDate(event);
    const date = new Date(dateStr);
    return { year: date.getFullYear(), month: date.getMonth() };
}

export function filterEventsByMonth(
    allEvents: CalendarEvent[],
    year: number,
    month: number
): CalendarEvent[] {
    return allEvents.filter((event) => {
        const { year: ey, month: em } = getEventMonth(event);
        return ey === year && em === month;
    });
}
