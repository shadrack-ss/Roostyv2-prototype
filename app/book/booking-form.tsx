'use client';

import { useState, useEffect, useMemo, useRef, FormEvent } from 'react';
import { ROOMS, formatUGX } from '../rooms/rooms-data';

// --- date helpers -----------------------------------------------------------
// All dates are handled as local-midnight Date objects and YYYY-MM-DD strings.
// Deliberately NOT toISOString(): that converts to UTC first, which rolls the
// date back a day for anyone east of Greenwich -- Uganda is UTC+3, so every
// date a guest picked would land one day early.
function toISO(d: Date): string {
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${m}-${day}`;
}

function fromISO(s: string): Date {
  const [y, m, d] = s.split('-').map(Number);
  return new Date(y, m - 1, d);
}

// Fixed labels rather than toLocaleString, so the server and client render
// identical markup regardless of the locale each is running under.
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'];
const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

// Cells for one month: leading blanks to line the 1st up under its weekday,
// then one entry per day.
function buildMonth(year: number, month: number): (Date | null)[] {
  const lead = new Date(year, month, 1).getDay();
  const days = new Date(year, month + 1, 0).getDate();
  const cells: (Date | null)[] = Array(lead).fill(null);
  for (let d = 1; d <= days; d++) cells.push(new Date(year, month, d));
  return cells;
}

type MonthGridProps = {
  year: number;
  month: number;
  checkIn: string;
  checkOut: string;
  todayISO: string;
  onPick: (iso: string) => void;
};

function MonthGrid({ year, month, checkIn, checkOut, todayISO, onPick }: MonthGridProps) {
  return (
    <div className="bk-month">
      <div className="bk-month-name">{MONTHS[month]} {year}</div>
      <div className="bk-grid">
        {WEEKDAYS.map((w) => <span key={w} className="bk-dow">{w}</span>)}
        {buildMonth(year, month).map((date, i) => {
          if (!date) return <span key={`blank-${i}`} className="bk-cell bk-blank" />;
          const iso = toISO(date);
          const past = iso < todayISO;
          const isStart = iso === checkIn;
          const isEnd = iso === checkOut;
          const between = !!checkIn && !!checkOut && iso > checkIn && iso < checkOut;
          const cls = [
            'bk-cell',
            past ? 'bk-past' : '',
            isStart || isEnd ? 'bk-sel' : '',
            between ? 'bk-between' : '',
          ].filter(Boolean).join(' ');
          return (
            <button
              key={iso}
              type="button"
              className={cls}
              disabled={past}
              aria-label={`${date.getDate()} ${MONTHS[month]} ${year}`}
              aria-pressed={isStart || isEnd}
              onClick={() => onPick(iso)}
            >
              {date.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// --- form -------------------------------------------------------------------
type FormState = {
  fullName: string;
  email: string;
  phone: string;
  checkIn: string;
  checkOut: string;
  adults: string;
  children: string;
  roomSlug: string;
  message: string;
};

const INITIAL_STATE: FormState = {
  fullName: '',
  email: '',
  phone: '',
  checkIn: '',
  checkOut: '',
  adults: '1',
  children: '0',
  roomSlug: ROOMS[0].slug,
  message: '',
};

type FormErrors = Partial<Record<keyof FormState, string>>;

function validate(values: FormState): FormErrors {
  const errors: FormErrors = {};
  if (!values.fullName.trim()) errors.fullName = 'Please enter your full name.';
  if (!values.email.trim()) {
    errors.email = 'Please enter your email address.';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    errors.email = 'That email address doesn’t look right.';
  }
  if (!values.phone.trim()) errors.phone = 'Please enter a phone number.';
  if (!values.checkIn) errors.checkIn = 'Pick a check-in date.';
  if (!values.checkOut) errors.checkOut = 'Pick a check-out date.';
  if (values.checkIn && values.checkOut && values.checkOut <= values.checkIn) {
    errors.checkOut = 'Check-out must be after check-in.';
  }
  return errors;
}

export default function BookingForm() {
  const [values, setValues] = useState<FormState>(INITIAL_STATE);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState<FormState | null>(null);

  // "Today" and the visible month depend on the clock, which differs between
  // the server render and the browser. Resolving them after mount keeps the two
  // renders identical; before that the calendar simply is not drawn.
  const [todayISO, setTodayISO] = useState('');
  const [view, setView] = useState<{ y: number; m: number } | null>(null);
  const [confirming, setConfirming] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);

  // set-state-in-effect is disabled below deliberately. The rule is right in
  // general, but resolving "now" is the case it does not cover: a lazy useState
  // initialiser would run during SSR too, and a server in UTC rendering a
  // different calendar day from a browser in UTC+3 is a hydration mismatch.
  // Deferring to mount makes the server and first client render identical (no
  // calendar), then draws it once. Empty dependency array, so no cascade.
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    const now = new Date();
    setTodayISO(toISO(now));
    setView({ y: now.getFullYear(), m: now.getMonth() });
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  // Escape to dismiss, and the page behind is frozen so scrolling the dialog
  // does not scroll the form underneath it once the dialog runs out of content.
  useEffect(() => {
    if (!confirming) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setConfirming(false);
    };
    document.addEventListener('keydown', onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [confirming]);

  // Move focus into the dialog when it opens, otherwise keyboard and screen
  // reader users are left behind on the form they can no longer see.
  useEffect(() => {
    if (confirming) dialogRef.current?.focus();
  }, [confirming]);

  const room = ROOMS.find((r) => r.slug === values.roomSlug) ?? ROOMS[0];

  const nights = useMemo(() => {
    if (!values.checkIn || !values.checkOut) return 0;
    const diff = fromISO(values.checkOut).getTime() - fromISO(values.checkIn).getTime();
    return Math.max(0, Math.round(diff / 86400000));
  }, [values.checkIn, values.checkOut]);

  const estimate = nights * room.price;

  function set<K extends keyof FormState>(field: K, value: FormState[K]) {
    setValues((prev) => ({ ...prev, [field]: value }));
  }

  // One click sets check-in; the next sets check-out. Clicking a date on or
  // before the current check-in, or clicking once a full range exists, starts
  // over -- otherwise the range can only ever be widened.
  function pickDate(iso: string) {
    setValues((prev) => {
      if (!prev.checkIn || prev.checkOut || iso <= prev.checkIn) {
        return { ...prev, checkIn: iso, checkOut: '' };
      }
      return { ...prev, checkOut: iso };
    });
  }

  // Going through Date rather than incrementing m directly so December -> January
  // rolls the year over on its own.
  function stepMonth(delta: number) {
    setView((v) => {
      if (!v) return v;
      const d = new Date(v.y, v.m + delta, 1);
      return { y: d.getFullYear(), m: d.getMonth() };
    });
  }

  // Nothing before the current month is bookable, so there is nowhere to go back to.
  const atFirstMonth = useMemo(() => {
    if (!view || !todayISO) return true;
    const t = fromISO(todayISO);
    return view.y === t.getFullYear() && view.m === t.getMonth();
  }, [view, todayISO]);

  // Submitting no longer completes the request -- it opens the confirmation
  // dialog. Nothing is finalised until confirm() runs, so a mistyped date or a
  // wrong room can still be corrected at that point.
  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const nextErrors = validate(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;
    setConfirming(true);
  }

  function confirm() {
    setConfirming(false);
    setSubmitted(values);
    setValues(INITIAL_STATE);
  }

  if (submitted) {
    const booked = ROOMS.find((r) => r.slug === submitted.roomSlug) ?? ROOMS[0];
    const n = Math.max(
      0,
      Math.round((fromISO(submitted.checkOut).getTime() - fromISO(submitted.checkIn).getTime()) / 86400000)
    );
    return (
      <div className="p-5 bg-white">
        <h3 className="h5 text-black mb-3">Request Received</h3>
        <p>
          Thanks, {submitted.fullName.split(' ')[0]}. We don&apos;t have a live booking system
          connected yet, so this request hasn&apos;t been sent anywhere. Call or WhatsApp{' '}
          <a href="tel:+256707113630">+256 707 113630</a> with the details below and we&apos;ll
          confirm your room directly.
        </p>
        <ul className="list-unstyled mb-4">
          <li><strong>Room:</strong> {booked.name}</li>
          <li><strong>Rate:</strong> {formatUGX(booked.price)} per night</li>
          <li><strong>Check-in:</strong> {submitted.checkIn}</li>
          <li><strong>Check-out:</strong> {submitted.checkOut}</li>
          <li><strong>Nights:</strong> {n}</li>
          <li><strong>Guests:</strong> {submitted.adults} adult(s), {submitted.children} child(ren)</li>
          <li><strong>Estimated total:</strong> {formatUGX(n * booked.price)}</li>
        </ul>
        <button
          type="button"
          className="btn btn-primary pill px-4 py-2"
          onClick={() => setSubmitted(null)}
        >
          Book Another Stay
        </button>
      </div>
    );
  }

  return (
    <>
    <form className="bk-form p-5 bg-white" onSubmit={handleSubmit} noValidate>
      <style href="booking-form" precedence="theme">{`
        /* Inline calendar at every width. The native date inputs that used to
           back this up below 768px are gone: they sat in a .row with .col-6,
           and this build's Bootstrap is a purged file that ships no .col-6 at
           all -- so the columns lost their 15px padding while the row kept its
           -15px margin, and the date fields hung 15px left of every other
           field on the form. One control at all widths also means one code
           path to reason about.
           (No backticks anywhere in this block -- it is a JS template literal.) */
        .bk-cal { display:block; }

        /* p-5 is 3rem, so 96px of the viewport goes to padding before any
           content is drawn. On a 375px phone that left the calendar 249px to
           split seven ways -- 34px cells, well under the ~44px a fingertip
           needs. Pulling the padding back to 1.5rem below 576px gets the cells
           to roughly 41px and gives every other field on the form more room
           too. !important because .p-5 is a Bootstrap utility and carries it. */
        @media (max-width:575.98px) {
          .bk-form.p-5 { padding:1.5rem !important; }
          .bk-grid { gap:1px; }
          .bk-cal-head { font-size:12px; }
        }
        /* 320px-class devices cannot reach a 44px cell no matter what -- seven
           columns simply do not fit -- so claw back what is available and
           accept ~36px there. */
        @media (max-width:360px) {
          .bk-form.p-5 { padding:1rem !important; }
          .bk-cell { font-size:13px; }
        }

        .bk-cal-head { display:flex; align-items:center; justify-content:space-between; gap:10px; margin-bottom:14px; }
        .bk-cal-nav {
          width:34px; height:34px; line-height:1; border:1px solid #dfe3e8; background:#fff;
          border-radius:50%; cursor:pointer; color:#13482c; font-size:16px;
        }
        .bk-cal-nav:hover:not(:disabled) { background:#13482c; border-color:#13482c; color:#fff; }
        .bk-cal-nav:disabled { opacity:.35; cursor:not-allowed; }
        .bk-cal-hint { font-size:13px; color:#8a919c; text-align:center; min-width:0; }
        .bk-clear {
          background:none; border:none; padding:0; margin-top:8px;
          color:#13482c; font-size:13px; text-decoration:underline; cursor:pointer;
        }

        .bk-months { display:flex; gap:28px; }
        .bk-month { flex:1 1 0; min-width:0; }
        /* Second month only once there is genuinely room for it. */
        .bk-month + .bk-month { display:none; }
        @media (min-width:992px) { .bk-month + .bk-month { display:block; } }

        .bk-month-name { font-weight:600; font-size:15px; margin-bottom:10px; text-align:center; color:#1f1f1f; }
        .bk-grid { display:grid; grid-template-columns:repeat(7,1fr); gap:2px; }
        .bk-dow { text-align:center; font-size:12px; color:#8a919c; padding:4px 0; }
        .bk-cell {
          aspect-ratio:1 / 1; display:flex; align-items:center; justify-content:center;
          border:none; background:none; padding:0; font-size:14px; color:#1f1f1f;
          border-radius:4px; cursor:pointer;
        }
        .bk-blank { cursor:default; }
        .bk-cell:hover:not(:disabled):not(.bk-sel) { background:#eef4ef; }
        .bk-past { color:#c8ccd2; cursor:not-allowed; text-decoration:line-through; }
        .bk-between { background:#eef4ef; border-radius:0; }
        .bk-sel { background:#13482c; color:#fff; font-weight:600; }

        /* Rate summary */
        .bk-rate { background:#f7f9fb; border-left:3px solid #c99e54; border-radius:4px; padding:16px 18px; }
        .bk-rate-line { display:flex; justify-content:space-between; gap:16px; font-size:15px; margin-bottom:6px; color:#4d4d4d; }
        .bk-rate-total { display:flex; justify-content:space-between; gap:16px; font-size:17px; font-weight:600; color:#1f1f1f; border-top:1px solid #e3e8ec; padding-top:10px; margin-top:10px; }
        .bk-rate-note { font-size:12px; line-height:18px; color:#8a919c; margin:10px 0 0; }

        /* Confirmation dialog. Rendered as a sibling of the form, not inside
           it, so the buttons in here can never be caught by the form's submit
           handling. */
        .bk-overlay {
          position:fixed; top:0; right:0; bottom:0; left:0; z-index:1000;
          display:flex; align-items:center; justify-content:center; padding:20px;
          background:rgba(10,34,22,.55);
          -webkit-backdrop-filter:blur(2px); backdrop-filter:blur(2px);
        }
        .bk-dialog {
          background:#fff; border-radius:6px; width:100%; max-width:540px;
          max-height:88vh; overflow-y:auto; padding:30px; outline:none;
          box-shadow:0 20px 60px rgba(0,0,0,.35);
        }
        .bk-dialog h3 { font-size:22px; margin:0 0 6px; color:#1f1f1f; }
        .bk-dialog-lead { font-size:14px; line-height:21px; color:#636a76; margin:0 0 20px; }
        .bk-dl { margin:0; }
        .bk-dl-row {
          display:flex; justify-content:space-between; gap:18px;
          padding:9px 0; border-bottom:1px solid #eef1f4; font-size:15px;
        }
        .bk-dl-row dt { flex:none; color:#636a76; margin:0; font-weight:400; }
        .bk-dl-row dd { margin:0; text-align:right; color:#1f1f1f; font-weight:500; overflow-wrap:anywhere; }
        .bk-dialog-total {
          display:flex; justify-content:space-between; gap:18px;
          margin-top:16px; padding-top:14px; border-top:2px solid #13482c;
          font-size:18px; font-weight:600; color:#1f1f1f;
        }
        .bk-dialog-actions { display:flex; flex-wrap:wrap; gap:12px; margin-top:26px; }
        .bk-confirm, .bk-edit {
          border-radius:30px; padding:12px 28px; font-size:15px; cursor:pointer;
          transition:background-color .3s ease, color .3s ease, border-color .3s ease;
        }
        .bk-confirm { flex:1 1 auto; background:#13482c; border:1px solid #13482c; color:#fff; font-weight:600; }
        .bk-confirm:hover { background:#0e3520; border-color:#0e3520; }
        .bk-edit { flex:0 0 auto; background:none; border:1px solid #d5dde4; color:#2a303b; }
        .bk-edit:hover { background:#f2f5f7; }
      `}</style>

      <div className="row form-group">
        <div className="col-md-6 mb-3 mb-md-0">
          <label className="font-weight-bold" htmlFor="fullName">Full Name</label>
          <input
            type="text"
            id="fullName"
            className="form-control"
            placeholder="Full Name"
            value={values.fullName}
            onChange={(e) => set('fullName', e.target.value)}
          />
          {errors.fullName && <small className="text-danger">{errors.fullName}</small>}
        </div>
        <div className="col-md-6">
          <label className="font-weight-bold" htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            className="form-control"
            placeholder="Email Address"
            value={values.email}
            onChange={(e) => set('email', e.target.value)}
          />
          {errors.email && <small className="text-danger">{errors.email}</small>}
        </div>
      </div>

      <div className="row form-group">
        <div className="col-md-6 mb-3 mb-md-0">
          <label className="font-weight-bold" htmlFor="phone">Phone</label>
          <input
            type="text"
            id="phone"
            className="form-control"
            placeholder="Phone #"
            value={values.phone}
            onChange={(e) => set('phone', e.target.value)}
          />
          {errors.phone && <small className="text-danger">{errors.phone}</small>}
        </div>
        <div className="col-md-6">
          <label className="font-weight-bold" htmlFor="roomType">Room Type</label>
          {/* Rate is in the option label so the choice can be made on price
              without leaving the page for /rooms. */}
          <select
            id="roomType"
            className="form-control"
            value={values.roomSlug}
            onChange={(e) => set('roomSlug', e.target.value)}
          >
            {ROOMS.map((r) => (
              <option key={r.slug} value={r.slug}>
                {r.name} - {formatUGX(r.price)} / night
              </option>
            ))}
          </select>
          <small className="text-muted">Sleeps up to {room.capacity} &middot; {room.size}</small>
        </div>
      </div>

      <div className="form-group">
        <label className="font-weight-bold">Dates</label>

        {/* Desktop: full inline calendar */}
        <div className="bk-cal">
          {view && (
            <>
              <div className="bk-cal-head">
                <button
                  type="button"
                  className="bk-cal-nav"
                  aria-label="Previous month"
                  disabled={atFirstMonth}
                  onClick={() => stepMonth(-1)}
                >
                  &#8249;
                </button>
                <span className="bk-cal-hint">
                  {!values.checkIn
                    ? 'Select your check-in date'
                    : !values.checkOut
                      ? 'Now select your check-out date'
                      : `${values.checkIn} to ${values.checkOut}`}
                </span>
                <button
                  type="button"
                  className="bk-cal-nav"
                  aria-label="Next month"
                  onClick={() => stepMonth(1)}
                >
                  &#8250;
                </button>
              </div>
              <div className="bk-months">
                <MonthGrid
                  year={view.y}
                  month={view.m}
                  checkIn={values.checkIn}
                  checkOut={values.checkOut}
                  todayISO={todayISO}
                  onPick={pickDate}
                />
                <MonthGrid
                  year={new Date(view.y, view.m + 1, 1).getFullYear()}
                  month={new Date(view.y, view.m + 1, 1).getMonth()}
                  checkIn={values.checkIn}
                  checkOut={values.checkOut}
                  todayISO={todayISO}
                  onPick={pickDate}
                />
              </div>
            </>
          )}
        </div>

        {/* The calendar is now the only way to set dates, so there has to be a
            way back out of a half-made selection. */}
        {values.checkIn && (
          <button
            type="button"
            className="bk-clear"
            onClick={() => setValues((prev) => ({ ...prev, checkIn: '', checkOut: '' }))}
          >
            Clear dates
          </button>
        )}

        {(errors.checkIn || errors.checkOut) && (
          <small className="text-danger d-block mt-2">{errors.checkIn || errors.checkOut}</small>
        )}
      </div>

      <div className="row form-group">
        <div className="col-md-6 mb-3 mb-md-0">
          <label className="font-weight-bold" htmlFor="adults">Adults</label>
          <select id="adults" className="form-control" value={values.adults} onChange={(e) => set('adults', e.target.value)}>
            {['1', '2', '3', '4', '5', '6'].map((n) => <option key={n} value={n}>{n}</option>)}
          </select>
        </div>
        <div className="col-md-6">
          <label className="font-weight-bold" htmlFor="children">Children</label>
          <select id="children" className="form-control" value={values.children} onChange={(e) => set('children', e.target.value)}>
            {['0', '1', '2', '3', '4'].map((n) => <option key={n} value={n}>{n}</option>)}
          </select>
        </div>
      </div>

      <div className="form-group">
        <div className="bk-rate">
          <div className="bk-rate-line">
            <span>{room.name}</span>
            <span>{formatUGX(room.price)} / night</span>
          </div>
          <div className="bk-rate-line">
            <span>Nights</span>
            <span>{nights || '-'}</span>
          </div>
          <div className="bk-rate-total">
            <span>Estimated total</span>
            <span>{nights ? formatUGX(estimate) : '-'}</span>
          </div>
          <p className="bk-rate-note">
            Room rate only, for the dates selected. We confirm the final amount with you when
            we take the booking.
          </p>
        </div>
      </div>

      <div className="row form-group">
        <div className="col-md-12">
          <label className="font-weight-bold" htmlFor="message">Special Requests</label>
          <textarea
            id="message"
            cols={30}
            rows={4}
            className="form-control"
            placeholder="Anything else we should know?"
            value={values.message}
            onChange={(e) => set('message', e.target.value)}
          ></textarea>
        </div>
      </div>

      <div className="row form-group">
        <div className="col-md-12">
          <input type="submit" value="Request to Book" className="btn btn-primary pill px-4 py-2" />
        </div>
      </div>
    </form>

    {confirming && (
      // Clicking the backdrop dismisses, but the click handler is stopped on
      // the dialog itself so a click that starts inside it does not close it.
      <div className="bk-overlay" onClick={() => setConfirming(false)}>
        <div
          className="bk-dialog"
          role="dialog"
          aria-modal="true"
          aria-labelledby="bk-dialog-title"
          tabIndex={-1}
          ref={dialogRef}
          onClick={(e) => e.stopPropagation()}
        >
          <h3 id="bk-dialog-title">Confirm your request</h3>
          <p className="bk-dialog-lead">
            Please check these details before we send them through.
          </p>

          <dl className="bk-dl">
            <div className="bk-dl-row"><dt>Name</dt><dd>{values.fullName}</dd></div>
            <div className="bk-dl-row"><dt>Email</dt><dd>{values.email}</dd></div>
            <div className="bk-dl-row"><dt>Phone</dt><dd>{values.phone}</dd></div>
            <div className="bk-dl-row"><dt>Room</dt><dd>{room.name}</dd></div>
            <div className="bk-dl-row"><dt>Rate</dt><dd>{formatUGX(room.price)} / night</dd></div>
            <div className="bk-dl-row"><dt>Check-in</dt><dd>{values.checkIn}</dd></div>
            <div className="bk-dl-row"><dt>Check-out</dt><dd>{values.checkOut}</dd></div>
            <div className="bk-dl-row"><dt>Nights</dt><dd>{nights}</dd></div>
            <div className="bk-dl-row">
              <dt>Guests</dt>
              <dd>{values.adults} adult{values.adults === '1' ? '' : 's'}, {values.children} child{values.children === '1' ? '' : 'ren'}</dd>
            </div>
            {values.message.trim() && (
              <div className="bk-dl-row"><dt>Requests</dt><dd>{values.message}</dd></div>
            )}
          </dl>

          <div className="bk-dialog-total">
            <span>Estimated total</span>
            <span>{formatUGX(estimate)}</span>
          </div>

          <div className="bk-dialog-actions">
            <button type="button" className="bk-confirm" onClick={confirm}>
              Confirm Request
            </button>
            <button type="button" className="bk-edit" onClick={() => setConfirming(false)}>
              Go Back &amp; Edit
            </button>
          </div>
        </div>
      </div>
    )}
    </>
  );
}
