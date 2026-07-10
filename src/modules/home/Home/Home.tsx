import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router';
import { useState, useEffect, useRef } from 'react';
import styles from './Home.module.css';

import heroImg from '../../../assets/images/home/hero.jpg';
import heroMenImg from '../../../assets/images/home/hero_men.jpg';
import heroSneakersImg from '../../../assets/images/home/hero_sneakers.jpg';
import womenImg from '../../../assets/images/home/women.jpg';
import menImg from '../../../assets/images/home/men.jpg';
import accessoriesImg from '../../../assets/images/home/accessories.jpg';
import highlightImg from '../../../assets/images/home/highlight.jpg';
import highlightSustainabilityImg from '../../../assets/images/home/highlight_sustainability.jpg';
import highlightDesignImg from '../../../assets/images/home/highlight_design.jpg';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay, ease: [0.25, 0.1, 0.25, 1] },
  }),
};

const heroImages = [heroImg, heroMenImg, heroSneakersImg];

const highlightSlides = [
  {
    image: highlightImg,
    tag: "Craftsmanship",
    heading: "Built to Last",
    text: "Every piece is crafted with intention - premium fabrics, timeless silhouettes, and the kind of detail you feel before you see.",
    linkText: "Shop All",
    href: "/shop"
  },
  {
    image: highlightSustainabilityImg,
    tag: "Sustainability",
    heading: "Thoughtfully Sourced",
    text: "We believe in fashion that leaves a lighter footprint. Organic cottons, recycled materials, and ethical manufacturing.",
    linkText: "Our Mission",
    href: "/shop"
  },
  {
    image: highlightDesignImg,
    tag: "Design",
    heading: "Minimalist by Nature",
    text: "True elegance lies in simplicity. Stripped of excess, our designs focus on what matters most: cut, comfort, and character.",
    linkText: "Explore Design",
    href: "/shop"
  }
];

export default function Home() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentHighlightIndex, setCurrentHighlightIndex] = useState(0);

  const heroRef = useRef(null);
  const highlightRef = useRef(null);
  const isHeroInView = useInView(heroRef, { margin: "0px", amount: 0.5 });
  const isHighlightInView = useInView(highlightRef, { margin: "0px", amount: 0.5 });

  useEffect(() => {
    let heroInterval: ReturnType<typeof setInterval>;
    if (isHeroInView) {
      heroInterval = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
      }, 4000);
    }
    return () => clearInterval(heroInterval);
  }, [isHeroInView]);

  useEffect(() => {
    let highlightInterval: ReturnType<typeof setInterval>;
    if (isHighlightInView) {
      highlightInterval = setInterval(() => {
        setCurrentHighlightIndex((prev) => (prev + 1) % highlightSlides.length);
      }, 3000);
    }
    return () => clearInterval(highlightInterval);
  }, [isHighlightInView]);

  return (
    <>
      <Helmet>
        <title>Wearhaus — Premium Fashion & Lifestyle</title>
        <meta name="description" content="Discover curated fashion collections. Minimal design, premium quality." />
      </Helmet>

      {/* ─── Hero ─────────────────────────────────────────────────────────────── */}
      <section className={styles.hero} ref={heroRef}>
        <div className={styles.heroContent}>
          <motion.span
            className={styles.heroTag}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.1}
          >
            New Season 2026
          </motion.span>
          <motion.h1
            className={styles.heroHeading}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.3}
          >
            Define Your
            <br />
            Elegance
          </motion.h1>
          <motion.p
            className={styles.heroSub}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.5}
          >
            Curated essentials for the modern wardrobe.
          </motion.p>
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.7}
          >
            <Link to="/shop" className={styles.heroCta}>
              Explore Collection <ArrowRight size={16} />
            </Link>
          </motion.div>
        </div>
        <div className={styles.heroImage}>
          <AnimatePresence mode="wait">
            <motion.img
              key={currentImageIndex}
              src={heroImages[currentImageIndex]}
              alt="Fashion editorial"
              className={styles.heroImg}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2 }}
            />
          </AnimatePresence>
        </div>
      </section>

      {/* â”€â”€â”€ Editorial Strip â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <section className={styles.editorial}>
        <motion.p
          className={styles.editorialText}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 1 }}
        >
          Less noise. More intention.
        </motion.p>
      </section>

      {/* â”€â”€â”€ Category Grid â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <section className={styles.categories}>
        <div className={styles.categoryGrid}>
          <CategoryCard
            title="Women"
            href="/shop?gender=Women"
            image={womenImg}
            delay={0.1}
          />
          <CategoryCard
            title="Men"
            href="/shop?gender=Men"
            image={menImg}
            delay={0.2}
          />
          <CategoryCard
            title="Shoes"
            href="/shop?category=Sneakers"
            image={accessoriesImg}
            delay={0.3}
          />
        </div>
      </section>

      {/* ─── Highlight Section -------------------------------------------------- */}
      <section className={styles.highlight} ref={highlightRef}>
        <div className={styles.highlightImage}>
          <AnimatePresence mode="wait">
            <motion.img
              key={currentHighlightIndex}
              src={highlightSlides[currentHighlightIndex]!.image}
              alt="Store ambience"
              className={styles.highlightImg}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
            />
          </AnimatePresence>
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentHighlightIndex}
            className={styles.highlightContent}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <span className={styles.highlightTag}>{highlightSlides[currentHighlightIndex]!.tag}</span>
            <h2 className={styles.highlightHeading}>{highlightSlides[currentHighlightIndex]!.heading}</h2>
            <p className={styles.highlightText}>
              {highlightSlides[currentHighlightIndex]!.text}
            </p>
            <Link to={highlightSlides[currentHighlightIndex]!.href} className={styles.highlightLink}>
              {highlightSlides[currentHighlightIndex]!.linkText} <ArrowRight size={14} />
            </Link>
          </motion.div>
        </AnimatePresence>
      </section>

      {/* â”€â”€â”€ Values Strip â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <section className={styles.values}>
        <div className={styles.valuesGrid}>
          <ValueItem title="Free Shipping" desc="On orders above ₹499" />
          <ValueItem title="Easy Returns" desc="15-day return window" />
          <ValueItem title="Secure Payment" desc="100% protected checkout" />
          <ValueItem title="Premium Quality" desc="Curated with care" />
        </div>
      </section>

      {/* â”€â”€â”€ Newsletter â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <section className={styles.newsletter}>
        <motion.div
          className={styles.newsletterContent}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className={styles.newsletterHeading}>Stay in the Loop</h2>
          <p className={styles.newsletterText}>
            New drops, exclusive offers, and style inspiration — delivered to your inbox.
          </p>
          <form className={styles.newsletterForm} onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              placeholder="Your email address"
              className={styles.newsletterInput}
              aria-label="Email for newsletter"
            />
            <button type="submit" className={styles.newsletterBtn}>
              Subscribe
            </button>
          </form>
        </motion.div>
      </section>
    </>
  );
}

// â”€â”€â”€ Sub-components â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function CategoryCard({ title, href, image, delay }: { title: string; href: string; image: string; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.7, delay, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <Link to={href} className={styles.categoryCard}>
        <div className={styles.categoryImage}>
          <img src={image} alt={title} className={styles.categoryImg} loading="lazy" />
        </div>
        <div className={styles.categoryInfo}>
          <span className={styles.categoryTitle}>{title}</span>
          <ArrowRight size={14} />
        </div>
      </Link>
    </motion.div>
  );
}

function ValueItem({ title, desc }: { title: string; desc: string }) {
  return (
    <div className={styles.valueItem}>
      <h3 className={styles.valueTitle}>{title}</h3>
      <p className={styles.valueDesc}>{desc}</p>
    </div>
  );
}





