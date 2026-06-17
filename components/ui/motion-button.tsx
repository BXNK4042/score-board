'use client';

import * as React from 'react';
import { motion, TargetAndTransition, Transition } from 'framer-motion';
import { Button, ButtonProps } from '@/components/ui/button';
import { buttonFeedback, iconButtonFeedback, useReducedMotion } from '@/lib/animations';
import { cn } from '@/lib/utils';

/**
 * MotionButton - Enhanced button component with physics-based touch feedback
 * Wraps the existing Button component with framer-motion capabilities
 *
 * @example
 * <MotionButton>Click me</MotionButton>
 * <MotionButton variant="outline" motionType="icon">Icon Button</MotionButton>
 */

export interface MotionButtonProps extends ButtonProps {
  /** Type of motion feedback to apply */
  motionType?: 'default' | 'icon' | 'none';
  /** Custom motion feedback configuration */
  customMotion?: {
    whileHover?: TargetAndTransition | string;
    whileTap?: TargetAndTransition | string;
    transition?: Transition;
  };
}

const MotionButton = React.forwardRef<HTMLButtonElement, MotionButtonProps>(
  ({ className, variant, size, motionType = 'default', customMotion, ...props }, ref) => {
    const prefersReducedMotion = useReducedMotion();

    // Apply motion feedback based on type
    const getMotionProps = () => {
      if (motionType === 'none' || prefersReducedMotion) {
        return {};
      }

      if (customMotion) {
        return {
          whileHover: customMotion.whileHover,
          whileTap: customMotion.whileTap,
          transition: customMotion.transition,
        };
      }

      if (motionType === 'icon') {
        return {
          whileHover: iconButtonFeedback.hover,
          whileTap: iconButtonFeedback.tap,
        };
      }

      // Default motion feedback
      return {
        whileHover: buttonFeedback.hover,
        whileTap: buttonFeedback.tap,
      };
    };

    const motionProps = getMotionProps();

    return (
      <motion.div
        className={cn('inline-flex')}
        whileHover={motionProps.whileHover}
        whileTap={motionProps.whileTap}
        transition={motionProps.transition}
      >
        <Button
          ref={ref}
          className={cn(className)}
          variant={variant}
          size={size}
          {...props}
        />
      </motion.div>
    );
  }
);

MotionButton.displayName = 'MotionButton';

export { MotionButton };