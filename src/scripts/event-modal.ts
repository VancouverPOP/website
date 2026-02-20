import type { CalendarEvent } from '../types/calendar';
import {
    MONTH_NAMES,
    DAY_NAMES,
    formatTime,
    formatDayDate,
    isAllDay,
    getEventStartDate,
    getEventEndDate,
    renderFullLocation,
} from './calendar-utils';

const calOverlay = document.getElementById('cal-overlay');
const calModal = document.getElementById('cal-modal');

export function openEventModal(event: CalendarEvent): void {
    if (!calModal || !calOverlay) return;

    const startStr = getEventStartDate(event);
    const endStr = getEventEndDate(event);
    const { dayName, dayNum, monthShort } = formatDayDate(startStr);

    // Populate date badge
    const monthShortEl = document.getElementById('modal-month-short');
    const dayNumEl = document.getElementById('modal-day-num');
    const dayNameEl = document.getElementById('modal-day-name');
    if (monthShortEl) monthShortEl.textContent = monthShort;
    if (dayNumEl) dayNumEl.textContent = String(dayNum);
    if (dayNameEl) dayNameEl.textContent = dayName.slice(0, 3);

    // Title
    const titleEl = document.getElementById('modal-title');
    if (titleEl) titleEl.textContent = event.summary || 'Untitled Event';

    // Time -- include full date for context
    const timeEl = document.getElementById('modal-time');
    if (timeEl) {
        const startDate = new Date(startStr);
        const dateLabel = `${DAY_NAMES[startDate.getDay()]}, ${MONTH_NAMES[startDate.getMonth()]} ${startDate.getDate()}, ${startDate.getFullYear()}`;
        if (isAllDay(event)) {
            timeEl.textContent = `${dateLabel} \u2022 All Day`;
        } else {
            timeEl.textContent = `${dateLabel} \u2022 ${formatTime(startStr)} - ${formatTime(endStr)}`;
        }
    }

    // Location (full, not shortened)
    renderFullLocation(
        document.getElementById('modal-location-wrapper') as HTMLElement,
        document.getElementById('modal-location') as HTMLElement,
        event.location || ''
    );

    // Description (rendered as HTML)
    const descWrapper = document.getElementById('modal-description-wrapper');
    const descEl = document.getElementById('modal-description');
    const rawDescription = event.description || '';
    if (descEl && descWrapper) {
        if (rawDescription.trim()) {
            descWrapper.classList.remove('hidden');
            descEl.innerHTML = rawDescription;

            // Style dynamically injected links from calendar description
            descEl.querySelectorAll('a').forEach((a) => {
                a.classList.add(
                    'text-vp-purple',
                    'underline',
                    'hover:opacity-80'
                );
            });
        } else {
            descWrapper.classList.add('hidden');
        }
    }

    // Show modal and overlay
    calOverlay.classList.remove('hidden');
    calOverlay.classList.add('flex');
    calModal.classList.remove('hidden');
    calModal.classList.add('flex');

    // Prevent background scroll, compensating for scrollbar width to avoid layout shift
    const scrollbarWidth =
        window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = 'hidden';
    document.body.style.paddingRight = `${scrollbarWidth}px`;

    // Focus the modal for accessibility
    calModal.focus();
}

export function closeEventModal(): void {
    if (!calModal || !calOverlay) return;
    calOverlay.classList.add('hidden');
    calOverlay.classList.remove('flex');
    calModal.classList.add('hidden');
    calModal.classList.remove('flex');
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
}
