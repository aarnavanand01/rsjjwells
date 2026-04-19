'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Sparkles, Award, Heart, Zap } from 'lucide-react';
import Footer from '@/components/layout/Footer';

export default function AboutPage() {
  return (
    <div className="bg-cream min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div className="absolute top-20 left-10 w-96 h-96 bg-gold rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-gold rounded-full blur-3xl" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 max-w-4xl text-center space-y-8"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex items-center justify-center gap-2 text-gold"
          >
            <Sparkles className="w-5 h-5" />
            <span className="section-label">Our Heritage</span>
            <Sparkles className="w-5 h-5" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="font-playfair text-6xl md:text-7xl text-richblack leading-tight"
          >
            Crafted with Purpose,
            <br />
            <span className="gold-text-animate inline-block mt-4">Worn with Pride</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-richblack-muted text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed font-light"
          >
            At RSJ Jewelers, we don't just create jewelry. We craft stories, preserve traditions, and celebrate the moments that matter most.
          </motion.p>

          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2"
          >
            <div className="text-gold opacity-40">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 19l-8-8 1.4-1.4L12 16.2l6.6-6.6L20 11l-8 8z" />
              </svg>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* History Timeline Section */}
      <section className="py-32 px-6 bg-white relative">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-20"
          >
            <h2 className="font-playfair text-5xl text-richblack mb-4">History of Excellence</h2>
            <div className="gold-divider w-12 h-px mx-auto mt-6" />
          </motion.div>

          {/* Timeline */}
          <div className="space-y-20 relative">
            {/* Vertical line */}
            <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-gold to-cream-deep" />

            {/* 1990 - Foundation */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex gap-12 items-center"
            >
              <div className="w-1/2 text-right pr-8">
                <div className="space-y-3">
                  <h3 className="font-playfair text-3xl text-richblack">1990</h3>
                  <h4 className="font-semibold text-lg text-gold">The Beginning</h4>
                  <p className="text-richblack-muted leading-relaxed">
                    Founded by Master Craftsman Rajesh Kumar, RSJ Jewelers began as a humble workshop with a singular vision: to create jewelry that tells stories. With just three artisans and an unwavering commitment to quality, our journey started in the heart of India's jewelry capital.
                  </p>
                </div>
              </div>
              <div className="w-12 h-12 rounded-full bg-gold flex items-center justify-center text-white font-bold text-lg absolute left-1/2 -translate-x-1/2 shadow-lg">
                ✦
              </div>
              <div className="w-1/2" />
            </motion.div>

            {/* 2005 - Expansion */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex gap-12 items-center flex-row-reverse"
            >
              <div className="w-1/2 text-left pl-8">
                <div className="space-y-3">
                  <h3 className="font-playfair text-3xl text-richblack">2005</h3>
                  <h4 className="font-semibold text-lg text-gold">International Recognition</h4>
                  <p className="text-richblack-muted leading-relaxed">
                    After 15 years of excellence, RSJ Jewelers expanded internationally, earning certifications from global gemological institutes. Our pieces began adorning collections across Europe, the Middle East, and North America.
                  </p>
                </div>
              </div>
              <div className="w-12 h-12 rounded-full bg-gold flex items-center justify-center text-white font-bold text-lg absolute left-1/2 -translate-x-1/2 shadow-lg">
                ✦
              </div>
              <div className="w-1/2" />
            </motion.div>

            {/* 2015 - Innovation */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex gap-12 items-center"
            >
              <div className="w-1/2 text-right pr-8">
                <div className="space-y-3">
                  <h3 className="font-playfair text-3xl text-richblack">2015</h3>
                  <h4 className="font-semibold text-lg text-gold">Technology Meets Tradition</h4>
                  <p className="text-richblack-muted leading-relaxed">
                    We embraced modern technology while honoring traditional craftsmanship. Advanced CAD design, laser engraving, and 3D modeling became part of our arsenal—enhancing precision without losing soul.
                  </p>
                </div>
              </div>
              <div className="w-12 h-12 rounded-full bg-gold flex items-center justify-center text-white font-bold text-lg absolute left-1/2 -translate-x-1/2 shadow-lg">
                ✦
              </div>
              <div className="w-1/2" />
            </motion.div>

            {/* 2024 - Digital Transformation */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex gap-12 items-center flex-row-reverse"
            >
              <div className="w-1/2 text-left pl-8">
                <div className="space-y-3">
                  <h3 className="font-playfair text-3xl text-richblack">2024</h3>
                  <h4 className="font-semibold text-lg text-gold">Digital Excellence</h4>
                  <p className="text-richblack-muted leading-relaxed">
                    Today, we've launched our digital platform with dynamic, real-time pricing that reflects live market rates. Our global community can now experience luxury jewelry with transparency, accessibility, and the craftsmanship they deserve.
                  </p>
                </div>
              </div>
              <div className="w-12 h-12 rounded-full bg-gold flex items-center justify-center text-white font-bold text-lg absolute left-1/2 -translate-x-1/2 shadow-lg">
                ✦
              </div>
              <div className="w-1/2" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-20"
          >
            <h2 className="font-playfair text-5xl text-richblack mb-4">Our Core Values</h2>
            <div className="gold-divider w-12 h-px mx-auto mt-6" />
          </motion.div>

          <motion.div
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.15, delayChildren: 0 },
              },
            }}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-12"
          >
            {[
              {
                icon: Award,
                title: 'Excellence',
                desc: 'Every piece is a masterpiece, refined through decades of expertise and an obsession with perfection.',
              },
              {
                icon: Heart,
                title: 'Integrity',
                desc: 'We believe in transparency, ethical sourcing, and honest relationships with every customer.',
              },
              {
                icon: Zap,
                title: 'Innovation',
                desc: 'We honor tradition while embracing innovation—blending timeless craft with cutting-edge technology.',
              },
            ].map((value, idx) => {
              const IconComponent = value.icon;
              return (
                <motion.div
                  key={idx}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
                  }}
                  className="text-center space-y-4"
                >
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className="inline-block p-4 bg-gold/10 rounded-lg"
                  >
                    <IconComponent className="w-10 h-10 text-gold" />
                  </motion.div>
                  <h3 className="font-playfair text-2xl text-richblack">{value.title}</h3>
                  <p className="text-richblack-muted leading-relaxed">{value.desc}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Meet the Craftsmen Section */}
      <section className="py-32 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-20"
          >
            <h2 className="font-playfair text-5xl text-richblack mb-4">Meet Our Master Craftsmen</h2>
            <p className="text-richblack-muted text-lg max-w-2xl mx-auto">
              Behind every piece lies the hands, heart, and expertise of our master artisans. Meet the masters who bring your dreams to life.
            </p>
            <div className="gold-divider w-12 h-px mx-auto mt-6" />
          </motion.div>

          <motion.div
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.1, delayChildren: 0 },
              },
            }}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-12"
          >
            {[
              {
                name: 'Rajesh Kumar',
                title: 'Master Jeweler & Founder',
                desc: '40+ years of unparalleled craftsmanship. Rajesh pioneered modern jewelry design while preserving traditional techniques.',
                specialty: 'Custom Designs, High-End Collections',
              },
              {
                name: 'Priya Sharma',
                title: 'Master Gemologist',
                desc: 'Certified by international institutes, Priya personally selects every stone with an eye for perfection and authenticity.',
                specialty: 'Diamond & Precious Stone Selection',
              },
              {
                name: 'Arjun Patel',
                title: 'Master Engraver',
                desc: 'With 25 years of precision work, Arjun transforms metal into art through intricate detailing and fine engraving.',
                specialty: 'Detailed Work, Engravings',
              },
            ].map((craftsman, idx) => (
              <motion.div
                key={idx}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
                }}
                className="space-y-4 text-center group"
              >
                {/* Placeholder for craftsman image - using gradient instead */}
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="h-64 rounded-lg bg-gradient-to-br from-gold/20 to-cream-deep/30 flex items-center justify-center"
                >
                  <Sparkles className="w-20 h-20 text-gold/30" />
                </motion.div>

                <div className="space-y-2">
                  <h3 className="font-playfair text-2xl text-richblack">{craftsman.name}</h3>
                  <p className="text-gold font-semibold text-sm">{craftsman.title}</p>
                  <p className="text-richblack-muted leading-relaxed">{craftsman.desc}</p>
                  <p className="text-xs text-gold font-semibold pt-2">
                    SPECIALTY: {craftsman.specialty}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-32 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-20"
          >
            <h2 className="font-playfair text-5xl text-richblack mb-4">Why Choose RSJ Jewelers</h2>
            <div className="gold-divider w-12 h-px mx-auto mt-6" />
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12">
            {[
              {
                title: 'Certified Excellence',
                points: [
                  'BIS hallmark on all gold jewelry',
                  'GIA certificates for diamonds',
                  'International quality standards',
                  'Lifetime authenticity guarantee',
                ],
              },
              {
                title: 'Transparency & Fair Pricing',
                points: [
                  'Real-time market rate pricing',
                  'Clear pricing formula',
                  'No hidden charges',
                  'Competitive making charges',
                ],
              },
              {
                title: 'Craftsmanship',
                points: [
                  'Master artisans with 25+ years experience',
                  'Bespoke design services',
                  'Intricate detailing & precision',
                  'Heritage techniques with modern tech',
                ],
              },
              {
                title: 'Customer Care',
                points: [
                  '24/7 customer support',
                  'Lifetime cleaning & maintenance',
                  'Easy exchange & buyback',
                  'Secure packaging & insured delivery',
                ],
              },
            ].map((section, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="bg-cream-warm p-8 rounded-lg border border-cream-deep"
              >
                <h3 className="font-playfair text-2xl text-richblack mb-6">{section.title}</h3>
                <ul className="space-y-3">
                  {section.points.map((point, pidx) => (
                    <li key={pidx} className="flex items-start gap-3 text-richblack-muted">
                      <span className="text-gold font-bold mt-1">✓</span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-white">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto text-center space-y-8"
        >
          <h2 className="font-playfair text-4xl text-richblack">
            Ready to Discover Your Perfect Piece?
          </h2>
          <p className="text-richblack-muted text-lg">
            Explore our collections and experience the RSJ difference. Every piece is a testament to our commitment to excellence.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link
              href="/shop"
              className="btn-gold px-8 py-4 rounded-sm hover:shadow-2xl inline-flex items-center justify-center gap-2"
            >
              Shop Collection
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/shop"
              className="btn-outline-gold px-8 py-4 rounded-sm hover:shadow-lg inline-flex items-center justify-center"
            >
              Explore Collection
            </Link>
          </div>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}
