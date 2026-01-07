import { Star } from "lucide-react";
import {motion} from "motion/react"
export const Testimonials = () => {
  const testimonials = [
    {
      name: "Alexander G.",
      role: "CEO, TechFlow",
      text: "The definition of premium. The car was pristine and the handover was done in minutes."
    },
    {
      name: "Sarah Jenkins",
      role: "Travel Photographer",
      text: "I needed a reliable luxury vehicle for a shoot. Firstcab delivered beyond my expectations."
    },
    {
      name: "Michael Chen",
      role: "Investment Banker",
      text: "Transparent pricing and exceptional fleet. My go-to for all business travel."
    }
  ];

  return (
    <section className="py-24 px-6 relative z-10">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Client Stories</h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg transition-shadow"
            >
              <div className="flex gap-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} className="fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-slate-700 mb-8 italic leading-relaxed">"{item.text}"</p>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 font-bold text-sm">
                  {item.name.charAt(0)}
                </div>
                <div>
                  <p className="font-bold text-slate-900 text-sm">{item.name}</p>
                  <p className="text-slate-400 text-xs">{item.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
