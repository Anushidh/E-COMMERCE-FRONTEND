import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router';
import { Button } from '@shared/components';
import styles from './NotFound.module.css';

export default function NotFound() {
  return (
    <>
      <Helmet><title>Page Not Found — Wearhaus</title></Helmet>
      <div className={styles.page}>
        <span className={styles.code}>404</span>
        <h1 className={styles.title}>Page not found</h1>
        <p className={styles.text}>The page you're looking for doesn't exist or has been moved.</p>
        <Link to="/"><Button size="lg">Go Home</Button></Link>
      </div>
    </>
  );
}
