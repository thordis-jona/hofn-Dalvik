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

function CalendarContent() {
  const availability = useResultQuery(availabilityClient.availability);
  const availabilityData =
    availability.state === 'success'
      ? availability.value
      : availability.state === 'failure'
        ? availability.previous
        : undefined;
  const blocked = new Set(availabilityData?.blocked ?? []);
  const status = availability.state === 'failure' ? 'error' : availability.state === 'pending' ? 'loading' : 'ready';
  const updatedAt = availabilityData?.updatedAt ?? null;

  const [selectedDate, setSelectedDate] = useState<CalendarDate | null>(null);

  function selectDate(date: CalendarDate | null) {
    setSelectedDate(date);
    if (!date) return;
    const input = document.getElementById('checkin') as HTMLInputElement | null;
    if (input) {
      input.value = date.toString();
      input.dispatchEvent(new Event('change', { bubbles: true }));
    }
  }

  return (
    <div className="availability-widget">
      <div className="availability-widget__header">
        <div>
          <span className="room-tag">Lausar dagsetningar</span>
          <h3>Finndu dagana sem henta</h3>
          <p>Veldu komudag í dagatalinu. Gráir dagar eru þegar uppteknir eða lokaðir.</p>
        </div>
        <div className={`availability-status availability-status--${status}`} role="status">
          <span className="availability-status__dot" aria-hidden="true"></span>
          {status === 'loading' && 'Sæki dagatal…'}
          {status === 'ready' && 'Dagatal uppfært'}
          {status === 'error' && 'Gat ekki sótt dagatal'}
        </div>
      </div>

      <I18nProvider locale="is-IS">
        <Calendar
          aria-label="Lausar dagsetningar fyrir Höfn"
          className="availability-calendar"
          defaultFocusedValue={today(getLocalTimeZone())}
          firstDayOfWeek="mon"
          isDateUnavailable={(date) => blocked.has(date.toString())}
          onChange={selectDate}
          value={selectedDate}
        >
          <div className="availability-calendar__toolbar">
            <Button slot="previous" aria-label="Fyrri mánuður">←</Button>
            <CalendarHeading />
            <Button slot="next" aria-label="Næsti mánuður">→</Button>
          </div>
          <CalendarGrid weekdayStyle="short">
            <CalendarGridHeader>
              {(day) => <CalendarHeaderCell>{day}</CalendarHeaderCell>}
            </CalendarGridHeader>
            <CalendarGridBody>
              {(date) => (
                <CalendarCell date={date}>
                  {({ formattedDate }) => <span>{formattedDate}</span>}
                </CalendarCell>
              )}
            </CalendarGridBody>
          </CalendarGrid>
        </Calendar>
      </I18nProvider>

      <div className="availability-widget__footer">
        <div className="availability-legend" aria-label="Skýringar">
          <span><i className="availability-legend__swatch availability-legend__swatch--open"></i> Laus</span>
          <span><i className="availability-legend__swatch availability-legend__swatch--blocked"></i> Ekki laus</span>
        </div>
        {selectedDate && <p>Komudagur valinn: <strong>{selectedDate.toString()}</strong></p>}
        {updatedAt && <small>Síðast samstillt {updatedAt.toLocaleString('is-IS')}</small>}
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
