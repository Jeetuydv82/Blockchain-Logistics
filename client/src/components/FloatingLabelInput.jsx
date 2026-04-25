import { useState, useRef, useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

const FloatingLabelInput = ({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  required = false,
  disabled = false,
  className = '',
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null);
  const prefersReducedMotion = useReducedMotion();

  const hasValue = value && value.length > 0;
  const isActive = isFocused || hasValue;

  const shakeAnimation = error ? {
    x: [0, -10, 10, -10, 10, 0],
    transition: { duration: 0.5 }
  } : {};

  useEffect(() => {
    if (error && !prefersReducedMotion) {
      inputRef.current?.focus();
    }
  }, [error, prefersReducedMotion]);

  return (
    <div className={`relative ${className}`}>
      <motion.div
        animate={error ? shakeAnimation : {}}
        className="relative"
      >
        <motion.input
          ref={inputRef}
          type={type}
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          disabled={disabled}
          className={`
            w-full pt-7 pb-3 px-4 pr-10
            bg-[var(--input-bg)] border rounded-xl
            text-[var(--input-text)] text-base
            outline-none transition-all duration-300
            ${error 
              ? 'border-danger focus:border-danger' 
              : 'border-[var(--input-border)] focus:border-primary'
            }
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          `}
          style={{
            boxShadow: isFocused && !error 
              ? '0 0 15px rgba(94, 92, 230, 0.2)' 
              : error 
                ? '0 0 15px rgba(255, 69, 58, 0.2)'
                : 'none',
          }}
          {...props}
        />

        <motion.label
          animate={{
            y: isActive ? -24 : 0,
            scale: isActive ? 0.85 : 1,
            color: error
              ? 'var(--danger)'
              : isFocused
                ? 'var(--primary)'
                : 'var(--text-secondary)',
          }}
          transition={{ duration: 0.2, ease: [0.25, 0.8, 0.25, 1] }}
          className="absolute left-4 top-6 origin-left pointer-events-none font-medium"
        >
          {label}
          {required && <span className="text-danger ml-1">*</span>}
        </motion.label>

        <motion.div
          className="absolute bottom-0 left-1/2 h-[2px] bg-gradient-to-r from-primary to-accent"
          initial={{ width: 0, x: '-50%' }}
          animate={{
            width: isFocused ? '100%' : 0,
            x: isFocused ? '-50%' : '-50%',
          }}
          transition={{ duration: 0.3, ease: [0.25, 0.8, 0.25, 1] }}
        />

        {error && (
          <motion.span
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-danger text-sm"
          >
            {error}
          </motion.span>
        )}
      </motion.div>

      {error && (
        <motion.p
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="text-danger text-xs mt-1 ml-1"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
};

export default FloatingLabelInput;