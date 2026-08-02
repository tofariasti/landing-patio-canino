import { type ReactNode } from 'react'
import { motion, type Variants } from 'framer-motion'
import { useReducedMotion } from '../../hooks/useReducedMotion'

interface AnimatedSectionProps {
  children: ReactNode
  className?: string
  delay?: number
  id?: string
  /** Enable stagger for direct motion children using itemVariants */
  stagger?: boolean
}

const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 36 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
  },
}

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.06,
    },
  },
}

export const itemVariants: Variants = {
  hidden: { opacity: 0, y: 22 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
}

export function AnimatedSection({
  children,
  className,
  delay = 0,
  id,
  stagger = false,
}: AnimatedSectionProps) {
  const reducedMotion = useReducedMotion()

  if (reducedMotion) {
    return (
      <section id={id} className={className}>
        {children}
      </section>
    )
  }

  return (
    <motion.section
      id={id}
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-72px' }}
      variants={stagger ? staggerContainer : sectionVariants}
      transition={stagger ? undefined : { duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.section>
  )
}

interface FadeInProps {
  children: ReactNode
  className?: string
  delay?: number
}

export function FadeIn({ children, className, delay = 0 }: FadeInProps) {
  const reducedMotion = useReducedMotion()

  if (reducedMotion) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}

interface StaggerItemProps {
  children: ReactNode
  className?: string
  as?: 'div' | 'li' | 'article' | 'blockquote'
}

export function StaggerItem({ children, className, as = 'div' }: StaggerItemProps) {
  const reducedMotion = useReducedMotion()
  const Component = motion[as]

  if (reducedMotion) {
    const Tag = as
    return <Tag className={className}>{children}</Tag>
  }

  return (
    <Component className={className} variants={itemVariants}>
      {children}
    </Component>
  )
}

interface StaggerGroupProps {
  children: ReactNode
  className?: string
  as?: 'div' | 'ul' | 'ol'
}

export function StaggerGroup({ children, className, as = 'div' }: StaggerGroupProps) {
  const reducedMotion = useReducedMotion()
  const Component = motion[as]

  if (reducedMotion) {
    const Tag = as
    return <Tag className={className}>{children}</Tag>
  }

  return (
    <Component
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
      variants={staggerContainer}
    >
      {children}
    </Component>
  )
}
