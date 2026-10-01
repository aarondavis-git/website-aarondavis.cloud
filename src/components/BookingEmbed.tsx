// Server component — NEXT_PUBLIC_* vars are inlined at build time, so this
// needs no client-side JS just to read the URL.
//
// Points at whatever scheduling link you set — Cal.com (self-hostable, the
// natural fit given you're already running your own Postgres) or Calendly
// both just work as an iframe src. Until the env var is set, this renders
// a plain fallback instead of a broken embed.
const BookingEmbed = () => {
  const bookingUrl = process.env.NEXT_PUBLIC_BOOKING_URL;

  if (!bookingUrl) {
    return (
      <p className="text-sm opacity-70">
        Booking calendar not yet configured — set{' '}
        <code className="text-xs">NEXT_PUBLIC_BOOKING_URL</code> to a Cal.com or Calendly
        link to embed a live calendar here.
      </p>
    );
  }

  return (
    <iframe
      src={bookingUrl}
      title="Book a call"
      loading="lazy"
      className="w-full rounded-3xl border border-black/10 dark:border-white/10"
      style={{ height: '450px' }}
    />
  );
};

export default BookingEmbed;
