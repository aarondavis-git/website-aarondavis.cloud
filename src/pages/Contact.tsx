
const Contact = () => {
  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-12">
      
      {/* Top Section */}
      <section className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-rose-700 mb-4">
          Let's Start a Conversation
        </h2>
        <p className="text-gray-700 dark:text-gray-300">
          How Can I Help?
        </p>       
      </section>

      {/* Side-by-side Section */}
      <div className="flex flex-col md:flex-row gap-8 text-center">
        
        {/* Left Column - Form */}
        <div className="flex-1 text-center">
          <form className="grid grid-cols-1 gap-6">
            <input
              type="text"
              placeholder="Let's get acquainted - What's your name?"
              className="p-3 border border-gray-300 dark:border-gray-600 rounded bg-white/70 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
            <input
              type="email"
              placeholder="Also your email"
              className="p-3 border border-gray-300 dark:border-gray-600 rounded bg-white/70 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
            <textarea
              placeholder="Your Message"
              rows={5}
              className="p-3 border border-gray-300 dark:border-gray-600 rounded bg-white/70 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
            <button
              type="submit"
              className="bg-rose-700 hover:bg-rose-800 text-white font-semibold py-2 px-6 rounded transition"
            >
              Send Message
            </button>
          </form>
        </div>

        {/* Right Column - Contact Info */}
        <div className="flex-1 text-center">
          <h3 className="text-xl font-semibold text-gradient mb-2">Contact Info</h3>
          <p className="mb-1">Email: contact@aarondavis.cloud</p>
          <p className="mb-1">Location: Lortzingstraße 18, 81241 München</p>
        </div>
      </div>

      {/* Section Below (Optional Extra Info) */}
      <div className="mt-12 text-center">
        <h3 className="text-xl font-semibold text-gradient mb-2">Other Details</h3>
        <p className="mb-1">Feel free to reach out at any time.</p>
      </div>
    </div>
  );
};

export default Contact;