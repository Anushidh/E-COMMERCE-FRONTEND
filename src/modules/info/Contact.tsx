import { Helmet } from 'react-helmet-async';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';
import { Button, Input } from '@shared/components';
import styles from './Info.module.css';

export default function Contact() {
  return (
    <>
      <Helmet><title>Contact Us — STORE</title></Helmet>
      <div className={styles.page}>
        <div className={styles.hero}>
          <h1 className={styles.title}>Get in Touch</h1>
          <p className={styles.subtitle}>
            Have a question, feedback, or need help with an order? We're here for you.
          </p>
        </div>

        <div className={styles.contactGrid}>
          {/* Contact Info */}
          <div className={styles.contactInfo}>
            <div className={styles.contactItem}>
              <div className={styles.contactItemIcon}><Mail size={16} /></div>
              <div className={styles.contactItemText}>
                <span className={styles.contactItemLabel}>Email</span>
                <span className={styles.contactItemValue}>support@store.com</span>
              </div>
            </div>
            <div className={styles.contactItem}>
              <div className={styles.contactItemIcon}><Phone size={16} /></div>
              <div className={styles.contactItemText}>
                <span className={styles.contactItemLabel}>Phone</span>
                <span className={styles.contactItemValue}>+91 98765 43210</span>
              </div>
            </div>
            <div className={styles.contactItem}>
              <div className={styles.contactItemIcon}><MapPin size={16} /></div>
              <div className={styles.contactItemText}>
                <span className={styles.contactItemLabel}>Address</span>
                <span className={styles.contactItemValue}>123 Fashion Street, Kochi, Kerala 682001</span>
              </div>
            </div>
            <div className={styles.contactItem}>
              <div className={styles.contactItemIcon}><Clock size={16} /></div>
              <div className={styles.contactItemText}>
                <span className={styles.contactItemLabel}>Hours</span>
                <span className={styles.contactItemValue}>Mon – Sat, 9:00 AM – 6:00 PM IST</span>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
            <Input label="Name" placeholder="Your name" />
            <Input label="Email" type="email" placeholder="you@example.com" />
            <div className={styles.section}>
              <label className={styles.sectionTitle} style={{ fontSize: 'var(--text-sm)' }}>Message</label>
              <textarea
                className={styles.textarea}
                placeholder="How can we help you?"
                rows={5}
              />
            </div>
            <Button type="submit" fullWidth size="lg">
              Send Message
            </Button>
          </form>
        </div>
      </div>
    </>
  );
}
