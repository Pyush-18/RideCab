import React, { useState } from "react";
import {
  Phone,
  Mail,
  MapPin,
  MessageSquare,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Send,
  Building2,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Cobe } from "../ui/cobe-globe";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [activeTab, setActiveTab] = useState("message");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const contactMethods = [
    {
      icon: Phone,
      title: "Call Us",
      subtitle: "Mon-Sun 24/7 Support",
      action: "+91 86955 66195",
      link: "tel:+918695566195",
      gradient: "from-blue-500/20 to-blue-600/5",
      iconColor: "text-blue-600",
      borderColor: "group-hover:border-blue-200",
    },
    {
      icon: MessageSquare,
      title: "WhatsApp",
      subtitle: "Instant Chat Response",
      action: "Chat Now",
      link: "https://wa.me/918695566195",
      gradient: "from-green-500/20 to-green-600/5",
      iconColor: "text-green-600",
      borderColor: "group-hover:border-green-200",
    },
    {
      icon: Mail,
      title: "Email Us",
      subtitle: "Response within 24h",
      action: "connect@fristcab.com",
      link: "mailto:connect@fristcab.com",
      gradient: "from-orange-500/20 to-orange-600/5",
      iconColor: "text-orange-600",
      borderColor: "group-hover:border-orange-200",
    },
    {
      icon: MapPin,
      title: "Visit HQ",
      subtitle: "Kharagpur, West Bengal",
      action: "View on Maps",
      link: "#",
      gradient: "from-purple-500/20 to-purple-600/5",
      iconColor: "text-purple-600",
      borderColor: "group-hover:border-purple-200",
    },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/api/contact/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          type: activeTab,
        }),
      });

      if (response.ok) {
        setSubmitted(true);
        setTimeout(() => {
          setSubmitted(false);
          setFormData({ name: "", email: "", phone: "", message: "" });
        }, 3000);
      } else {
        alert("Failed to send. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to send. Please try again.");
    }
  };

  return (
    <div className="relative min-h-screen bg-slate-50 selection:bg-orange-500/20 selection:text-orange-700 overflow-hidden font-sans">
      <div className="absolute inset-0 w-full h-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[24px_24px] pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-96 bg-linear-to-b from-white to-transparent pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-24">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-slate-200 shadow-sm mb-8"
          >
            <Sparkles className="w-3.5 h-3.5 text-orange-500 fill-orange-500" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
              24/7 Premium Support
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-slate-900 mb-6"
          >
            Let's Start a <br />
            <span className="relative inline-block text-transparent bg-clip-text bg-linear-to-r from-orange-600 to-amber-500">
              Conversation
              <svg
                className="absolute w-full h-3 -bottom-1 left-0 text-orange-400 opacity-40"
                viewBox="0 0 200 9"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M2.00025 6.99997C25.0003 3.50002 81.5003 -1.49998 198.001 3.49998"
                  stroke="currentColor"
                  strokeWidth="3"
                ></path>
              </svg>
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed"
          >
            Whether you have a question about our rides, pricing, or partnership
            opportunities, our team is ready to answer all your questions.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {contactMethods.map((method, idx) => (
            <motion.a
              key={idx}
              href={method.link}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * idx }}
              className={`group relative p-6 bg-white rounded-2xl border border-slate-100 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] hover:shadow-[0_10px_30px_-15px_rgba(0,0,0,0.1)] transition-all duration-300 overflow-hidden ${method.borderColor}`}
            >
              <div
                className={`absolute top-0 right-0 w-32 h-32 bg-linear-to-br ${method.gradient} rounded-bl-full opacity-50 transition-transform group-hover:scale-110`}
              />

              <div className="relative z-10">
                <div
                  className={`w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center mb-4 group-hover:bg-white group-hover:shadow-sm transition-all`}
                >
                  <method.icon className={`w-6 h-6 ${method.iconColor}`} />
                </div>

                <h3 className="font-bold text-slate-900 text-lg">
                  {method.title}
                </h3>
                <p className="text-slate-500 text-sm mb-4">{method.subtitle}</p>

                <div className="flex items-center text-sm font-semibold text-slate-700 group-hover:text-orange-600 transition-colors">
                  {method.action}
                  <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </motion.a>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-7"
          >
            <div className="h-full bg-white rounded-3xl border border-slate-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6 sm:p-10 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-orange-400 to-amber-400" />

              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">
                    Get in Touch
                  </h2>
                  <p className="text-slate-500 text-sm mt-1">
                    We typically reply within 2 hours.
                  </p>
                </div>

                <div className="flex p-1 bg-slate-100/80 rounded-xl w-full sm:w-auto">
                  {["message", "partnership"].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        activeTab === tab
                          ? "bg-white text-slate-900 shadow-sm ring-1 ring-slate-200"
                          : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
                      }`}
                    >
                      {tab === "message" ? (
                        <Send className="w-3.5 h-3.5" />
                      ) : (
                        <Building2 className="w-3.5 h-3.5" />
                      )}
                      {tab === "message" ? "Message" : "Partner"}
                    </button>
                  ))}
                </div>
              </div>

              <AnimatePresence mode="wait">
                {!submitted ? (
                  <motion.form
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-5"
                    onSubmit={handleSubmit}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="space-y-1.5">
                        <Label
                          htmlFor="name"
                          className="text-xs font-semibold uppercase text-slate-500 ml-1"
                        >
                          {activeTab === "partnership"
                            ? "Company Name"
                            : "Full Name"}
                        </Label>
                        <Input
                          id="name"
                          placeholder={
                            activeTab === "partnership"
                              ? "e.g. Acme Corp"
                              : "e.g. John Doe"
                          }
                          className="h-12 bg-slate-50 border-slate-200 focus:bg-white focus:border-orange-500 focus:ring-orange-500/20 rounded-xl transition-all"
                          value={formData.name}
                          onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                          }
                          required
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label
                          htmlFor="phone"
                          className="text-xs font-semibold uppercase text-slate-500 ml-1"
                        >
                          Phone Number
                        </Label>
                        <Input
                          id="phone"
                          placeholder="+91 98765 43210"
                          className="h-12 bg-slate-50 border-slate-200 focus:bg-white focus:border-orange-500 focus:ring-orange-500/20 rounded-xl transition-all"
                          value={formData.phone}
                          onChange={(e) =>
                            setFormData({ ...formData, phone: e.target.value })
                          }
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <Label
                        htmlFor="email"
                        className="text-xs font-semibold uppercase text-slate-500 ml-1"
                      >
                        Email Address
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="john@example.com"
                        className="h-12 bg-slate-50 border-slate-200 focus:bg-white focus:border-orange-500 focus:ring-orange-500/20 rounded-xl transition-all"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        required
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label
                        htmlFor="message"
                        className="text-xs font-semibold uppercase text-slate-500 ml-1"
                      >
                        {activeTab === "partnership"
                          ? "Partnership Proposal"
                          : "Your Message"}
                      </Label>
                      <Textarea
                        id="message"
                        placeholder={
                          activeTab === "partnership"
                            ? "Tell us about your business..."
                            : "How can we help you today?"
                        }
                        rows={5}
                        className="bg-slate-50 border-slate-200 focus:bg-white focus:border-orange-500 focus:ring-orange-500/20 rounded-xl resize-none transition-all p-4"
                        value={formData.message}
                        onChange={(e) =>
                          setFormData({ ...formData, message: e.target.value })
                        }
                        required
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full h-12 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-xl transition-all duration-300 shadow-lg shadow-slate-900/20 hover:shadow-xl hover:shadow-slate-900/10 active:scale-[0.99]"
                    >
                      {isSubmitting ? (
                        <span className="flex items-center gap-2">
                          <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Sending...
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          {activeTab === "partnership"
                            ? "Submit Proposal"
                            : "Send Message"}
                          <ArrowRight className="w-4 h-4" />
                        </span>
                      )}
                    </Button>
                  </motion.form>
                ) : (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center py-16 text-center"
                  >
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6 animate-pulse">
                      <CheckCircle2 className="w-10 h-10 text-green-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">
                      Message Sent Successfully!
                    </h3>
                    <p className="text-slate-500 max-w-xs mx-auto">
                      Thank you for reaching out. A member of our team will
                      contact you shortly at {formData.email}.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Globe/Map Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="lg:col-span-5 relative"
          >
            <div className="relative w-full h-full min-h-100 lg:min-h-auto rounded-3xl overflow-hidden bg-[#0b1220] border border-slate-800 shadow-2xl">
              {/* Decorative Gradients for Globe */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-orange-500/20 rounded-full blur-3xl -ml-16 -mb-16 pointer-events-none" />

              <Cobe
                variant="default"
                phi={0}
                theta={0.25}
                mapSamples={12000}
                mapBrightness={8}
                mapBaseBrightness={0.05}
                diffuse={1.2}
                dark={1}
                baseColor="#0b1220"
                glowColor="#4f46e5"
                markerColor="#f97316"
                markerSize={0.08}
                scale={1.1}
                opacity={0.8}
                className="w-full h-full"
              />

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                className="absolute bottom-6 left-6 right-6"
              >
                <div className="bg-white/10 backdrop-blur-md border border-white/10 p-4 rounded-2xl flex items-center gap-4 shadow-lg">
                  <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center shrink-0 shadow-lg shadow-orange-500/30">
                    <MapPin className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-slate-200 text-xs font-medium uppercase tracking-wider mb-0.5">
                      Headquarters
                    </p>
                    <p className="text-white font-semibold truncate">
                      Kharagpur, West Bengal, India
                    </p>
                  </div>
                  <div className="hidden sm:block px-3 py-1 rounded-full bg-green-500/20 border border-green-500/30">
                    <span className="flex items-center gap-1.5 text-xs font-medium text-green-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                      Open Now
                    </span>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
