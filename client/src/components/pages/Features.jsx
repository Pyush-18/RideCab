import { Headphones, ShieldCheck, Zap } from "lucide-react";
import { motion } from "motion/react";

export const Features = () => {
  const features = [
    {
      icon: Zap,
      title: "Instant Booking",
      desc: "Book your dream car in less than 2 minutes with our streamlined app.",
    },
    {
      icon: ShieldCheck,
      title: "Full Insurance",
      desc: "Drive with peace of mind knowing you are fully covered.",
    },
    {
      icon: Headphones,
      title: "24/7 Support",
      desc: "Our concierge team is available around the clock to assist you.",
    },
  ];

  return (
    <section className="py-32 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        
        <div className="text-center mb-20 max-w-2xl mx-auto">
          <motion.h2 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-semibold text-slate-900 mb-6 tracking-tight"
          >
            Premium Experience
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-slate-500 text-lg font-light leading-relaxed"
          >
            Everything you need for a seamless journey, reimagined for simplicity.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ y: -8 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.4, ease: "easeOut" }}
              className="group relative flex flex-col items-start text-left p-10 rounded-[2.5rem] bg-white border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(251,191,36,0.15)] hover:border-amber-100 transition-all duration-500"
            >
              <div className="mb-8 relative">
                <div className="absolute inset-0 bg-amber-100 blur-xl opacity-0 group-hover:opacity-40 transition-opacity duration-500 rounded-full" />
                <div className="relative w-14 h-14 flex items-center justify-center bg-slate-50 rounded-2xl group-hover:bg-amber-50 group-hover:text-amber-600 text-slate-900 transition-colors duration-300">
                    <feature.icon size={26} strokeWidth={1.5} />
                </div>
              </div>

              <h3 className="text-2xl font-semibold text-slate-900 mb-4 tracking-tight">
                {feature.title}
              </h3>
              
              <p className="text-slate-500 leading-loose text-base font-light">
                {feature.desc}
              </p>

              <div className="absolute top-10 right-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                <div className="w-2 h-2 rounded-full bg-amber-400/50" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};