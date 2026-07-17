import emailjs from "@emailjs/browser";
import { useRef, useState } from "react";

import TitleHeader from "../components/TitleHeader";
import { supabase } from "../supabaseClient";
import { useSiteConfig } from "../context/SiteConfigContext";

const Contact = () => {
  const { config } = useSiteConfig();
  const formRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await Promise.all([
        emailjs.sendForm(
          import.meta.env.VITE_APP_EMAILJS_SERVICE_ID,
          import.meta.env.VITE_APP_EMAILJS_TEMPLATE_ID,
          formRef.current,
          import.meta.env.VITE_APP_EMAILJS_PUBLIC_KEY
        ),
        supabase.from("messages").insert([
          {
            name: form.name,
            email: form.email,
            message: form.message,
          },
        ]),
      ]);

      setForm({ name: "", email: "", message: "" });
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="section-padding max-w-7xl mx-auto">
      <div className="w-full h-full">
        <TitleHeader
          title="Get in Touch"
          sub="Contact"
        />
        <div className="mt-12 flex justify-center">
          <div className="w-full max-w-2xl">
            <div className="card-border rounded-xl p-6 md:p-8">
              <form
                ref={formRef}
                onSubmit={handleSubmit}
                className="w-full flex flex-col gap-5"
              >
                <div>
                  <label htmlFor="name">Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Your name"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="your@email.com"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="message">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Tell me about your project..."
                    rows="5"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-lg text-sm font-medium hover:bg-gray-100 active:scale-[0.98] transition-all duration-200 mt-1"
                  style={{ backgroundColor: config?.accent_color || "#ffffff", color: config?.accent_text_color || "#000000" }}
                >
                  {loading ? "Sending..." : "Send Message"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
