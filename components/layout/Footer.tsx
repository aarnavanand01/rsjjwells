'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Mail, Send, Instagram, Facebook, Share2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const footerSections = {
  brand: {
    title: 'RSJ Jewelers',
    description: 'Since 1985, crafting timeless pieces with heritage excellence. Each creation embodies generations of artisanal mastery.',
  },
  shop: {
    title: 'Shop',
    links: [
      { label: 'Gold', href: '/shop?category=gold' },
      { label: 'Diamond', href: '/shop?category=diamond' },
      { label: 'Silver', href: '/shop?category=silver' },
      { label: 'Solitaires', href: '/shop?category=diamond&type=solitaire' },
    ],
  },
  care: {
    title: 'Customer Care',
    links: [
      { label: 'My Orders', href: '/orders' },
      { label: 'My Wishlist', href: '/wishlist' },
      { label: 'Digital Gold', href: '/digital-gold' },
      { label: 'My Account', href: '/profile' },
    ],
  },
};

const socialLinks = [
  { icon: Instagram, href: '#', label: 'Instagram' },
  { icon: Share2, href: '#', label: 'Pinterest' },
  { icon: Facebook, href: '#', label: 'Facebook' },
];

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 3000);
      setLoading(false);
    }, 500);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <footer className="bg-cream-warm border-t border-gold-muted/30">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16"
        >
          <motion.div variants={itemVariants} className="space-y-4">
            <h3 className="font-playfair text-2xl text-richblack italic tracking-widest">RSJ</h3>
            <p className="text-richblack-muted text-sm leading-relaxed">
              {footerSections.brand.description}
            </p>
          </motion.div>

          <motion.div variants={itemVariants} className="space-y-4">
            <h4 className="font-montserrat text-sm font-semibold text-richblack tracking-widest uppercase">
              {footerSections.shop.title}
            </h4>
            <ul className="space-y-3">
              {footerSections.shop.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-richblack-muted hover:text-gold transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div variants={itemVariants} className="space-y-4">
            <h4 className="font-montserrat text-sm font-semibold text-richblack tracking-widest uppercase">
              {footerSections.care.title}
            </h4>
            <ul className="space-y-3">
              {footerSections.care.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-richblack-muted hover:text-gold transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div variants={itemVariants} className="space-y-4">
            <h4 className="font-montserrat text-sm font-semibold text-richblack tracking-widest uppercase">
              Join The Royal Club
            </h4>
            <p className="text-richblack-muted text-sm">
              Exclusive offers and early access to new collections.
            </p>
            <form onSubmit={handleSubscribe} className="space-y-3">
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-4 h-4 text-gold-muted" />
                <Input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="pl-9 bg-white border-gold-muted/30 focus:border-gold focus:ring-gold text-sm"
                />
              </div>
              <Button
                type="submit"
                disabled={loading}
                className="w-full btn-gold py-2 rounded-sm inline-flex items-center justify-center gap-2 text-sm h-auto"
              >
                {subscribed ? 'Subscribed!' : (
                  <>
                    Subscribe
                    <Send className="w-3 h-3" />
                  </>
                )}
              </Button>
            </form>
            {subscribed && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-xs text-emerald-600 font-medium"
              >
                Welcome to The Royal Club!
              </motion.p>
            )}
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="border-t border-gold-muted/20 pt-8 flex flex-col md:flex-row items-center justify-between gap-6"
        >
          <div className="text-richblack-muted text-xs text-center md:text-left">
            <p>
              © {new Date().getFullYear()} RSJ Jewelers. All rights reserved. Crafted with excellence since 1985.
            </p>
          </div>

          <div className="flex items-center gap-4">
            {socialLinks.map((social) => {
              const Icon = social.icon;
              return (
                <motion.a
                  key={social.label}
                  href={social.href}
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 text-richblack-muted hover:text-gold transition-colors"
                  aria-label={social.label}
                >
                  <Icon className="w-4 h-4" strokeWidth={1.5} />
                </motion.a>
              );
            })}
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
