'use client';

import { useState, FormEvent } from 'react';
import { CONTACT_LIMITS } from '../lib/contact';

type Status = 'idle' | 'submitting' | 'success' | 'error';

const ContactForm = () => {
    const [status, setStatus] = useState<Status>('idle');
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setStatus('submitting');
        setErrorMessage('');

        const form = event.currentTarget;
        const data = Object.fromEntries(new FormData(form));

        try {
            const res = await fetch('/api/connect', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (!res.ok) {
                const body = await res.json().catch(() => ({}));
                throw new Error(body.error ?? 'Something went wrong. Please try again.');
            }

            setStatus('success');
            form.reset();
        } catch (err) {
            setStatus('error');
            setErrorMessage(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
        }
    };

    if (status === 'success') {
        return (
            <div className="flex flex-1 items-center justify-center text-center py-12">
                <p className="opacity-80">Thanks — your message has been sent. I&apos;ll get back to you soon.</p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
            <input
                type="text"
                name="name"
                required
                maxLength={CONTACT_LIMITS.name}
                autoComplete="name"
                placeholder="Let's get acquainted - What's your name?"
                className="p-3 border border-black/10 dark:border-white/15 rounded-3xl"
            />
            <input
                type="email"
                name="email"
                required
                maxLength={CONTACT_LIMITS.email}
                autoComplete="email"
                placeholder="Also your email"
                className="p-3 border border-black/10 dark:border-white/15 rounded-3xl"
            />
            <textarea
                name="message"
                required
                maxLength={CONTACT_LIMITS.message}
                placeholder="Your Message"
                rows={5}
                className="p-3 border border-black/10 dark:border-white/15 rounded-3xl"
            />

            {/* Honeypot — hidden from real visitors via CSS, not display:none
          (which some bots skip filling in), and off-screen rather than
          visually hidden so assistive tech doesn't announce it either. */}
            <div className="absolute left-[9999px]" aria-hidden="true">
                <label htmlFor="company">Company</label>
                <input type="text" id="company" name="company" tabIndex={-1} autoComplete="off" />
            </div>

            {status === 'error' && <p className="text-sm text-red-600 dark:text-red-400">{errorMessage}</p>}

            <button
                type="submit"
                disabled={status === 'submitting'}
                className="glass font-semibold py-2 px-6 rounded-full disabled:opacity-60 disabled:cursor-not-allowed"
            >
                {status === 'submitting' ? 'Sending…' : 'Send Message'}
            </button>
        </form>
    );
};

export default ContactForm;
