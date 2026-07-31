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

function airbnbListingUrlForArrival(date: CalendarDate) {
  const url = new URL(AIRBNB_LISTING_URL);
  url.searchParams.set('check_in', date.toString());
  return url.toString();
}

function CalendarContent() {
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
      ? 'Sæki dagatal…'
      : status === 'error'
        ? 'Gat ekki sótt dagatal'
        : availability.fetch === 'fetching'
          ? 'Samstillir dagatal…'
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
    window.open(airbnbListingUrlForArrival(date), '_blank', 'noopener,noreferrer');
  }

  return (
    <div className="availability-widget">
      <div className="availability-widget__header">
        <div>
          <span className="room-tag">Lausar dagsetningar</span>
          <h3>Finndu dagana sem henta</h3>
          <p>Veldu komudag í dagatalinu. Dökkbeige dagar eru uppteknir eða lokaðir og liðnir dagar eru deyfðir.</p>
        </div>
        {statusLabel && (
          <div className={`availability-status availability-status--${status}`} role="status">
            <span className="availability-status__dot" aria-hidden="true"></span>
            {statusLabel}
          </div>
        )}
      </div>

      <I18nProvider locale="is-IS">
        <Calendar
          aria-label="Lausar dagsetningar fyrir Höfn"
          className="availability-calendar"
          defaultFocusedValue={currentDate}
          firstDayOfWeek="mon"
          isDateUnavailable={(date) => blocked.has(date.toString())}
          minValue={currentDate}
          onChange={selectDate}
          value={selectedDate}
        >
          <div className="availability-calendar__toolbar">
            <Button slot="previous" aria-label="Fyrri mánuður">←</Button>
            <CalendarHeading />
            <Button slot="next" aria-label="Næsti mánuður">→</Button>
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
        <div className="availability-legend" aria-label="Skýringar">
          <span><i className="availability-legend__swatch availability-legend__swatch--open"></i> Laus</span>
          <span><i className="availability-legend__swatch availability-legend__swatch--blocked"></i> Ekki laus</span>
          <span><i className="availability-legend__swatch availability-legend__swatch--past"></i> Liðinn dagur</span>
          <span><i className="availability-legend__swatch availability-legend__swatch--selected"></i> Valinn dagur</span>
        </div>
        {selectedDate && <p>Komudagur valinn: <strong>{selectedDate.toString()}</strong></p>}
      </div>
    </div>
  );
}

export default function AvailabilityCalendar() {
  return (
    <ResultRpcProvider client={availabilityClient}>
      <CalendarContent />
    </ResultRpcProvider>
  );
}
