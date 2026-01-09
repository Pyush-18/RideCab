import React, { useState } from 'react';
import { MessageCircle, Phone, X, Send, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const FloatingContactWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [isHovered, setIsHovered] = useState(null);

  const whatsappNumber = '7500218120';
  const phoneNumber = '9588041628';

  const handleSendWhatsApp = () => {
    const encodedMessage = encodeURIComponent(message || 'Hello! I\'m interested in your premium car rental service.');
    window.open(`https://wa.me/${whatsappNumber}?text=${encodedMessage}`, '_blank');
    setIsOpen(false);
    setMessage('');
  };

  const handleDialerClick = () => {
    window.location.href = `tel:${phoneNumber}`;
  };

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 20, transformOrigin: "bottom right" },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 25 }
    },
    exit: { 
      opacity: 0, 
      scale: 0.9, 
      y: 20,
      transition: { duration: 0.2 }
    }
  };

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex flex-col items-end gap-3 sm:gap-4 font-sans pointer-events-none">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="pointer-events-auto mb-2 w-[calc(100vw-2rem)] sm:w-90 overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-2xl dark:border-zinc-800 dark:bg-zinc-950 origin-bottom-right"
          >
            <div className="relative bg-zinc-950 p-5 sm:p-6 text-white overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-full bg-linear-to-br from-emerald-600/20 to-teal-900/40 z-0" />
              <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-emerald-500/20 blur-2xl" />
              
              <div className="relative z-10 flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/20 backdrop-blur-sm">
                      <User className="h-5 w-5 sm:h-6 sm:w-6 text-emerald-400" />
                    </div>
                    <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full bg-emerald-500 ring-2 ring-zinc-950" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold tracking-tight text-white">Support Team</h3>
                    <p className="text-xs text-zinc-400">Typically replies in 2 mins</p>
                  </div>
                </div>
               
              </div>
            </div>

            <div className="p-4 sm:p-5 bg-white/50 backdrop-blur-xl">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none text-zinc-700">
                    Your Message
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Hi, I'd like to inquire about..."
                    className="flex min-h-25 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-base sm:text-sm ring-offset-white placeholder:text-zinc-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 resize-none"
                  />
                </div>
                
                <button
                  onClick={handleSendWhatsApp}
                  className="inline-flex h-11 sm:h-10 w-full items-center justify-center rounded-xl bg-zinc-900 px-4 py-2 text-sm font-medium text-zinc-50 shadow transition-colors hover:bg-zinc-800 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950 gap-2 group active:scale-[0.98]"
                >
                  <span>Start Chat</span>
                  <Send className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
              <div className="mt-4 flex items-center justify-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] text-zinc-400 uppercase tracking-wider font-medium">Online Now</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col gap-3 sm:gap-4 items-end pointer-events-auto">
        <div className="relative flex items-center gap-4">
          <AnimatePresence>
            {isHovered === 'phone' && (
              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="hidden sm:block rounded-md bg-zinc-900 px-3 py-1.5 text-xs font-medium text-white shadow-lg whitespace-nowrap"
              >
                Call Support
              </motion.div>
            )}
          </AnimatePresence>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onHoverStart={() => setIsHovered('phone')}
            onHoverEnd={() => setIsHovered(null)}
            onClick={handleDialerClick}
            className="group relative flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full bg-white shadow-lg shadow-zinc-200/50 border border-zinc-100 hover:border-blue-100 transition-all duration-300"
          >
            <div className="absolute inset-0 rounded-full bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <Phone className="h-5 w-5 sm:h-6 sm:w-6 text-zinc-600 group-hover:text-blue-600 transition-colors" />
          </motion.button>
        </div>

        <div className="relative flex items-center gap-4">
          <AnimatePresence>
            {isHovered === 'whatsapp' && !isOpen && (
              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="hidden sm:block rounded-md bg-zinc-900 px-3 py-1.5 text-xs font-medium text-white shadow-lg whitespace-nowrap"
              >
                Chat on WhatsApp
              </motion.div>
            )}
          </AnimatePresence>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onHoverStart={() => setIsHovered('whatsapp')}
            onHoverEnd={() => setIsHovered(null)}
            onClick={() => setIsOpen(!isOpen)}
            className={`group relative flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full shadow-xl transition-all duration-300 ${
              isOpen 
                ? 'bg-zinc-900 text-white rotate-90' 
                : 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-emerald-500/30'
            }`}
          >
            <AnimatePresence mode="wait">
              {isOpen ? (
                <motion.div
                  key="close"
                  initial={{ opacity: 0, rotate: -90 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: 90 }}
                >
                  <X className="h-6 w-6 sm:h-7 sm:w-7" />
                </motion.div>
              ) : (
                <motion.div
                  key="chat"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  className="relative"
                >
                  <MessageCircle className="h-6 w-6 sm:h-7 sm:w-7 fill-current" />
                  <span className="absolute -top-1 -right-1 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default FloatingContactWidget;