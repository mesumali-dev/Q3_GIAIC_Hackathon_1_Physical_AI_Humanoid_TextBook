import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import AuthorSection from '@site/src/components/AuthorSection';
import Heading from '@theme/Heading';

import styles from './index.module.css';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={styles.heroBanner}>
      <div className={styles.heroContainer}>
        
        {/* Centered Content */}
        <div className={styles.heroContent} style={{textAlign: 'center', margin: '0 auto', maxWidth: '800px'}}>
          <Heading as="h1" className={styles.heroTitle} style={{fontSize: '4rem', marginBottom: '1.5rem'}}>
            {siteConfig.title}
          </Heading>
          <p className={styles.heroDescription} style={{margin: '0 auto 2.5rem auto', fontSize: '1.2rem'}}>
            Explore quality knowledge for your engineering needs. Read smart. Build better.
          </p>
          <div className={styles.buttons} style={{justifyContent: 'center'}}>
            <Link
              className={clsx("button button--primary button--lg", styles.buttonHero)}
              to="/docs/intro">
              Explore over latest research
            </Link>
          </div>
        </div>

      </div>
    </header>
  );
}

export default function Home(): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`${siteConfig.title}`}
      description="A comprehensive guide to Physical AI and Humanoid Robotics">
      <HomepageHeader />
      <main>
        <HomepageFeatures />
        <AuthorSection />
      </main>
    </Layout>
  );
}
