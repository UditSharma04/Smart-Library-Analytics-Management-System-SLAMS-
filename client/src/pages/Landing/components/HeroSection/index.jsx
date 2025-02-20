import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import Container from '../../../../components/common/Container'
import Button from '../../../../components/common/Button'
import vitcLogo from '../../../../assets/vitc.jpeg'

export default function HeroSection() {
  const navigate = useNavigate()

  return (
    <section className="relative min-h-screen flex items-center gradient-bg text-white overflow-hidden">
      {/* Top Navigation Bar */}
      <div className="absolute top-0 left-0 w-full bg-white/10 backdrop-blur-sm">
        <Container>
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-3">
              <img 
                src={vitcLogo} 
                alt="VIT Chennai Logo" 
                className="h-12 w-auto"
              />
              <div className="text-2xl font-heading font-bold group relative">
                <span className="bg-gradient-to-r from-yellow-300 via-pink-200 to-cyan-200 bg-clip-text text-transparent animate-gradient cursor-help">
                  SLAMS
                </span>
                {/* Tooltip */}
                <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 w-max opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 bg-white/90 backdrop-blur text-primary px-4 py-2 rounded-lg shadow-lg text-sm">
                  Smart Library Analytics & Management System
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 border-8 border-transparent border-b-white/90"></div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button 
                variant="accent" 
                className="!py-2"
                onClick={() => navigate('/login')}
              >
                Login
              </Button>
            </div>
          </div>
        </Container>
      </div>

      <Container>
        <div className="grid lg:grid-cols-2 gap-12 items-center pt-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="text-sm font-medium text-accent mb-4">
              Deemed to be University under section 3 of UGC Act, 1956
            </div>
            <h1 className="text-5xl md:text-6xl font-heading font-bold mb-6">
              VIT Chennai Library
            </h1>
            <p className="text-xl mb-8 text-gray-200">
              Access the vast resources of VIT Chennai's state-of-the-art library system. 
              Find study spaces, borrow books, and access digital resources with our smart platform.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button 
                variant="accent"
                onClick={() => navigate('/login')}
              >
                Access Library
              </Button>
              <Button variant="outline" className="text-white">
                Browse Catalog
              </Button>
            </div>
          </motion.div>

          <div className="relative">
            <motion.div
              className="stats-card bg-white/10 backdrop-blur-lg rounded-2xl p-6"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              <div className="grid grid-cols-2 gap-6">
                {[
                  { label: 'Available Seats', value: '45' },
                  { label: 'Study Rooms Free', value: '8' },
                  { label: 'Books Available', value: '100k+' },
                  { label: 'Online Journals', value: '50k+' },
                ].map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="stats-value text-3xl font-bold mb-2">{stat.value}</div>
                    <div className="text-sm text-gray-300">{stat.label}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </Container>
    </section>
  )
} 