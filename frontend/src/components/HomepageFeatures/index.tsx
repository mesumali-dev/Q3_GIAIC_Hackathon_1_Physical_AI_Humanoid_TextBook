import type {ReactNode} from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import Link from '@docusaurus/Link';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  Svg: React.ComponentType<React.ComponentProps<'svg'>>;
  description: ReactNode;
  link: string;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'Module 1: Foundational Robotics',
    Svg: require('@site/static/img/icon_robotics.svg').default,
    description: (
      <>
        Explore the fundamental concepts and building blocks of robotics, from kinematics to control systems.
      </>
    ),
    link: '/docs/module1/chapter1',
  },
  {
    title: 'Module 2: Advanced Simulation',
    Svg: require('@site/static/img/icon_simulation.svg').default,
    description: (
      <>
        Dive into advanced simulation techniques and how robots perceive and interact with their environment.
      </>
    ),
    link: '/docs/module2/chapter1',
  },
  {
    title: 'Module 3: Embodied Intelligence',
    Svg: require('@site/static/img/icon_brain.svg').default,
    description: (
      <>
        Understand how robots learn, adapt, and exhibit intelligent behavior in complex scenarios.
      </>
    ),
    link: '/docs/module3/chapter1',
  },
  {
    title: 'Module 4: Real-World Deployment',
    Svg: require('@site/static/img/icon_deployment.svg').default,
    description: (
      <>
        Learn about the challenges and strategies for deploying robots in real-world applications.
      </>
    ),
    link: '/docs/module4/chapter1',
  },
];

function Feature({title, Svg, description, link}: FeatureItem) {
  return (
    <div className={styles.featureCard}>
      <Link to={link} className={styles.cardLink}>
        <div className={styles.featureSvgContainer}>
          <Svg className={styles.featureSvg} role="img" />
        </div>
        <div className={styles.featureContent}>
          <Heading as="h3" className={styles.featureTitle}>{title}</Heading>
          <p className={styles.featureDescription}>{description}</p>
        </div>
        <div className={styles.cardFooter}>
          <span className={styles.readMore}>Read Module &rarr;</span>
        </div>
      </Link>
    </div>
  );
}

export default function HomepageFeatures(): ReactNode {
  return (
    <section className={styles.features}>
      <div className={styles.container}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionTag}>CURRICULUM</span>
          <Heading as="h2" className={styles.sectionTitle}>
            Core Modules
          </Heading>
          <div className={styles.sectionUnderline}></div>
        </div>
        <div className={styles.featuresRow}>
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}