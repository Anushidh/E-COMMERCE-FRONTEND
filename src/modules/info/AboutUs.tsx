import { Helmet } from 'react-helmet-async';
import { Heart, Truck, ShieldCheck, Sparkles } from 'lucide-react';
import styles from './Info.module.css';

export default function AboutUs() {
  return (
    <>
      <Helmet><title>About Us — STORE</title></Helmet>
      <div className={styles.page}>
        <div className={styles.hero}>
          <h1 className={styles.title}>About STORE</h1>
          <p className={styles.subtitle}>
            We believe great style should be accessible, sustainable, and effortless. That's why we curate collections that blend quality craftsmanship with modern design.
          </p>
        </div>

        <div className={styles.content}>
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Our Story</h2>
            <p className={styles.text}>
              STORE was born from a simple idea: fashion shopping should be joyful, not overwhelming. We started as a small team of style enthusiasts frustrated with endless scrolling through low-quality products. So we built something different — a curated marketplace where every piece is handpicked for quality, fit, and value.
            </p>
            <p className={styles.text}>
              Today, we serve thousands of customers across India, bringing them carefully selected fashion that looks good, feels good, and lasts. We partner directly with trusted manufacturers to cut out middlemen and pass the savings to you.
            </p>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>What We Stand For</h2>
            <div className={styles.valuesGrid}>
              <div className={styles.valueCard}>
                <div className={styles.valueCardIcon}><Heart size={18} /></div>
                <span className={styles.valueCardTitle}>Curated Quality</span>
                <span className={styles.valueCardDesc}>Every product is reviewed for material quality, stitching, and durability before it reaches our store.</span>
              </div>
              <div className={styles.valueCard}>
                <div className={styles.valueCardIcon}><Truck size={18} /></div>
                <span className={styles.valueCardTitle}>Fast Delivery</span>
                <span className={styles.valueCardDesc}>Free shipping on orders above ₹499 with reliable delivery partners across India.</span>
              </div>
              <div className={styles.valueCard}>
                <div className={styles.valueCardIcon}><ShieldCheck size={18} /></div>
                <span className={styles.valueCardTitle}>Trust & Transparency</span>
                <span className={styles.valueCardDesc}>Honest pricing, no hidden fees. What you see is what you pay.</span>
              </div>
              <div className={styles.valueCard}>
                <div className={styles.valueCardIcon}><Sparkles size={18} /></div>
                <span className={styles.valueCardTitle}>Fresh Drops Weekly</span>
                <span className={styles.valueCardDesc}>New arrivals added every week to keep your wardrobe current and exciting.</span>
              </div>
            </div>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Our Promise</h2>
            <p className={styles.text}>
              We're committed to making your shopping experience seamless from browse to doorstep. If something doesn't meet your expectations, our hassle-free return process has you covered. Your satisfaction isn't just a policy — it's the reason we exist.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
