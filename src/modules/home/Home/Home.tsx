import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router';
import styles from './Home.module.css';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay, ease: [0.25, 0.1, 0.25, 1] },
  }),
};

export default function Home() {
  return (
    <>
      <Helmet>
        <title>STORE — Premium Fashion & Lifestyle</title>
        <meta name="description" content="Discover curated fashion collections. Minimal design, premium quality." />
      </Helmet>

      {/* ─── Hero ─────────────────────────────────────────────────────────────── */}
      <section className={styles.hero}>
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
          <img
            src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200&q=80"
            alt="Fashion editorial"
            className={styles.heroImg}
          />
        </div>
      </section>

      {/* ─── Editorial Strip ──────────────────────────────────────────────────── */}
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

      {/* ─── Category Grid ────────────────────────────────────────────────────── */}
      <section className={styles.categories}>
        <div className={styles.categoryGrid}>
          <CategoryCard
            title="Women"
            href="/shop?gender=Women"
            image="https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=800&q=80"
            delay={0.1}
          />
          <CategoryCard
            title="Men"
            href="/shop?gender=Men"
            image="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80"
            delay={0.2}
          />
          <CategoryCard
            title="Accessories"
            href="/shop"
            image="https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80"
            delay={0.3}
          />
        </div>
      </section>

      {/* ─── Highlight Section ────────────────────────────────────────────────── */}
      <section className={styles.highlight}>
        <div className={styles.highlightImage}>
          <img
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&q=80"
            alt="Store ambience"
            className={styles.highlightImg}
          />
        </div>
        <motion.div
          className={styles.highlightContent}
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <span className={styles.highlightTag}>Craftsmanship</span>
          <h2 className={styles.highlightHeading}>Built to Last</h2>
          <p className={styles.highlightText}>
            Every piece is crafted with intention — premium fabrics, timeless silhouettes,
            and the kind of detail you feel before you see.
          </p>
          <Link to="/shop" className={styles.highlightLink}>
            Shop All <ArrowRight size={14} />
          </Link>
        </motion.div>
      </section>

      {/* ─── Values Strip ─────────────────────────────────────────────────────── */}
      <section className={styles.values}>
        <div className={styles.valuesGrid}>
          <ValueItem title="Free Shipping" desc="On orders above ₹499" />
          <ValueItem title="Easy Returns" desc="15-day return window" />
          <ValueItem title="Secure Payment" desc="100% protected checkout" />
          <ValueItem title="Premium Quality" desc="Curated with care" />
        </div>
      </section>

      {/* ─── Newsletter ───────────────────────────────────────────────────────── */}
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

// ─── Sub-components ──────────────────────────────────────────────────────────

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
