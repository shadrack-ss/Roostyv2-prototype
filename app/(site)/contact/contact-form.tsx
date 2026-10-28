'use client';

import { useActionState } from 'react';
import { sendContactMessage, type ContactState } from '@/lib/public-actions';

type Props = { buttonLabel: string; successTitle: string; successText: string };

export default function ContactForm({ buttonLabel, successTitle, successText }: Props) {
  const [state, action, pending] = useActionState<ContactState, FormData>(sendContactMessage, {});

  if (state.sent) {
    return (
      <div className="p-5 bg-white">
        <h3 className="h5 text-black mb-3">{successTitle}</h3>
        <p className="mb-0">{successText}</p>
      </div>
    );
  }

  return (
    <form action={action} className="p-5 bg-white">
      {/* Honeypot for bots: hidden from people and screen readers. */}
      <div aria-hidden="true" style={{ position: 'absolute', left: '-10000px', width: 1, height: 1, overflow: 'hidden' }}>
        <label htmlFor="website">Leave this empty</label>
        <input type="text" id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="row form-group">
        <div className="col-md-12 mb-3 mb-md-0">
          <label className="font-weight-bold" htmlFor="name">Full Name</label>
          <input type="text" id="name" name="name" required maxLength={120} className="form-control" placeholder="Full Name" />
        </div>
      </div>
      <div className="row form-group">
        <div className="col-md-12">
          <label className="font-weight-bold" htmlFor="email">Email</label>
          <input type="email" id="email" name="email" required className="form-control" placeholder="Email Address" />
        </div>
      </div>
      <div className="row form-group">
        <div className="col-md-12 mb-3 mb-md-0">
          <label className="font-weight-bold" htmlFor="subject">Subject</label>
          <input type="text" id="subject" name="subject" maxLength={200} className="form-control" placeholder="What is it about?" />
        </div>
      </div>
      <div className="row form-group">
        <div className="col-md-12">
          <label className="font-weight-bold" htmlFor="message">Message</label>
          <textarea name="message" id="message" required cols={30} rows={5} className="form-control" placeholder="Say hello to us"></textarea>
        </div>
      </div>

      {state.error && <p className="text-danger">{state.error}</p>}

      <div className="row form-group">
        <div className="col-md-12">
          <input type="submit" value={pending ? 'Sending...' : buttonLabel} disabled={pending} className="btn btn-primary pill px-4 py-2" />
        </div>
      </div>
    </form>
  );
}
