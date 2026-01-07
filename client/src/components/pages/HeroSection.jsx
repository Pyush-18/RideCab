import { ArrowRight, Calendar, MapPin, ShieldCheck, Star } from "lucide-react";
import {useScroll, useTransform, useSpring, motion} from "motion/react"
import { useRef, useState } from "react";
import { useNavigate } from "react-router";


const FloatingParticles = () => {
  const particles = Array.from({ length: 20 });
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((_, i) => (
        <motion.div
          key={i}
          className="absolute bg-amber-500/20 rounded-full"
          initial={{
            x: Math.random() * 100 + "%",
            y: Math.random() * 100 + "%",
            scale: Math.random() * 0.5 + 0.5,
          }}
          animate={{
            y: [null, Math.random() * -100],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: Math.random() * 10 + 10,
            repeat: Infinity,
            ease: "linear",
            delay: Math.random() * 5,
          }}
          style={{
            width: Math.random() * 10 + 5 + "px",
            height: Math.random() * 10 + 5 + "px",
          }}
        />
      ))}
    </div>
  );
};

export default function HeroSection() {
  const [pickupDate, setPickupDate] = useState('Wed, 24 July - 12:00');
  const [returnDate, setReturnDate] = useState('Sat, 27 July - 10:00');
  const [location, setLocation] = useState('New York, Central Park');
  const navigate = useNavigate()

  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  const heroTextY = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const heroImageY = useTransform(scrollYProgress, [0, 1], [0, 50]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  
  const smoothHeroTextY = useSpring(heroTextY, { stiffness: 100, damping: 30 });
  const smoothHeroImageY = useSpring(heroImageY, { stiffness: 100, damping: 30 });

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  return (
    <section ref={heroRef} className="relative pt-20 pb-16 md:pt-32 md:pb-20 lg:pt-32 lg:pb-32 px-4 md:px-6 overflow-hidden">
      <FloatingParticles />
      
      <div className="absolute top-20 right-0 w-96 h-96 md:w-125 md:h-125 bg-amber-400/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 md:w-125 md:h-125 bg-blue-400/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10 grid lg:grid-cols-2 gap-12 items-center">
        
        <motion.div 
          style={{ y: smoothHeroTextY, opacity: heroOpacity }}
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-100 text-amber-700 text-xs font-bold uppercase tracking-wider mb-4 md:mb-6">
            <Star size={12} className="fill-amber-700" /> Premium Fleet 2025
          </motion.div>
          
          <motion.h1 variants={fadeInUp} className="text-4xl sm:text-5xl lg:text-7xl font-bold text-slate-900 leading-[1.1] mb-4 md:mb-6 tracking-tight">
            Elevate Your <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-amber-500 to-orange-600">Journey.</span>
          </motion.h1>
          
          <motion.p variants={fadeInUp} className="text-base md:text-lg text-slate-500 mb-6 md:mb-8 max-w-md leading-relaxed">
            Experience the thrill of the road with our curated collection of luxury and sports vehicles. Delivered to your doorstep.
          </motion.p>
          
          <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-3 md:gap-4">
            <button onClick={() => navigate('/pricing')} className="px-6 md:px-8 py-3 md:py-4 bg-slate-900 text-white rounded-full font-semibold hover:bg-slate-800 transition-all hover:scale-105 flex items-center justify-center gap-2 shadow-xl shadow-slate-900/20">
              View Fleet <ArrowRight size={18} />
            </button>
          </motion.div>
        </motion.div>

        <motion.div 
          className="relative mt-12 lg:mt-0"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          style={{ y: smoothHeroImageY }}
        >
          <div className="absolute inset-0 bg-linear-to-tr from-amber-500/20 to-transparent rounded-2xl md:rounded-[3rem] blur-xl transform rotate-3 scale-95" />
          <img 
            src="https://images.unsplash.com/photo-1617788138017-80ad40651399?q=80&w=1200" 
            alt="Luxury Car" 
            className="relative z-10 w-full rounded-2xl md:rounded-[2.5rem] shadow-2xl border-2 md:border-4 border-white"
          />
          <motion.div 
            className="absolute -bottom-4 left-4 md:-bottom-8 md:-left-8 bg-white/90 backdrop-blur-md p-4 md:p-6 rounded-xl md:rounded-2xl shadow-xl border border-white/50 z-20 max-w-70 md:max-w-xs"
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="flex items-center gap-3 md:gap-4">
              <div className="p-2 md:p-3 bg-green-100 rounded-full text-green-600">
                <ShieldCheck size={20} className="md:w-6 md:h-6" />
              </div>
              <div>
                <p className="font-bold text-slate-900 text-sm md:text-base">Fully Insured</p>
                <p className="text-xs text-slate-500">Every trip covers comprehensive insurance.</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      <motion.div 
        className="max-w-5xl mx-auto mt-12 md:mt-16 lg:mt-20 relative z-30"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.8 }}
      >
        <div className="bg-white rounded-xl md:rounded-2xl shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] p-3 md:p-4 border border-slate-100 flex flex-col md:flex-row gap-3 md:gap-4">
          
          <div className="flex-1 px-3 md:px-4 py-2 border-b md:border-b-0 md:border-r border-slate-100 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer group">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider group-hover:text-amber-600">Location</label>
            <div className="flex items-center gap-2 mt-1">
              <MapPin size={18} className="text-slate-400 group-hover:text-amber-600 md:w-5 md:h-5" />
              <span className="font-medium text-slate-800 text-sm md:text-base">{location}</span>
            </div>
          </div>

          <div className="flex-1 px-3 md:px-4 py-2 border-b md:border-b-0 md:border-r border-slate-100 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer group">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider group-hover:text-amber-600">Pick-up</label>
            <div className="flex items-center gap-2 mt-1">
              <Calendar size={18} className="text-slate-400 group-hover:text-amber-600 md:w-5 md:h-5" />
              <span className="font-medium text-slate-800 text-sm md:text-base">{pickupDate}</span>
            </div>
          </div>

          <div className="flex-1 px-3 md:px-4 py-2 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer group">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider group-hover:text-amber-600">Return</label>
            <div className="flex items-center gap-2 mt-1">
              <Calendar size={18} className="text-slate-400 group-hover:text-amber-600 md:w-5 md:h-5" />
              <span className="font-medium text-slate-800 text-sm md:text-base">{returnDate}</span>
            </div>
          </div>

          <button className="bg-slate-900 hover:bg-amber-600 text-white px-6 md:px-8 py-3 md:py-4 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2">
             Search
          </button>
        </div>
      </motion.div>
    </section>
  );
}