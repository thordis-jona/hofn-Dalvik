import { useState } from 'react';
import {
  Button,
  Calendar,
  CalendarCell,
  CalendarGrid,
  CalendarGridBody,
  CalendarGridHeader,
  CalendarHeaderCell,
  CalendarHeading,
  I18nProvider,
} from 'react-aria-components';
import { ResultRpcProvider, useResultQuery } from 'result-rpc/react';
import { getLocalTimeZone, today, type CalendarDate } from '@internationalized/date';
import { availabilityClient } from '../lib/availability-client';
import { AIRBNB_LISTING_URL } from '../lib/site-links';

const AVAILABILITY_STALE_TIME = 15 * 60 * 1000;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export interface AvailabilityCalendarMessages {
  eyebrow: string;
  title: string;
  instructions: string;
  loadingStatus: string;
  errorStatus: string;
  refreshingStatus: string;
  calendarLabel: string;
  previousMonthLabel: string;
  nextMonthLabel: string;
  legendLabel: string;
  availableLabel: string;
  unavailableLabel: string;
  pastLabel: string;
  selectedLabel: string;
  selectedDateLabel: string;
}

export interface AvailabilityCalendarProps {
  locale: 'is-IS' | 'en-GB';
  messages: AvailabilityCalendarMessages;
}

function airbnbListingUrlForArrival(date: CalendarDate) {
  const url = new URL(AIRBNB_LISTING_URL);
  url.searchParams.set('check_in', date.toString());
  return url.toString();
}

function CalendarContent({ locale, messages }: AvailabilityCalendarProps) {
  const availability = useResultQuery(availabilityClient.availability, {}, { staleTime: AVAILABILITY_STALE_TIME });
  const availabilityData =
    availability.state === 'success'
      ? availability.value
      : availability.state === 'failure'
        ? availability.previous
        : undefined;
  const blocked = new Set(availabilityData?.blocked ?? []);
  const currentDate = today(getLocalTimeZone());
  const status = availability.state === 'failure' ? 'error' : availability.state === 'pending' ? 'loading' : 'ready';
  const statusLabel =
    status === 'loading'
      ? messages.loadingStatus
      : status === 'error'
        ? messages.errorStatus
        : availability.fetch === 'fetching'
          ? messages.refreshingStatus
          : null;

  const [selectedDate, setSelectedDate] = useState<CalendarDate | null>(null);

  function selectDate(date: CalendarDate | null) {
    setSelectedDate(date);
    if (!date) return;
    const input = document.getElementById('checkin') as HTMLInputElement | null;
    if (input) {
      const valueSetter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')?.set;
      if (valueSetter) valueSetter.call(input, date.toString());
      else input.value = date.toString();
      input.dispatchEvent(new Event('input', { bubbles: true }));
    }
  }

  function openAirbnbForArrival(date: CalendarDate) {
    if (date.compare(currentDate) < 0 || blocked.has(date.toString())) return;
    const url = airbnbListingUrlForArrival(date);
    window.gtag?.('event', 'click_airbnb', {
      click_source: 'availability_calendar',
      check_in: date.toString(),
      link_url: url,
    });
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  return (
    <div className="availability-widget">
      <div className="availability-widget__header">
        <div>
          <span className="room-tag">{messages.eyebrow}</span>
          <h3>{messages.title}</h3>
          <p>{messages.instructions}</p>
        </div>
        {statusLabel && (
          <div className={`availability-status availability-status--${status}`} role="status">
            <span className="availability-status__dot" aria-hidden="true"></span>
            {statusLabel}
          </div>
        )}
      </div>

      <I18nProvider locale={locale}>
        <Calendar
          aria-label={messages.calendarLabel}
          className="availability-calendar"
          defaultFocusedValue={currentDate}
          firstDayOfWeek="mon"
          isDateUnavailable={(date) => blocked.has(date.toString())}
          minValue={currentDate}
          onChange={selectDate}
          value={selectedDate}
        >
          <div className="availability-calendar__toolbar">
            <Button slot="previous" aria-label={messages.previousMonthLabel}>←</Button>
            <CalendarHeading />
            <Button slot="next" aria-label={messages.nextMonthLabel}>→</Button>
          </div>
          <div className="availability-calendar__grid-frame">
            <CalendarGrid weekdayStyle="short">
              <CalendarGridHeader>
                {(day) => <CalendarHeaderCell>{day}</CalendarHeaderCell>}
              </CalendarGridHeader>
              <CalendarGridBody>
                {(date) => (
                  <CalendarCell
                    date={date}
                    onClick={() => openAirbnbForArrival(date)}
                  >
                    {({ formattedDate }) => <span>{formattedDate}</span>}
                  </CalendarCell>
                )}
              </CalendarGridBody>
            </CalendarGrid>
          </div>
        </Calendar>
      </I18nProvider>

      <div className="availability-widget__footer">
        <div className="availability-legend" aria-label={messages.legendLabel}>
          <span><i className="availability-legend__swatch availability-legend__swatch--open"></i> {messages.availableLabel}</span>
          <span><i className="availability-legend__swatch availability-legend__swatch--blocked"></i> {messages.unavailableLabel}</span>
          <span><i className="availability-legend__swatch availability-legend__swatch--past"></i> {messages.pastLabel}</span>
          <span><i className="availability-legend__swatch availability-legend__swatch--selected"></i> {messages.selectedLabel}</span>
        </div>
        {selectedDate && <p>{messages.selectedDateLabel}: <strong>{selectedDate.toString()}</strong></p>}
      </div>
    </div>
  );
}

export default function AvailabilityCalendar(props: AvailabilityCalendarProps) {
  return (
    <ResultRpcProvider client={availabilityClient}>
      <CalendarContent {...props} />
    </ResultRpcProvider>
  );
}
