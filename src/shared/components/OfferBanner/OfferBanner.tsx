import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';
import { offersService } from '@/services/offers.service';
import styles from './OfferBanner.module.css';

export function OfferBanner() {
  const { data: offersData } = useQuery({
    queryKey: ['active-offers'],
    queryFn: offersService.getActiveOffers,
  });

  const [currentIndex, setCurrentIndex] = useState(0);

  const productOffers = offersData?.productOffers || [];
  const categoryOffers = offersData?.categoryOffers || [];
  
  const allOffers = [
    ...productOffers.map((offer) => ({
      id: offer._id,
      text: `Get ${offer.discountType === 'percentage' ? `${offer.discountValue}%` : `₹${offer.discountValue}`} off on ${offer.product.name}!`,
      link: `/shop/${offer.product.slug}`,
    })),
    ...categoryOffers.map((offer) => ({
      id: offer._id,
      text: `Special offer: ${offer.discountType === 'percentage' ? `${offer.discountValue}%` : `₹${offer.discountValue}`} off on all ${offer.category.name}!`,
      link: `/shop?category=${offer.category._id}`,
    })),
  ];

  useEffect(() => {
    if (allOffers.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % allOffers.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [allOffers.length]);

  if (allOffers.length === 0) return null;

  const currentOffer = allOffers[currentIndex];
  if (!currentOffer) return null;

  return (
    <div className={styles.banner}>
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.3 }}
          className={styles.textWrapper}
        >
          <span>{currentOffer.text}</span>
          <Link to={currentOffer.link} className={styles.link}>
            Shop Now
          </Link>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
