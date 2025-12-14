'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';

type FadeInSectionProps = {
  children: ReactNode;
  delay?: number;
};

export function FadeInSection({ children, delay = 0 }: FadeInSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, delay }}
    >
      {children}
    </motion.div>
  );
}