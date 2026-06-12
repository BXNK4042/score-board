'use client';

import { useState, useEffect } from 'react';

/**
 * Animation utilities and variants for ScoreBoard app
 * Provides reusable animation patterns with accessibility support
 */

// ============================================================================
// REDUCED MOTION DETECTION
// ============================================================================

/**
 * Hook to detect user's reduced motion preference
 * Respects accessibility settings for users who prefer reduced motion
 *
 * @returns boolean - true if user prefers reduced motion
 *
 * @example
 * const reducedMotion = useReducedMotion();
 * <motion.div
 *   animate={reducedMotion ? { opacity: 1 } : { scale: 1, opacity: 1 }}
 * />
 */
export const useReducedMotion = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const listener = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
  }, []);

  return prefersReducedMotion;
};

// ============================================================================
// SPRING CONFIGURATION PRESETS
// ============================================================================

/**
 * Spring animation presets for consistent physics-based animations
 * Optimized for mobile touch interactions
 */

export const springPresets = {
  /** Soft, smooth spring for dialog animations */
  smooth: {
    type: 'spring' as const,
    damping: 25,
    stiffness: 300,
  },

  /** Bouncy spring for button feedback */
  bouncy: {
    type: 'spring' as const,
    damping: 17,
    stiffness: 400,
  },

  /** Quick spring for micro-interactions */
  quick: {
    type: 'spring' as const,
    damping: 20,
    stiffness: 500,
  },

  /** Gentle spring for list animations */
  gentle: {
    type: 'spring' as const,
    damping: 20,
    stiffness: 300,
  },

  /** No bounce for drawer expansions */
  noBounce: {
    type: 'spring' as const,
    bounce: 0,
    duration: 0.5,
  },
};

// ============================================================================
// SCREEN TRANSITION VARIANTS
// ============================================================================

/**
 * Screen-to-screen transition variants
 * Used for smooth transitions between Home → Setup → In-Game screens
 */

export const screenTransitionVariants = {
  hidden: {
    opacity: 0,
    x: -100,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      type: 'spring',
      damping: 30,
      stiffness: 300,
      duration: 0.4,
    },
  },
  exit: {
    opacity: 0,
    x: 100,
    transition: {
      type: 'spring',
      damping: 30,
      stiffness: 300,
      duration: 0.4,
    },
  },
};

/**
 * Fade-in-up animation for content appearing from bottom
 */
export const fadeInUpVariants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      damping: 25,
      stiffness: 300,
    },
  },
};

/**
 * Scale-in animation for modals and dialogs
 */
export const scaleInVariants = {
  hidden: {
    opacity: 0,
    scale: 0.95,
    y: 20,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: 'spring',
      damping: 25,
      stiffness: 300,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 20,
    transition: {
      type: 'spring',
      damping: 25,
      stiffness: 300,
    },
  },
};

// ============================================================================
// DIALOG ANIMATION VARIANTS
// ============================================================================

/**
 * Dialog open/close animations with physics-based springs
 */

export const dialogVariants = {
  hidden: {
    opacity: 0,
    scale: 0.9,
    y: 20,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: 'spring',
      damping: 25,
      stiffness: 300,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.9,
    y: 20,
    transition: {
      type: 'spring',
      damping: 25,
      stiffness: 300,
    },
  },
};

/**
 * Bottom sheet/dialog slide-up animation
 */
export const sheetVariants = {
  hidden: {
    y: '100%',
    opacity: 0,
  },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      damping: 25,
      stiffness: 300,
    },
  },
  exit: {
    y: '100%',
    opacity: 0,
    transition: {
      type: 'spring',
      damping: 25,
      stiffness: 300,
    },
  },
};

// ============================================================================
// LIST ITEM ANIMATION VARIANTS
// ============================================================================

/**
 * Staggered list item entrance animations
 * Use with motion.div container and individual list items
 */

export const listContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

export const listItemVariants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      damping: 20,
      stiffness: 300,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.8,
    transition: {
      type: 'spring',
      damping: 20,
      stiffness: 300,
    },
  },
};

// ============================================================================
// BUTTON FEEDBACK VARIANTS
// ============================================================================

/**
 * Button touch feedback configurations
 * Apply to whileHover and whileTap props
 */

export const buttonFeedback = {
  hover: {
    scale: 1.02,
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 17,
    },
  },
  tap: {
    scale: 0.95,
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 17,
    },
  },
};

/**
 * Icon button feedback (smaller scale range)
 */
export const iconButtonFeedback = {
  hover: {
    scale: 1.1,
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 17,
    },
  },
  tap: {
    scale: 0.9,
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 17,
    },
  },
};

// ============================================================================
// SCORE UPDATE ANIMATIONS
// ============================================================================

/**
 * Score change pulse animation
 * Provides visual feedback when scores change
 */

export const scorePulseVariants = {
  increment: {
    scale: [1, 1.2, 1],
    color: ['#22DD66', '#22DD66'],
    transition: {
      type: 'spring',
      damping: 15,
      stiffness: 200,
      times: [0, 0.5, 1],
    },
  },
  decrement: {
    scale: [1, 0.8, 1],
    color: ['#E04040', '#E04040'],
    transition: {
      type: 'spring',
      damping: 15,
      stiffness: 200,
      times: [0, 0.5, 1],
    },
  },
};

/**
 * Leader status pulse animation
 */
export const leaderPulseVariants = {
  pulse: {
    scale: [1, 1.05, 1],
    transition: {
      duration: 0.5,
      times: [0, 0.5, 1],
    },
  },
};

// ============================================================================
// DRAWER ANIMATION VARIANTS
// ============================================================================

/**
 * Smooth drawer expansion animation
 * Used for snooker scoring drawer and other expandable content
 */

export const drawerVariants = {
  collapsed: {
    height: 0,
    opacity: 0,
    transition: {
      type: 'spring',
      bounce: 0,
      duration: 0.5,
    },
  },
  expanded: {
    height: 'auto',
    opacity: 1,
    transition: {
      type: 'spring',
      bounce: 0,
      duration: 0.5,
    },
  },
};

// ============================================================================
// BULK ACTION BAR ANIMATIONS
// ============================================================================

/**
 * Bulk action bar slide-up animation
 */

export const bulkActionBarVariants = {
  hidden: {
    y: 100,
    opacity: 0,
  },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      damping: 25,
      stiffness: 300,
    },
  },
  exit: {
    y: 100,
    opacity: 0,
    transition: {
      type: 'spring',
      damping: 25,
      stiffness: 300,
    },
  },
};

/**
 * Staggered button entrance in bulk action bar
 */
export const bulkActionButtonsVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: 'spring',
      damping: 20,
      stiffness: 300,
    },
  },
};

// ============================================================================
// STAGGER TIMING HELPERS
// ============================================================================

/**
 * Calculate stagger timing for list animations
 *
 * @param itemCount - Number of items in the list
 * @param baseDelay - Base delay in seconds (default: 0.05)
 * @returns stagger timing value
 */
export const calculateStagger = (itemCount: number, baseDelay: number = 0.05) => {
  return Math.min(baseDelay * (itemCount > 10 ? 10 : itemCount), 0.3);
};

/**
 * Create custom stagger variants for specific list sizes
 */
export const createStaggerVariants = (staggerTime: number = 0.1) => ({
  container: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerTime,
      },
    },
  },
  item: {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        damping: 20,
        stiffness: 300,
      },
    },
  },
});

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Check if animations should be disabled based on reduced motion preference
 *
 * @param prefersReducedMotion - User's reduced motion preference
 * @returns Object with animation-safe props
 */
export const getAnimationProps = (prefersReducedMotion: boolean) => {
  if (prefersReducedMotion) {
    return {
      initial: { opacity: 1 },
      animate: { opacity: 1 },
      exit: { opacity: 1 },
      transition: { duration: 0 },
    };
  }

  return {
    // Default animation props (can be overridden)
    transition: {
      type: 'spring',
      damping: 25,
      stiffness: 300,
    },
  };
};

/**
 * Create conditional animation variants based on reduced motion preference
 *
 * @param prefersReducedMotion - User's reduced motion preference
 * @param fullVariants - Full animation variants
 * @returns Safe animation variants
 */
export const createSafeVariants = (
  prefersReducedMotion: boolean,
  fullVariants: Record<string, any>
) => {
  if (prefersReducedMotion) {
    return {
      hidden: { opacity: 1 },
      visible: { opacity: 1 },
      exit: { opacity: 1 },
    };
  }

  return fullVariants;
};