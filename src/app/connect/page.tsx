import Link from 'next/link';
import ContactForm from '../../components/ContactForm';
import BookingEmbed from '../../components/BookingEmbed';

export default function Connect() {
    return (
        <div className="w-full max-w-5xl mx-auto px-4 py-12">
            {/* Top — the closing statement, bookending Home's intro */}
            <section className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Let&apos;s Build Something</h2>
                {/* Placeholder — replace with your actual availability. */}
                <p className="opacity-80">
                    Currently open to freelance and collaborative work in data engineering and applied AI.
                </p>
            </section>

            {/* Side-by-side Section */}
            <div className="flex flex-col md:flex-row gap-6 items-start">
                {/* Left Column - Form */}
                <div className="glass flex-1 w-full rounded-4xl p-6 md:p-8 text-left relative">
                    <ContactForm />
                </div>

                {/* Right Column - Contact Info, then what I can help with, then booking */}
                <div className="glass flex-1 w-full rounded-4xl p-6 md:p-8 text-left flex flex-col gap-8">
                    <div>
                        <h3 className="text-xl font-semibold mb-3">Contact Info</h3>
                        <p className="mb-1">Email: contact@aarondavis.cloud</p>
                    </div>
                    <div>
                        {/* Placeholder — replace with your actual freelance offering. */}
                        <h3 className="text-xl font-semibold mb-3">What I Can Help With</h3>
                        <p className="mb-1 opacity-80">
                            Open to freelance and collaborative work in data engineering and
                            applied AI — pipeline design, RAG systems, and integrating AI
                            into existing data infrastructure.
                        </p>
                    </div>
                    <div>
                        <h3 className="text-xl font-semibold mb-3">Book a Call</h3>
                        <BookingEmbed />
                    </div>
                </div>
            </div>

            {/* Bottom — recap links back into the body of the site, and a resume */}
            <section className="glass mt-16 rounded-4xl px-6 py-6 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
                <span className="text-sm opacity-70">Haven&apos;t seen my work yet?</span>
                <Link href="/research" className="text-sm font-semibold uppercase tracking-wider underline">
                    Research
                </Link>
                <Link href="/writings" className="text-sm font-semibold uppercase tracking-wider underline">
                    Writings
                </Link>
            </section>
        </div>
    );
}
