import { motion, useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';
import { Award, Users, Car, TrendingUp, Shield, Sparkles, MapPin, Clock } from 'lucide-react';

const StatCard = ({ icon: Icon, value, label, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6, delay }}
    className="relative group"
  >
    <div className="absolute inset-0 bg-linear-to-br from-amber-400/20 to-orange-500/20 rounded-xl md:rounded-2xl blur-xl group-hover:blur-2xl transition-all opacity-0 group-hover:opacity-100" />
    <div className="relative bg-white border border-slate-200 rounded-xl md:rounded-2xl p-4 md:p-6 hover:border-amber-300 transition-all hover:shadow-xl">
      <div className="flex items-center gap-3 md:gap-4">
        <div className="p-2 md:p-3 bg-linear-to-br from-amber-400 to-orange-500 rounded-lg md:rounded-xl text-white">
          <Icon size={20} className="md:w-6 md:h-6" />
        </div>
        <div>
          <div className="text-2xl md:text-3xl font-bold text-slate-900">{value}</div>
          <div className="text-xs md:text-sm text-slate-500">{label}</div>
        </div>
      </div>
    </div>
  </motion.div>
);

const FeatureCard = ({ icon: Icon, title, description, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6, delay }}
    className="relative group"
  >
    <div className="absolute inset-0 bg-linear-to-br from-slate-900 to-slate-800 rounded-xl md:rounded-2xl transform group-hover:scale-105 transition-transform" />
    <div className="relative bg-linear-to-br from-slate-900 to-slate-800 rounded-xl md:rounded-2xl p-6 md:p-8 border border-slate-700 hover:border-amber-500/50 transition-all">
      <div className="inline-flex p-2 md:p-3 bg-amber-500/10 rounded-lg md:rounded-xl mb-3 md:mb-4 group-hover:bg-amber-500/20 transition-colors">
        <Icon size={24} className="text-amber-400 md:w-7 md:h-7" />
      </div>
      <h3 className="text-lg md:text-xl font-bold text-white mb-2 md:mb-3">{title}</h3>
      <p className="text-sm md:text-base text-slate-400 leading-relaxed">{description}</p>
    </div>
  </motion.div>
);

export default function About() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const imageY = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);

  return (
    <div className="bg-slate-50 overflow-hidden mt-8 md:mt-12">
      <section ref={containerRef} className="relative py-16 md:py-20 lg:py-24 px-4 md:px-6 overflow-hidden">
        <div className="absolute top-20 right-0 w-64 h-64 md:w-96 md:h-96 bg-amber-400/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-0 w-64 h-64 md:w-96 md:h-96 bg-blue-400/5 rounded-full blur-3xl" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <motion.div 
                className="inline-flex items-center gap-2 px-3 md:px-4 py-1.5 md:py-2 rounded-full bg-amber-100 border border-amber-200 mb-4 md:mb-6"
                initial={{ scale: 0.9 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
              >
                <Sparkles size={14} className="text-amber-600 md:w-4 md:h-4" />
                <span className="text-xs md:text-sm font-bold text-amber-700 uppercase tracking-wider">About Firstcab</span>
              </motion.div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-4 md:mb-6 leading-tight">
                Redefining Luxury
                <span className="block text-transparent bg-clip-text bg-linear-to-r from-amber-500 to-orange-600">
                  Car Experiences
                </span>
              </h1>

              <p className="text-base md:text-lg text-slate-600 mb-4 md:mb-8 leading-relaxed">
                We're not just a car rental company — we're curators of extraordinary journeys. Since 2018, Firstcab has been delivering premium automotive experiences that transform ordinary drives into unforgettable adventures.
              </p>

              <p className="text-base md:text-lg text-slate-600 mb-6 md:mb-8 leading-relaxed">
                From exotic supercars to elegant luxury sedans, our handpicked fleet represents the pinnacle of automotive excellence. Every vehicle is meticulously maintained, fully insured, and ready to elevate your journey.
              </p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="flex flex-wrap gap-2 md:gap-4"
              >
                <div className="flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-1.5 md:py-2 bg-green-50 border border-green-200 rounded-full">
                  <Shield size={14} className="text-green-600 md:w-4.5 md:h-4.5" />
                  <span className="text-xs md:text-sm font-semibold text-green-700">Fully Insured</span>
                </div>
                <div className="flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-1.5 md:py-2 bg-blue-50 border border-blue-200 rounded-full">
                  <Clock size={14} className="text-blue-600 md:w-4.5 md:h-4.5" />
                  <span className="text-xs md:text-sm font-semibold text-blue-700">24/7 Support</span>
                </div>
                <div className="flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-1.5 md:py-2 bg-purple-50 border border-purple-200 rounded-full">
                  <MapPin size={14} className="text-purple-600 md:w-4.5 md:h-4.5" />
                  <span className="text-xs md:text-sm font-semibold text-purple-700">Doorstep Delivery</span>
                </div>
              </motion.div>
            </motion.div>

            <motion.div
              className="relative mt-8 lg:mt-0"
              style={{ y: imageY, opacity }}
            >
              <div className="absolute inset-0 bg-linear-to-tr from-amber-500/20 to-transparent rounded-2xl md:rounded-3xl blur-2xl transform rotate-6" />
              <img
                src="https://images.unsplash.com/photo-1563720360172-67b8f3dce741?q=80&w=1200"
                alt="Luxury Showroom"
                className="relative z-10 rounded-2xl md:rounded-3xl shadow-2xl w-full border-2 md:border-4 border-white"
              />
              <motion.div
                className="absolute -bottom-4 -left-4 md:-bottom-8 md:-left-8 bg-white rounded-xl md:rounded-2xl p-4 md:p-6 shadow-xl border border-slate-200 z-20"
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              >
                <div className="flex items-center gap-3 md:gap-4">
                  <div className="text-3xl md:text-4xl">🏆</div>
                  <div>
                    <p className="font-bold text-slate-900 text-sm md:text-base">Award Winning</p>
                    <p className="text-xs text-slate-500">Best Luxury Fleet 2025</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20 px-4 md:px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12 md:mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3 md:mb-4">
              Trusted by Thousands
            </h2>
            <p className="text-base md:text-lg text-slate-600 max-w-2xl mx-auto px-4">
              Our numbers speak for themselves. Join the elite community of drivers who choose excellence.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
            <StatCard icon={Users} value="15K+" label="Happy Customers" delay={0} />
            <StatCard icon={Car} value="250+" label="Premium Vehicles" delay={0.1} />
            <StatCard icon={MapPin} value="50+" label="Cities Worldwide" delay={0.2} />
            <StatCard icon={TrendingUp} value="98%" label="Satisfaction Rate" delay={0.3} />
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20 px-4 md:px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-slate-900 via-slate-800 to-slate-900" />
        
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '50px 50px',
          }} />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12 md:mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3 md:mb-4">
              Why Choose Firstcab?
            </h2>
            <p className="text-base md:text-lg text-slate-400 max-w-2xl mx-auto px-4">
              We've reimagined car rental from the ground up to deliver an experience that's seamless, secure, and spectacular.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            <FeatureCard
              icon={Shield}
              title="Comprehensive Insurance"
              description="Every rental includes full coverage insurance. Drive with complete peace of mind knowing you're fully protected."
              delay={0}
            />
            <FeatureCard
              icon={Award}
              title="Premium Fleet"
              description="From Lamborghinis to Teslas, our curated collection features only the finest vehicles, meticulously maintained."
              delay={0.1}
            />
            <FeatureCard
              icon={Clock}
              title="24/7 Concierge"
              description="Round-the-clock support team ready to assist. Need a midnight pickup? We've got you covered."
              delay={0.2}
            />
            <FeatureCard
              icon={MapPin}
              title="Doorstep Delivery"
              description="Your car delivered wherever you are. Airport, hotel, or home — we bring luxury to your location."
              delay={0.3}
            />
            <FeatureCard
              icon={Users}
              title="VIP Treatment"
              description="White-glove service from start to finish. Experience the difference that attention to detail makes."
              delay={0.4}
            />
            <FeatureCard
              icon={Sparkles}
              title="Immaculate Condition"
              description="Every vehicle is professionally detailed before delivery. Spotless exteriors, pristine interiors, every time."
              delay={0.5}
            />
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20 px-4 md:px-6 bg-linear-to-br from-amber-50 to-orange-50">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-block p-3 md:p-4 bg-white rounded-full shadow-lg mb-4 md:mb-6">
              <div className="text-4xl md:text-6xl">🎯</div>
            </div>
            
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-4 md:mb-6 px-4">
              Our Mission
            </h2>
            
            <p className="text-base md:text-xl text-slate-700 leading-relaxed mb-6 md:mb-8 px-4">
              To democratize access to extraordinary vehicles while maintaining the highest standards of service, safety, and sustainability. We believe everyone deserves to experience the thrill of driving their dream car.
            </p>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-block"
            >
              <button className="px-6 md:px-8 py-3 md:py-4 bg-linear-to-r from-amber-500 to-orange-600 text-white rounded-full font-semibold shadow-xl hover:shadow-2xl transition-all text-sm md:text-base">
                Join Our Journey
              </button>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}