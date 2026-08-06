'use client';

import { useMemo, useState, FormEvent } from 'react';
import Link from 'next/link';
import { ROOMS, PRICE_MIN, PRICE_MAX, PRICE_STEP, formatUGX } from './rooms-data';

type Filter = {
  min: number;
  max: number;
  guests: number;
};

const ALL: Filter = { min: PRICE_MIN, max: PRICE_MAX, guests: 0 };

export default function RoomsBrowser() {
  // Two separate pieces of state on purpose. `draft` tracks the controls as the
  // guest moves them; `applied` is what the list is actually filtered by, and
  // only catches up when Check Available is pressed. Filtering live as the
  // slider moves would make rooms vanish under the cursor.
  const [min, setMin] = useState(PRICE_MIN);
  const [max, setMax] = useState(PRICE_MAX);
  const [adults, setAdults] = useState('');
  const [children, setChildren] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [applied, setApplied] = useState<Filter>(ALL);
  const [searched, setSearched] = useState(false);
  const [dateError, setDateError] = useState('');

  const guests = (parseInt(adults, 10) || 0) + (parseInt(children, 10) || 0);

  const results = useMemo(
    () =>
      ROOMS.filter(
        (room) =>
          room.price >= applied.min &&
          room.price <= applied.max &&
          (applied.guests === 0 || room.capacity >= applied.guests)
      ),
    [applied]
  );

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (checkIn && checkOut && checkOut <= checkIn) {
      setDateError('Check-out must be after check-in.');
      return;
    }
    setDateError('');
    setApplied({ min, max, guests });
    setSearched(true);
  }

  function handleReset() {
    setMin(PRICE_MIN);
    setMax(PRICE_MAX);
    setAdults('');
    setChildren('');
    setCheckIn('');
    setCheckOut('');
    setApplied(ALL);
    setSearched(false);
    setDateError('');
  }

  const pct = (v: number) => ((v - PRICE_MIN) / (PRICE_MAX - PRICE_MIN)) * 100;

  return (
    <>
      <style href="rooms-filter" precedence="theme">{`
        /* Dual-thumb range built from two stacked native inputs. Native rather
           than a custom drag implementation so it keeps keyboard support and
           screen-reader semantics for free.

           The inputs are transparent and pointer-events:none so clicks fall
           through to whichever thumb is under the cursor; pointer-events is
           re-enabled on the thumbs themselves. Without that the upper input
           would swallow every click meant for the lower one. */
        .rf-range { position:relative; height:34px; }
        .rf-range-track, .rf-range-fill { position:absolute; top:14px; height:5px; border-radius:3px; }
        .rf-range-track { left:0; right:0; background:#e8f1f8; }
        .rf-range-fill { background:#13482c; }
        .rf-range input[type=range] {
          position:absolute; top:6px; left:0; width:100%; height:20px; margin:0;
          background:transparent; pointer-events:none;
          -webkit-appearance:none; appearance:none;
        }
        .rf-range input[type=range]::-webkit-slider-thumb {
          -webkit-appearance:none; appearance:none; pointer-events:auto;
          width:18px; height:18px; border-radius:50%;
          background:#13482c; border:1px solid #13482c; cursor:pointer;
        }
        .rf-range input[type=range]::-moz-range-thumb {
          pointer-events:auto; width:18px; height:18px; border-radius:50%;
          background:#13482c; border:1px solid #13482c; cursor:pointer;
        }
        .rf-range input[type=range]:focus-visible::-webkit-slider-thumb { outline:2px solid #c99e54; outline-offset:2px; }
        .rf-range input[type=range]:focus-visible::-moz-range-thumb { outline:2px solid #c99e54; outline-offset:2px; }

        /* Results bar. Previously this was a single run-on sentence with the
           reset as an inline underlined link, sitting 30px above the first room
           photo -- which read as a stray caption belonging to that photo rather
           than as a summary of the whole list.

           Now it is a distinct object: its own tinted panel, a brand-green rule
           down the left edge to mark it as UI rather than content, the count
           and the criteria on separate lines so neither has to be scanned out
           of a sentence, and the reset pulled out as a real button on the
           right. The 45px below is what actually buys it clear air from the
           first card. */
        .rf-summary {
          display:flex; align-items:center; justify-content:space-between;
          flex-wrap:wrap; gap:14px 20px;
          padding:18px 22px; margin:0 0 45px;
          background:#f7f9fb; border-left:3px solid #13482c; border-radius:4px;
        }
        /* NOTE on the .roberto-scope prefixes throughout this block: the page
           sets a rule on .roberto-scope p (font-size 16px, margin 0), which is
           specificity 0,1,1 and therefore BEATS a bare single-class selector
           such as .rf-note at 0,1,0. Every rule here that targets a paragraph
           has to carry the scope class to outrank it -- without that the font
           sizes and margins below are silently dropped.
           (No backticks in this block: it is a JS template literal.) */
        .roberto-scope .rf-summary-count { font-size:17px; font-weight:500; color:#2a303b; margin:0 0 5px; }
        .roberto-scope .rf-summary-count strong { color:#13482c; }
        .roberto-scope .rf-summary-criteria { font-size:14px; line-height:1.5; color:#636a76; margin:0; }

        .rf-empty { padding:40px 30px; background:#f7f9fb; border-radius:4px; text-align:center; }
        .rf-empty h4 { font-size:20px; margin:0 0 10px; }
        .roberto-scope .rf-empty p { margin:0 0 20px; }

        .rf-reset {
          flex:none; background:none; border:1px solid #d5dde4; border-radius:30px;
          padding:9px 20px; color:#2a303b; font-size:14px; cursor:pointer;
          transition:background-color .3s ease, border-color .3s ease, color .3s ease;
        }
        .rf-reset:hover { background:#13482c; border-color:#13482c; color:#fff; }
        .rf-error { display:block; color:#f23a2e; font-size:14px; margin-top:8px; }
        /* 22px, and scoped so it actually applies (see the specificity note
           above -- at 14px unscoped this collapsed to margin:0 and the note sat
           flush against the button). */
        .roberto-scope .rf-note { font-size:13px; line-height:20px; color:#8a919c; margin:22px 0 0; }
      `}</style>

      <div className="row">
        <div className="col-12 col-lg-8">
          {searched && (
            <div className="rf-summary">
              <div>
                <p className="rf-summary-count">
                  {results.length === 0 ? (
                    'No rooms match'
                  ) : (
                    <>
                      Showing <strong>{results.length}</strong> of {ROOMS.length} rooms
                    </>
                  )}
                </p>
                <p className="rf-summary-criteria">
                  {formatUGX(applied.min)} - {formatUGX(applied.max)} per night
                  {applied.guests > 0 && (
                    <> &middot; {applied.guests} guest{applied.guests === 1 ? '' : 's'}</>
                  )}
                </p>
              </div>
              <button type="button" className="rf-reset" onClick={handleReset}>
                Clear filters
              </button>
            </div>
          )}

          {results.length === 0 ? (
            <div className="rf-empty mb-100">
              <h4>Nothing in that range</h4>
              <p>Our rooms run from {formatUGX(200000)} to {formatUGX(360000)} per night. Try widening the price range or lowering the guest count.</p>
              <button type="button" className="btn roberto-btn" onClick={handleReset}>Show All Rooms</button>
            </div>
          ) : (
            results.map((room) => (
              <div className="single-room-area mb-50" key={room.slug}>
                <div className="room-thumbnail">
                  <img src={`/roosty-photos/${room.img}`} alt={room.name} loading="lazy" decoding="async" />
                </div>
                <div className="room-content">
                  <h2>{room.name}</h2>
                  <h4>{formatUGX(room.price)} <span>/ night</span></h4>
                  <div className="room-feature">
                    <h6>Size: <span>{room.size}</span></h6>
                    <h6>Capacity: <span>{room.capacity} guests</span></h6>
                  </div>
                  <Link href="/book" className="btn view-detail-btn">
                    Book This Room <i className="fa fa-long-arrow-right" aria-hidden="true"></i>
                  </Link>
                </div>
              </div>
            ))
          )}
          <div className="mb-100" />
        </div>

        <div className="col-12 col-lg-4">
          <div className="hotel-reservation--area mb-100">
            <form onSubmit={handleSubmit}>
              <div className="form-group mb-30">
                <label htmlFor="checkInDate">Date</label>
                <div className="row no-gutters">
                  <div className="col-6">
                    <input
                      type="date"
                      className="form-control"
                      id="checkInDate"
                      aria-label="Check in"
                      value={checkIn}
                      onChange={(e) => setCheckIn(e.target.value)}
                    />
                  </div>
                  <div className="col-6">
                    <input
                      type="date"
                      className="form-control"
                      aria-label="Check out"
                      value={checkOut}
                      onChange={(e) => setCheckOut(e.target.value)}
                    />
                  </div>
                </div>
                {dateError && <span className="rf-error">{dateError}</span>}
              </div>

              <div className="form-group mb-30">
                <label htmlFor="guests">Guests</label>
                <div className="row">
                  <div className="col-6">
                    <select id="guests" className="form-control" value={adults} onChange={(e) => setAdults(e.target.value)}>
                      <option value="">Adults</option>
                      {['1', '2', '3', '4', '5', '6'].map((n) => <option key={n} value={n}>{n}</option>)}
                    </select>
                  </div>
                  <div className="col-6">
                    <select id="children" className="form-control" value={children} onChange={(e) => setChildren(e.target.value)}>
                      <option value="">Children</option>
                      {['1', '2', '3', '4'].map((n) => <option key={n} value={n}>{n}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              <div className="form-group mb-50">
                <div className="range-price">
                  Price per night: {formatUGX(min)} - {formatUGX(max)}
                </div>
                <div className="rf-range">
                  <div className="rf-range-track" />
                  <div
                    className="rf-range-fill"
                    style={{ left: `${pct(min)}%`, width: `${pct(max) - pct(min)}%` }}
                  />
                  {/* Each handle is clamped against the other so they can never
                      cross and invert the range. */}
                  <input
                    type="range"
                    min={PRICE_MIN}
                    max={PRICE_MAX}
                    step={PRICE_STEP}
                    value={min}
                    aria-label="Minimum price per night"
                    onChange={(e) => setMin(Math.min(Number(e.target.value), max))}
                  />
                  <input
                    type="range"
                    min={PRICE_MIN}
                    max={PRICE_MAX}
                    step={PRICE_STEP}
                    value={max}
                    aria-label="Maximum price per night"
                    onChange={(e) => setMax(Math.max(Number(e.target.value), min))}
                  />
                </div>
              </div>

              <div className="form-group">
                <button type="submit" className="btn roberto-btn w-100">Check Available</button>
                <p className="rf-note">
                  Filters our four rooms by price and party size. We confirm dates with you
                  directly - call +256 707 113630 or send a booking request.
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
