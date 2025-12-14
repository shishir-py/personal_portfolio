'use client';

import { motion } from 'framer-motion';

type NepalFlagWaveProps = {
  width: number;
  height: number;
};

export function NepalFlagWave({ width, height }: NepalFlagWaveProps) {
  return (
    <motion.div
      className="flag-wave"
      style={{ width, height }}
    >
      <svg
        width={width}
        height={height}
        viewBox="0 0 17 21"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Border */}
        <path
          d="M0.5 0.5H16.5V12.5L8.5 8.5L16.5 20.5H0.5V0.5Z"
          stroke="#003893"
          strokeWidth="1"
        />
        {/* Main flag shape */}
        <path
          d="M1 1H16V12L8 8L16 20H1V1Z"
          fill="#003893"
        />
        {/* Moon */}
        <path
          d="M8 4C8 5.65685 6.65685 7 5 7C3.34315 7 2 5.65685 2 4C2 2.34315 3.34315 1 5 1"
          stroke="#C8102E"
          strokeWidth="2"
        />
        {/* Sun */}
        <path
          d="M8 15C8 16.6569 6.65685 18 5 18C3.34315 18 2 16.6569 2 15C2 13.3431 3.34315 12 5 12"
          stroke="#C8102E"
          strokeWidth="2"
        />
      </svg>
    </motion.div>
  );
}