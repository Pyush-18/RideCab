import {
  ArrowRight,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
} from "lucide-react";
import { Link } from "react-router";

export const Footer = () => {

    const navItems = [
      { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];
  return (
    <footer className="bg-slate-900 text-slate-300 py-12 md:py-16 lg:py-20 px-4 md:px-6 relative z-10 overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 md:w-96 md:h-96 bg-amber-500/10 rounded-full blur-[128px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10 lg:gap-12">
        <div className="space-y-4 md:space-y-6">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 md:w-8 md:h-8 bg-amber-500 rounded-lg flex items-center justify-center text-white font-bold text-sm md:text-base">
              R
            </div>
            <span className="text-xl md:text-2xl font-bold text-white tracking-tight">
              Firstcab
            </span>
          </div>
          <p className="text-slate-400 text-xs md:text-sm leading-relaxed">
            Premium car rental services for those who appreciate quality,
            comfort, and speed.
          </p>
          <div className="flex gap-3 md:gap-4">
            {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
              <Link
                key={i}
                to="#"
                className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-amber-600 hover:text-white transition-colors"
              >
                <Icon size={16} className="md:w-4.5 md:h-4.5" />
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-white font-bold mb-4 md:mb-6 text-sm md:text-base">Company</h4>
          <ul className="space-y-3 md:space-y-4 text-xs md:text-sm">
            {navItems.map((item) => (
              <li key={item}>
                <Link to={item?.path} className="hover:text-amber-500 transition-colors">
                  {item?.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-white font-bold mb-4 md:mb-6 text-sm md:text-base">Support</h4>
          <ul className="space-y-3 md:space-y-4 text-xs md:text-sm">
            {[
              "Help Center",
              "Terms of Service",
              "Privacy Policy",
              "Contact Us",
            ].map((item) => (
              <li key={item}>
                <a href="#" className="hover:text-amber-500 transition-colors">
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-white font-bold mb-4 md:mb-6 text-sm md:text-base">Newsletter</h4>
          <p className="text-slate-400 text-xs md:text-sm mb-3 md:mb-4">
            Subscribe for latest deals and updates.
          </p>
          <div className="flex gap-2">
            <input
              type="email"
              placeholder="Email address"
              className="bg-slate-800 border-none rounded-lg px-3 md:px-4 py-2 text-xs md:text-sm w-full focus:ring-1 focus:ring-amber-500 outline-none"
            />
            <button className="bg-amber-600 text-white rounded-lg px-3 md:px-4 py-2 hover:bg-amber-700 transition-colors shrink-0">
              <ArrowRight size={16} className="md:w-4.5 md:h-4.5" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-12 md:mt-16 pt-6 md:pt-8 border-t border-slate-800 text-center text-xs md:text-sm text-slate-500">
        © 2025 Firstcab Inc. All rights reserved.
      </div>
    </footer>
  );
};