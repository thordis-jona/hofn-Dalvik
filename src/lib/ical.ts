export type IcalEvent = {
  start: string;
  end: string;
};

function unfoldIcal(input: string) {
  return input.replace(/\r?\n[ \t]/g, '').split(/\r?\n/);
}

function getPropertyValue(line: string, property: string) {
  const match = line.match(new RegExp(`^${property}(?:;[^:]*)?:(.+)$`));
  return match?.[1]?.trim() ?? null;
}

function toIsoDate(value: string) {
  const date = value.slice(0, 8);
  if (!/^\d{8}$/.test(date)) return null;
  return `${date.slice(0, 4)}-${date.slice(4, 6)}-${date.slice(6, 8)}`;
}

export function parseIcalEvents(input: string): IcalEvent[] {
  const events: IcalEvent[] = [];
  let current: Partial<IcalEvent> | null = null;

  for (const line of unfoldIcal(input)) {
    if (line === 'BEGIN:VEVENT') current = {};
    if (!current) continue;

    const start = getPropertyValue(line, 'DTSTART');
    const end = getPropertyValue(line, 'DTEND');
    if (start) current.start = toIsoDate(start) ?? undefined;
    if (end) current.end = toIsoDate(end) ?? undefined;

    if (line === 'END:VEVENT') {
      if (current.start && current.end) events.push({ start: current.start, end: current.end });
      current = null;
    }
  }

  return events;
}

function addDays(date: string, days: number) {
  const value = new Date(`${date}T00:00:00Z`);
  value.setUTCDate(value.getUTCDate() + days);
  return value.toISOString().slice(0, 10);
}

export function blockedDatesFromEvents(events: IcalEvent[]) {
  const blocked = new Set<string>();

  for (const event of events) {
    let cursor = event.start;
    while (cursor < event.end) {
      blocked.add(cursor);
      cursor = addDays(cursor, 1);
    }
  }

  return [...blocked].sort();
}
