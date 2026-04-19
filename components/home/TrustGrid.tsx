'use client';

import { motion } from 'framer-motion';
import { CircleCheck as CheckCircle2, Truck, RotateCcw, Repeat2 } from 'lucide-react';

const trustItems = [
  {
    icon: CheckCircle2,
    label: 'BIS Hallmarked',
    description: 'Certified authentic hallmarked jewelry from India Bureau of Standards',
  },
  {
    icon: Truck,
    label: 'Insured Shipping',
    description: 'Every delivery is fully insured and tracked with utmost care',
  },
  {
    icon: RotateCcw,
    label: 'Easy Returns',
    description: '30-day returns policy with no questions asked guarantee',
  },
  {
    icon: Repeat2,
    label: 'Lifetime Exchange',
    description: 'Exchange or upgrade your pieces anytime during your lifetime',
  },
];

export default function TrustGrid() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <section className="py-20 px-6 bg-cream">
      <div className="max-w-7xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {trustItems.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={idx}
                variants={itemVariants}
                className="flex flex-col items-center text-center relative"
              >
                <div className="mb-6">
                  <div className="p-3 rounded-full bg-gold/10 flex items-center justify-center">
                    <Icon className="w-6 h-6 text-gold" strokeWidth={1.2} />
                  </div>
                </div>

                <h3 className="font-playfair text-lg text-richblack mb-2">
                  {item.label}
                </h3>
                <p className="text-richblack-muted text-sm leading-relaxed">
                  {item.description}
                </p>

                {idx < trustItems.length - 1 && (
                  <div className="hidden lg:block absolute right-0 top-1/2 -translate-y-1/2 w-px h-12 bg-gradient-to-b from-transparent via-gold-muted to-transparent opacity-30" />
                )}
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
