import type { Lang, T } from "./types";

/* ---------------------------------------------------------------------------
   The earliest viewing slot the agency can honestly promise. Lives here rather
   than inside a form because three screens quote it — the listing, the agent
   page and the office block on /contact — and they must all say the same hour.

   It reads the visitor's clock, so it can only be rendered after mount.
   --------------------------------------------------------------------------- */

const WEEKDAY: T[] = [
  { ro: "duminică", ru: "в воскресенье" },
  { ro: "luni", ru: "в понедельник" },
  { ro: "marți", ru: "во вторник" },
  { ro: "miercuri", ru: "в среду" },
  { ro: "joi", ru: "в четверг" },
  { ro: "vineri", ru: "в пятницу" },
  { ro: "sâmbătă", ru: "в субботу" },
];

const TODAY: T = { ro: "azi", ru: "сегодня" };
const TOMORROW: T = { ro: "mâine", ru: "завтра" };

/** Office hours by weekday index, matching AGENCY.schedule: Sunday closed. */
function hours(day: number): [number, number] | null {
  if (day === 0) return null;
  return day === 6 ? [10, 15] : [9, 19];
}

/** Two hours from now, rounded up to the half hour, pushed into open hours. */
export function earliestSlot(now: Date): Date {
  const d = new Date(now.getTime() + 2 * 60 * 60 * 1000);
  d.setSeconds(0, 0);
  const m = d.getMinutes();
  d.setMinutes(m === 0 ? 0 : m <= 30 ? 30 : 60);

  for (let guard = 0; guard < 9; guard += 1) {
    const open = hours(d.getDay());
    if (open) {
      const clock = d.getHours() + d.getMinutes() / 60;
      if (clock < open[0]) {
        d.setHours(open[0], 30, 0, 0);
        return d;
      }
      if (clock <= open[1] - 0.5) return d;
    }
    d.setDate(d.getDate() + 1);
    d.setHours(0, 30, 0, 0);
  }
  return d;
}

/** "cel mai devreme azi la 14:30" / "самое раннее сегодня в 14:30". */
export function slotText(slot: Date, now: Date, lang: Lang): string {
  const days = Math.round(
    (new Date(slot.getFullYear(), slot.getMonth(), slot.getDate()).getTime() -
      new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()) /
      86400000
  );
  const when = days === 0 ? TODAY : days === 1 ? TOMORROW : WEEKDAY[slot.getDay()];
  const time = `${String(slot.getHours()).padStart(2, "0")}:${String(slot.getMinutes()).padStart(2, "0")}`;
  return lang === "ru" ? `самое раннее ${when.ru} в ${time}` : `cel mai devreme ${when.ro} la ${time}`;
}

/** The date in the shape a <input type="date"> min attribute wants. */
export function isoDay(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

/** Everything a form needs in one call: the hint line and the first valid day. */
export function nextViewing(lang: Lang, now: Date = new Date()): { hint: string; iso: string } {
  const slot = earliestSlot(now);
  return { hint: slotText(slot, now, lang), iso: isoDay(slot) };
}
