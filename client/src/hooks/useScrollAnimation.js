import { useRef, useState, useCallback } from 'react';
import { motion, useInView, useScroll, useTransform, useSpring, useReducedMotion } from 'framer-motion';

export const useScrollAnimation = (options = {}) => {
  const ref = useRef(null);
  const prefersReducedMotion = useReducedMotion();
  const isInView = useInView(ref, { once: true, margin: options.margin || '-50px' });

  const variants = {
    fadeIn: {
      hidden: { opacity: 0 },
      visible: { opacity: 1 },
    },
    slideUp: {
      hidden: { opacity: 0, y: 40 },
      visible: { opacity: 1, y: 0 },
    },
    slideDown: {
      hidden: { opacity: 0, y: -40 },
      visible: { opacity: 1, y: 0 },
    },
    slideLeft: {
      hidden: { opacity: 0, x: 40 },
      visible: { opacity: 1, x: 0 },
    },
    slideRight: {
      hidden: { opacity: 0, x: -40 },
      visible: { opacity: 1, x: 0 },
    },
    scaleIn: {
      hidden: { opacity: 0, scale: 0.8 },
      visible: { opacity: 1, scale: 1 },
    },
    blurIn: {
      hidden: { opacity: 0, filter: 'blur(10px)' },
      visible: { opacity: 1, filter: 'blur(0px)' },
    },
  };

  const selectedVariant = variants[options.variant] || variants.slideUp;

  return {
    ref,
    initial: prefersReducedMotion ? 'visible' : 'hidden',
    animate: isInView && !prefersReducedMotion ? 'visible' : 'visible',
    variants: {
      ...selectedVariant,
      visible: {
        ...selectedVariant.visible,
        transition: {
          duration: options.duration || 0.6,
          delay: options.delay || 0,
          ease: options.ease || [0.25, 0.46, 0.45, 0.94],
        },
      },
    },
  };
};

export const useStaggeredAnimation = (childrenCount, options = {}) => {
  const prefersReducedMotion = useReducedMotion();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: options.staggerDelay || 0.1,
        delayChildren: options.delay || 0,
      },
    },
  };

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: options.from || 30,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: options.duration || 0.5,
        ease: options.ease || [0.25, 0.46, 0.45, 0.94],
      },
    },
  };

  return {
    containerVariants: prefersReducedMotion ? { hidden: { opacity: 1 }, visible: { opacity: 1 } } : containerVariants,
    itemVariants: prefersReducedMotion ? { hidden: { opacity: 1 }, visible: { opacity: 1 } } : itemVariants,
  };
};

export const useParallax = (speed = 0.5) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  const prefersReducedMotion = useReducedMotion();

  const y = useTransform(
    scrollYProgress,
    [0, 1],
    prefersReducedMotion ? [0, 0] : [0, 300 * speed]
  );

  const scale = useTransform(
    scrollYProgress,
    [0, 1],
    prefersReducedMotion ? [1, 1] : [1, 1.2]
  );

  const opacity = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [1, 0.8, 0]
  );

  return { ref, y, scale, opacity };
};

export const useMagneticEffect = (strength = 0.3) => {
  const ref = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const prefersReducedMotion = useReducedMotion();

  const handleMouseMove = useCallback((e) => {
    if (!ref.current || prefersReducedMotion) return;

    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const deltaX = (e.clientX - centerX) * strength;
    const deltaY = (e.clientY - centerY) * strength;

    setPosition({ x: deltaX, y: deltaY });
  }, [strength, prefersReducedMotion]);

  const handleMouseLeave = useCallback(() => {
    setPosition({ x: 0, y: 0 });
  }, []);

  return {
    ref,
    position,
    onMouseMove: handleMouseMove,
    onMouseLeave: handleMouseLeave,
  };
};

export const useSpringAnimation = (initialValue = 0, config = {}) => {
  const springConfig = {
    stiffness: config.stiffness || 100,
    damping: config.damping || 10,
    restLength: config.restLength || 0,
  };

  const spring = useSpring(initialValue, springConfig);

  return spring;
};

export const AnimatedSection = ({ 
  children, 
  className = '',
  variant = 'slideUp',
  delay = 0,
  duration = 0.6,
  margin = '-50px',
  once = true,
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, margin });
  const prefersReducedMotion = useReducedMotion();

  const animations = {
    fadeIn: {
      hidden: { opacity: 0 },
      visible: { opacity: 1 },
    },
    slideUp: {
      hidden: { opacity: 0, y: 40 },
      visible: { opacity: 1, y: 0 },
    },
    slideDown: {
      hidden: { opacity: 0, y: -40 },
      visible: { opacity: 1, y: 0 },
    },
    scaleIn: {
      hidden: { opacity: 0, scale: 0.9 },
      visible: { opacity: 1, scale: 1 },
    },
  };

  const selectedAnimation = animations[variant] || animations.slideUp;

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView && !prefersReducedMotion ? 'visible' : 'visible'}
      variants={{
        hidden: selectedAnimation.hidden,
        visible: {
          ...selectedAnimation.visible,
          transition: {
            duration,
            delay,
            ease: [0.25, 0.46, 0.45, 0.94],
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export const AnimatedList = ({ 
  children, 
  className = '',
  staggerDelay = 0.1,
  initialDelay = 0,
}) => {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: prefersReducedMotion ? 0 : staggerDelay,
            delayChildren: initialDelay,
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
};

export const AnimatedItem = ({ children, className = '' }) => {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            duration: 0.5,
            ease: [0.25, 0.46, 0.45, 0.94],
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
};

export default useScrollAnimation;