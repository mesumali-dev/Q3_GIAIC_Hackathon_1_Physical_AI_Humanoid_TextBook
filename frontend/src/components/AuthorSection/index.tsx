import type {ReactNode} from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

export default function AuthorSection(): ReactNode {
  return (
    <section className={styles.authorSection}>
      <div className={styles.container}>
        <div className={styles.contentWrapper}>
          <div className={styles.textColumn}>
            <span className={styles.sectionTag}>About the Author</span>
            <Heading as="h2" className={styles.authorName}>
              Syed Mesum Ali Shah
            </Heading>
            <div className={styles.authorTitle}>
              Physical AI & Humanoid Robotics Specialist
            </div>
            
            <p className={styles.bio}>
              Syed Mesum Ali Shah is a visionary in the field of embodied intelligence, dedicated to advancing the capabilities of humanoid robotics. His work bridges the gap between complex algorithmic control and practical mechanical implementation, providing a foundational roadmap for the future of autonomous systems.
            </p>

            <div className={styles.signature}>
              Mesum Ali
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}