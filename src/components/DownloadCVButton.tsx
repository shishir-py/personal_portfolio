'use client';

import { FaDownload } from 'react-icons/fa';
import { motion } from 'framer-motion';

export function DownloadCVButton() {
  return (
    <motion.a
      href="/tara_prasad_cv.pdf"
      download="Tara_Prasad_Pandey_CV.pdf"
      className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary-600 text-white hover:bg-primary-700 transition-colors"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <FaDownload />
      Download CV
    </motion.a>
  );
}