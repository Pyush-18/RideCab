import { CarFrontIcon, ShieldCheck, Star, ArrowRight } from "lucide-react";
import { useScroll, useTransform, useSpring, motion } from "motion/react";
import { useRef } from "react";
import { useNavigate } from "react-router";

const FloatingParticles = () => {
  const particles = Array.from({ length: 15 });

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {particles.map((_, i) => (
        <motion.div
          key={i}
          className="absolute bg-amber-400/30 rounded-full"
          initial={{
            x: Math.random() * 100 + "%",
            y: Math.random() * 100 + "%",
            scale: Math.random() * 0.4 + 0.2,
          }}
          animate={{
            y: [null, Math.random() * -80],
            opacity: [0, 0.6, 0],
          }}
          transition={{
            duration: Math.random() * 15 + 15,
            repeat: Infinity,
            ease: "linear",
            delay: Math.random() * 5,
          }}
          style={{
            width: Math.random() * 8 + 4 + "px",
            height: Math.random() * 8 + 4 + "px",
            willChange: "transform, opacity",
          }}
        />
      ))}
    </div>
  );
};

export default function HeroSection() {
  const navigate = useNavigate();
  const heroRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const heroTextY = useTransform(scrollYProgress, [0, 1], [0, 60]);
  const heroImageY = useTransform(scrollYProgress, [0, 1], [0, 30]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 1]);

  const smoothHeroTextY = useSpring(heroTextY, { stiffness: 60, damping: 20 });
  const smoothHeroImageY = useSpring(heroImageY, {
    stiffness: 60,
    damping: 20,
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
    },
  };

  return (
    <section
      ref={heroRef}
      className="relative min-h-[90vh] flex items-center pt-24 pb-16 lg:pt-32 lg:pb-24 px-4 sm:px-6 overflow-hidden bg-slate-50/50"
    >
      <div className="absolute top-[-20%] right-[-10%] w-150 h-150 bg-amber-200/20 rounded-full blur-[120px] pointer-events-none mix-blend-multiply" />
      <div className="absolute bottom-[-10%] left-[-10%] w-125 h-125 bg-blue-200/20 rounded-full blur-[120px] pointer-events-none mix-blend-multiply" />
      <FloatingParticles />

      <div className="max-w-7xl mx-auto w-full relative z-10 grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        <motion.div
          style={{ y: smoothHeroTextY, opacity: heroOpacity }}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-2xl"
        >
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-slate-200 shadow-xs mb-6 sm:mb-8 hover:border-amber-200 transition-colors group cursor-default"
          >
            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-amber-100 text-amber-600">
              <Star size={10} fill="currentColor" />
            </span>
            <span className="text-xs font-bold text-slate-600 tracking-wide uppercase group-hover:text-amber-700 transition-colors">
              Premium Fleet 2025
            </span>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="text-5xl sm:text-6xl lg:text-7xl font-bold text-slate-900 leading-[1.05] tracking-tighter mb-6"
          >
            Elevate Your <br />
            <span className="relative inline-block text-transparent bg-clip-text bg-linear-to-r from-amber-500 to-orange-600">
              Journey.
              <svg
                className="absolute w-full h-3 -bottom-1 left-0 text-amber-400 opacity-40"
                viewBox="0 0 100 10"
                preserveAspectRatio="none"
              >
                <path
                  d="M0 5 Q 50 10 100 5"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
              </svg>
            </span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-lg text-slate-600 mb-8 md:mb-10 leading-relaxed max-w-lg"
          >
            Experience the thrill of the road with our curated collection of
            luxury and sports vehicles. Delivered impeccably clean to your
            doorstep.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4"
          >
            <button
              onClick={() => navigate("/pricing")}
              className="h-14 px-8 bg-slate-900 text-white rounded-full font-semibold hover:bg-slate-800 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-slate-900/10 flex items-center justify-center gap-2.5 group"
            >
              Book Now
              <CarFrontIcon
                size={18}
                className="group-hover:translate-x-0.5 transition-transform"
              />
            </button>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="mt-10 sm:mt-12 flex items-center gap-6 text-sm font-medium text-slate-500"
          >
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-full border-2 border-white bg-slate-200"
                  style={{
                    backgroundImage: `url(https://i.pravatar.cc/100?img=${
                      i + 10
                    })`,
                    backgroundSize: "cover",
                  }}
                />
              ))}
            </div>
            <p>
              Trusted by{" "}
              <span className="text-slate-900 font-bold">2,000+</span> happy
              drivers
            </p>
          </motion.div>
        </motion.div>

        <motion.div
          style={{ y: smoothHeroImageY }}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
          className="relative mt-8 lg:mt-0 perspective-1000 hidden lg:block"
        >
          <div className="relative rounded-[2rem] sm:rounded-[3rem] overflow-hidden shadow-2xl shadow-slate-200/50 bg-slate-100 aspect-4/3 w-full group">
            <div className="absolute inset-0 bg-linear-to-tr from-amber-500/10 to-transparent z-10 pointer-events-none" />

            <img
              src="https://images.unsplash.com/photo-1617788138017-80ad40651399?q=80&w=1200&auto=format&fit=crop"
              alt="Luxury Sports Car Rental"
              width="1200"
              height="900"
              fetchPriority="high"
              loading="eager"
              className="object-cover w-full h-full transform transition-transform duration-700 group-hover:scale-105 will-change-transform"
            />

            <motion.div
              className="absolute bottom-6 left-6 right-6 sm:bottom-8 sm:left-8 sm:right-auto sm:w-80 bg-white/80 backdrop-blur-xl p-5 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-white/60 z-20"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-start gap-4">
                <div className="p-3 bg-linear-to-br from-green-50 to-green-100 rounded-xl text-green-600 shrink-0 shadow-inner">
                  <ShieldCheck size={24} strokeWidth={2.5} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base mb-1">
                    Fully Insured
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed font-medium">
                    Enjoy peace of mind. Every trip includes comprehensive
                    zero-dep insurance.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="absolute -z-10 top-10 -right-10 w-full h-full border-2 border-slate-200/60 rounded-[3rem] hidden md:block" />
        </motion.div>
      </div>
    </section>
  );
}
