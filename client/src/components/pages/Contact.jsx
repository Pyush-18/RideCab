import React, { useState } from "react";
import {
  Phone,
  Mail,
  MapPin,
  MessageSquare,
  CheckCircle2,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { motion, useMotionValue, useSpring } from "motion/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Cobe } from "../ui/cobe-globe";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const contactMethods = [
    {
      icon: Phone,
      title: "Call Us",
      subtitle: "Mon-Sun 24/7",
      items: [
        { label: "+91 86955 66195", link: "tel:+918695566195" },
        { label: "+91 86955 66194", link: "tel:+918695566194" },
      ],
      color: "bg-blue-500",
      lightColor: "bg-blue-50",
      textColor: "text-blue-600",
    },
    {
      icon: MessageSquare,
      title: "WhatsApp",
      subtitle: "Quick Response",
      items: [{ label: "Chat Now", link: "https://wa.me/918695566195" }],
      color: "bg-green-500",
      lightColor: "bg-green-50",
      textColor: "text-green-600",
    },
    {
      icon: Mail,
      title: "Email Us",
      subtitle: "Response in 24h",
      items: [
        { label: "connect@fristcab.com", link: "mailto:connect@fristcab.com" },
      ],
      color: "bg-orange-500",
      lightColor: "bg-orange-50",
      textColor: "text-orange-600",
    },
    {
      icon: MapPin,
      title: "Visit Office",
      subtitle: "West Bengal",
      items: [{ label: "View on Maps", link: "https://maps.google.com" }],
      color: "bg-purple-500",
      lightColor: "bg-purple-50",
      textColor: "text-purple-600",
    },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: "", email: "", phone: "", message: "" });
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-slate-50 relative mt-10 selection:bg-orange-500/20 selection:text-orange-600">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 shadow-sm mb-6"
          >
            <Sparkles className="w-4 h-4 text-orange-500" />
            <span className="text-sm font-semibold text-slate-700">
              24/7 Premium Support
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-bold tracking-tight text-slate-900 mb-6"
          >
            Let's Start a{" "}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-orange-500 to-amber-500">
              Conversation
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-slate-600 leading-relaxed"
          >
            Have questions about your ride? We are here to help you anywhere in
            West Bengal.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
          {contactMethods.map((method, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * idx }}
              whileHover={{ y: -5 }}
              className="group"
            >
              <Card className="h-full bg-white border border-slate-100 p-6 shadow-sm hover:shadow-xl transition-all duration-300 relative overflow-hidden">
                <div
                  className={`absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 rounded-full opacity-10 transition-transform group-hover:scale-150 ${method.color}`}
                />

                <div
                  className={`w-12 h-12 rounded-xl ${method.lightColor} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                >
                  <method.icon className={`w-6 h-6 ${method.textColor}`} />
                </div>

                <h3 className="font-bold text-slate-900 text-lg mb-1">
                  {method.title}
                </h3>
                <p className="text-slate-500 text-sm mb-4">{method.subtitle}</p>

                <div className="space-y-2">
                  {method.items.map((item, i) => (
                    <a
                      key={i}
                      href={item.link}
                      className="flex items-center text-sm font-medium text-slate-700 hover:text-orange-600 transition-colors"
                    >
                      {item.label}
                      <ArrowRight className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                    </a>
                  ))}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-white border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
              <div className="p-8 md:p-10">
                <div className="mb-8">
                  <h2 className="text-3xl font-bold text-slate-900 mb-2">
                    Send a Message
                  </h2>
                  <p className="text-slate-500">
                    Fill out the form below and our team will get back to you
                    within 24 hours.
                  </p>
                </div>

                {!submitted ? (
                  <form className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label className="text-slate-700">Name</Label>
                        <Input
                          placeholder="John Doe"
                          className="h-12 bg-slate-50 border-slate-200 focus:bg-white focus:border-orange-500 transition-all"
                          value={formData.name}
                          onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-slate-700">Phone</Label>
                        <Input
                          placeholder="+91..."
                          className="h-12 bg-slate-50 border-slate-200 focus:bg-white focus:border-orange-500 transition-all"
                          value={formData.phone}
                          onChange={(e) =>
                            setFormData({ ...formData, phone: e.target.value })
                          }
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-slate-700">Email</Label>
                      <Input
                        placeholder="john@example.com"
                        className="h-12 bg-slate-50 border-slate-200 focus:bg-white focus:border-orange-500 transition-all"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-slate-700">Message</Label>
                      <Textarea
                        placeholder="How can we help you?"
                        rows={5}
                        className="bg-slate-50 border-slate-200 focus:bg-white focus:border-orange-500 resize-none transition-all"
                        value={formData.message}
                        onChange={(e) =>
                          setFormData({ ...formData, message: e.target.value })
                        }
                      />
                    </div>

                    <Button
                      onClick={handleSubmit}
                      className="w-full h-14 bg-slate-900 hover:bg-orange-600 text-white text-lg font-medium transition-all duration-300 shadow-lg hover:shadow-orange-500/25"
                    >
                      Send Message
                    </Button>
                  </form>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center py-12 text-center"
                  >
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                      <CheckCircle2 className="w-10 h-10 text-green-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">
                      Message Sent!
                    </h3>
                    <p className="text-slate-500 max-w-xs">
                      Thank you for reaching out. We will respond to your
                      inquiry shortly.
                    </p>
                  </motion.div>
                )}
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="relative"
          >
            <div className="relative w-full h-125 md:h-150 rounded-3xl overflow-hidden bg-white border border-slate-100">
              <Cobe
                variant="default"
                phi={0}
                theta={0.25}
                mapSamples={16000}
                mapBrightness={10}
                mapBaseBrightness={0.08}
                diffuse={1.1}
                dark={1.6}
                baseColor="#0b1220"
                glowColor="#CCE0FF"
                markerColor="#E5F0FF"
                markerSize={0.05}
                scale={1.05}
                opacity={0.9}
                offsetX={0}
                offsetY={0}
              />
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                className="absolute bottom-8 left-8 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full border border-orange-200 shadow-lg flex items-center gap-2"
              >
                <div className="relative">
                  <div className="w-3 h-3 bg-orange-500 rounded-full" />
                  <div className="absolute top-0 left-0 w-3 h-3 bg-orange-500 rounded-full animate-ping" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Located At
                  </p>
                  <p className="text-sm text-slate-600 font-medium">
                    Kharagpur, West Bengal
                  </p>
                </div>
              </motion.div>
            </div>

            <div className="absolute -top-6 -right-6 w-24 h-24 bg-orange-500/10 rounded-full blur-2xl -z-10" />
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -z-10" />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
