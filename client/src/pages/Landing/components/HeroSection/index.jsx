import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import Container from '../../../../components/common/Container'
import Button from '../../../../components/common/Button'
import vitcLogo from '../../../../assets/vitc.jpeg'
import { QrCodeIcon, ChartBarIcon } from '@heroicons/react/24/outline'

export default function HeroSection() {
  const navigate = useNavigate()

  return (
    <section className="min-h-[90vh] bg-gradient-to-br from-primary to-blue-900 text-white relative overflow-hidden">
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }} />
      </div>

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
        <div className="grid lg:grid-cols-2 gap-12 items-center pt-20 my-7">
          {/* Hero Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="text-sm font-medium text-accent mb-4">
              VIT Chennai Library System
            </div>
            <h1 className="text-5xl md:text-6xl font-heading font-bold mb-6">
              Smart Library
              <span className="block text-accent">Management System</span>
            </h1>
            <p className="text-xl mb-8 text-gray-200">
              Experience the future of library management with our AI-powered system. 
              Seamless checkouts, real-time space tracking, and instant access to resources.
            </p>
            <div className="flex items-center gap-4">
              <Button 
                variant="accent" 
                className="!py-2 w-full"
                onClick={() => navigate('/login')}
              >
                Get Started
              </Button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-6 mt-12">
              {[
                { value: '50,000+', label: 'Resources' },
                { value: '1,000+', label: 'Daily Users' },
                { value: '24/7', label: 'Access' }
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  className="text-center"
                >
                  <div className="text-2xl font-bold text-accent">{stat.value}</div>
                  <div className="text-sm text-gray-300">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Hero Image/Animation */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="aspect-square bg-white/10 rounded-2xl p-8 backdrop-blur-sm relative overflow-hidden">
              {/* 3D Library Grid */}
              <div className="grid grid-cols-3 grid-rows-3 gap-4 h-full">
                {Array.from({ length: 9 }).map((_, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className="relative"
                  >
                    <div className="absolute inset-0 bg-white/5 rounded-lg transform rotate-3 scale-105" />
                    <div className="relative bg-white/10 rounded-lg h-full p-4">
                      {/* Book Shelf Animation */}
                      <div className="flex flex-col h-full justify-end space-y-1">
                        {Array.from({ length: 4 }).map((_, bookIndex) => (
                          <motion.div
                            key={bookIndex}
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: 1 }}
                            transition={{ delay: 0.5 + index * 0.1 + bookIndex * 0.1 }}
                            className="h-2 bg-accent/20 rounded-full origin-left"
                          />
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Floating Elements */}
              <motion.div
                animate={{
                  y: [0, -10, 0],
                  rotate: [0, 5, 0]
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute top-1/4 right-1/4 w-12 h-12 bg-accent/20 rounded-lg backdrop-blur-sm"
              >
                <QrCodeIcon className="w-8 h-8 text-accent m-2" />
              </motion.div>

              <motion.div
                animate={{
                  y: [0, 10, 0],
                  rotate: [0, -5, 0]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1
                }}
                className="absolute bottom-1/4 left-1/4 w-12 h-12 bg-primary/20 rounded-lg backdrop-blur-sm"
              >
                <ChartBarIcon className="w-8 h-8 text-primary m-2" />
              </motion.div>

              {/* Connection Lines */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                <motion.path
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 2, delay: 1 }}
                  d="M 50% 50% L 75% 25%"
                  className="stroke-accent/20"
                  strokeWidth="2"
                  fill="none"
                />
                <motion.path
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 2, delay: 1.5 }}
                  d="M 50% 50% L 25% 75%"
                  className="stroke-primary/20"
                  strokeWidth="2"
                  fill="none"
                />
              </svg>
            </div>

            {/* Live Stats Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2 }}
              className="absolute -right-12 top-1/2 -translate-y-1/2 bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-sm text-white/80">234 Active Users</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                  <span className="text-sm text-white/80">85% Occupancy</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </Container>
    </section>
  )
} 