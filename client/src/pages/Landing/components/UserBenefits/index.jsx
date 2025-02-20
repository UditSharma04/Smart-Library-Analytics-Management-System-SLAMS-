import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import Container from '../../../../components/common/Container'

const benefits = [
  {
    stat: '24/7',
    label: 'Digital Access',
    description: 'Access library resources anytime, anywhere'
  },
  {
    stat: '2 min',
    label: 'Quick Checkout',
    description: 'Fast self-service book borrowing'
  },
  {
    stat: '100+',
    label: 'Study Spaces',
    description: 'Find your perfect study spot'
  },
  {
    stat: '50k+',
    label: 'Digital Resources',
    description: 'E-books, journals, and research papers'
  }
]

export default function UserBenefits() {
  const sectionRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  })

  const y = useTransform(scrollYProgress, [0, 1], [100, -100])

  return (
    <section ref={sectionRef} className="section-padding bg-primary relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }} />
      </div>

      <Container>
        <div className="text-center text-white mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-heading font-bold mb-4"
          >
            Enhance Your Study Experience
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-white/80 max-w-2xl mx-auto"
          >
            Modern solutions for modern students
          </motion.p>
        </div>

        <motion.div 
          style={{ y }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/10 backdrop-blur rounded-2xl p-6 text-white"
            >
              <div className="stats-value text-5xl font-bold mb-2">
                {benefit.stat}
              </div>
              <h3 className="text-xl font-heading font-semibold mb-2">
                {benefit.label}
              </h3>
              <p className="text-white/80">
                {benefit.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </section>
  )
} 