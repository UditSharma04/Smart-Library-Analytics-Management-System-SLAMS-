import { motion } from 'framer-motion'
import { useState } from 'react'
import Container from '../../../../components/common/Container'
import { MapPinIcon, BookOpenIcon, ArrowPathIcon, ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/24/outline'

const floors = [
  {
    id: 3,
    name: '3rd Floor - Law Section',
    image: '/floor3.jpg',
    hotspots: [
      {
        id: 'A1',
        x: 27,
        y: 33,
        label: 'Law Section A1',
        books: '1,000+ Books',
        categories: ['Constitutional Law', 'Criminal Law', 'Civil Law']
      },
      {
        id: 'A2',
        x: 37,
        y: 33,
        label: 'Law Section A2',
        books: '800+ Books',
        categories: ['International Law', 'Human Rights', 'Maritime Law']
      },
      {
        id: 'B1',
        x:47,
        y: 33,
        label: 'Law Section B1',
        books: '1,200+ Books',
        categories: ['Corporate Law', 'Business Law', 'Tax Law']
      },
      {
        id: 'B2',
        x: 57,
        y: 33,
        label: 'Law Section B2',
        books: '900+ Books',
        categories: ['Environmental Law', 'Labor Law', 'Patent Law']
      },
      {
        id: 'C1',
        x: 37,
        y: 53,
        label: 'Law Journals',
        books: '500+ Journals',
        categories: ['Law Reviews', 'Legal Periodicals', 'Case Reports']
      },
      {
        id: 'C2',
        x: 47,
        y: 53,
        label: 'Moot Court',
        books: 'Reference Section',
        categories: ['Case Studies', 'Legal Documents', 'Court Procedures']
      }
    ]
  },
  {
    id: 2,
    name: '2nd Floor - Computer Science',
    image: '/floor2.jpg',
    hotspots: [
      {
        id: 'A1',
        x: 48,
        y: 39,
        label: 'CS Section A1',
        books: '1,500+ Books',
        categories: ['Programming', 'Data Structures', 'Algorithms']
      },
      {
        id: 'A2',
        x: 55,
        y: 39,
        label: 'CS Section A2',
        books: '1,200+ Books',
        categories: ['Web Development', 'Mobile Apps', 'Cloud Computing']
      },
      {
        id: 'B1',
        x: 62,
        y: 39,
        label: 'CS Section B1',
        books: '1,000+ Books',
        categories: ['Database Systems', 'Networks', 'Operating Systems']
      },
      {
        id: 'B2',
        x: 69,
        y: 39,
        label: 'CS Section B2',
        books: '800+ Books',
        categories: ['AI', 'Machine Learning', 'Data Science']
      },
      {
        id: 'C1',
        x: 69,
        y: 54,
        label: 'Technical References',
        books: '600+ Books',
        categories: ['IEEE Standards', 'Technical Manuals', 'Documentation']
      },
      {
        id: 'C2',
        x: 62,
        y: 54,
        label: 'CS Journals',
        books: '400+ Journals',
        categories: ['Research Papers', 'Conference Proceedings', 'Tech Magazines']
      }
    ]
  },
  {
    id: 1,
    name: '1st Floor',
    image: '/floor1.jpg',
    hotspots: [
      {
        id: 'A1',
        x: 51,
        y: 43,
        label: 'Engineering A1',
        books: '1,300+ Books',
        categories: ['Mechanical', 'Civil', 'Industrial']
      },
      {
        id: 'A2',
        x: 57,
        y: 43,
        label: 'Engineering A2',
        books: '1,100+ Books',
        categories: ['Electronics', 'Electrical', 'Communication']
      },
      {
        id: 'B1',
        x: 63,
        y: 43,
        label: 'Engineering B1',
        books: '900+ Books',
        categories: ['Chemical', 'Biotechnology', 'Materials']
      },
      {
        id: 'B2',
        x: 69,
        y: 43,
        label: 'Engineering B2',
        books: '700+ Books',
        categories: ['Robotics', 'Automation', 'Control Systems']
      }
    ]
  },
  {
    id: 0,
    name: 'Ground Floor',
    image: '/floor0.jpg',
    hotspots: [
      {
        id: 'A1',
        x: 20,
        y: 30,
        label: 'General Section A1',
        books: '1,000+ Books',
        categories: ['Literature', 'Fiction', 'Poetry']
      },
      {
        id: 'A2',
        x: 35,
        y: 30,
        label: 'General Section A2',
        books: '800+ Books',
        categories: ['History', 'Geography', 'Social Sciences']
      },
      {
        id: 'B1',
        x: 20,
        y: 50,
        label: 'General Section B1',
        books: '700+ Books',
        categories: ['Arts', 'Music', 'Photography']
      },
      {
        id: 'B2',
        x: 35,
        y: 50,
        label: 'General Section B2',
        books: '500+ Books',
        categories: ['Self-Help', 'Career Guidance', 'Competitive Exams']
      },
      {
        id: 'Help',
        x: 60,
        y: 40,
        label: 'Help Desk',
        books: 'Information Center',
        categories: ['Assistance', 'Book Location', 'Library Cards']
      }
    ]
  }
]

export default function NavigationPreview() {
  const [activeFloor, setActiveFloor] = useState(floors[0])
  const [activeHotspot, setActiveHotspot] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleHotspotClick = (hotspot) => {
    setIsLoading(true)
    setActiveHotspot(hotspot)
    setTimeout(() => setIsLoading(false), 800)
  }

  const handleFloorChange = (direction) => {
    const currentIndex = floors.findIndex(floor => floor.id === activeFloor.id)
    let newIndex
    
    if (direction === 'up' && currentIndex > 0) {
      newIndex = currentIndex - 1
    } else if (direction === 'down' && currentIndex < floors.length - 1) {
      newIndex = currentIndex + 1
    } else {
      return
    }

    setActiveFloor(floors[newIndex])
    setActiveHotspot(null)
  }

  return (
    <section className="section-padding bg-gray-50">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-heading font-bold text-primary mb-4">
            Smart Navigation System
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Find any book in seconds with our interactive map and smart navigation
          </p>
        </motion.div>

        <div className="relative max-w-2xl mx-auto">
          {/* Floor Controls */}
          <div className="absolute left-2 top-1/2 -translate-y-1/2 flex flex-col gap-2 z-10">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleFloorChange('up')}
              disabled={activeFloor.id === 3}
              className={`p-1.5 rounded-full bg-white/80 backdrop-blur-sm shadow-md ${
                activeFloor.id === 3 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'
              }`}
            >
              <ChevronUpIcon className="w-4 h-4 text-primary" />
            </motion.button>
            <div className="bg-white/80 backdrop-blur-sm px-2 py-1 rounded-md shadow-md text-primary text-xs font-medium">
              F{activeFloor.id}
            </div>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleFloorChange('down')}
              disabled={activeFloor.id === 0}
              className={`p-1.5 rounded-full bg-white/80 backdrop-blur-sm shadow-md ${
                activeFloor.id === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'
              }`}
            >
              <ChevronDownIcon className="w-4 h-4 text-primary" />
            </motion.button>
          </div>

          {/* Library Map */}
          <div className="relative rounded-2xl overflow-hidden shadow-2xl h-[400px]">
            <motion.img 
              key={activeFloor.id}
              src={activeFloor.image}
              alt={`${activeFloor.name} Layout`}
              className="w-full h-full object-contain"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            />
            
            {/* Interactive Hotspots */}
            {activeFloor.hotspots.map((hotspot) => (
              <motion.button
                key={hotspot.id}
                className={`absolute w-6 h-6 rounded-full ${
                  activeHotspot?.id === hotspot.id 
                    ? 'bg-primary' 
                    : 'bg-white'
                } shadow-lg flex items-center justify-center cursor-pointer
                hover:scale-110 transition-transform`}
                style={{ 
                  left: `${hotspot.x}%`, 
                  top: `${hotspot.y}%`,
                  transform: 'translate(-50%, -50%)'
                }}
                onClick={() => handleHotspotClick(hotspot)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <MapPinIcon 
                  className={`w-4 h-4 ${
                    activeHotspot?.id === hotspot.id 
                      ? 'text-white' 
                      : 'text-primary'
                  }`} 
                />
              </motion.button>
            ))}
          </div>

          {/* Section Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ 
              opacity: activeHotspot ? 1 : 0,
              y: activeHotspot ? 0 : 20
            }}
            className="absolute right-4 top-4 w-72 bg-white/90 backdrop-blur-sm 
            rounded-xl shadow-lg p-4 border border-gray-100"
          >
            {activeHotspot && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-heading font-semibold text-primary">
                    {activeHotspot.label}
                  </h3>
                  {isLoading ? (
                    <ArrowPathIcon className="w-5 h-5 text-primary animate-spin" />
                  ) : (
                    <BookOpenIcon className="w-5 h-5 text-primary" />
                  )}
                </div>
                <p className="text-sm text-gray-600">{activeHotspot.books}</p>
                <div className="flex flex-wrap gap-2">
                  {activeHotspot.categories.map((category, index) => (
                    <span 
                      key={index}
                      className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full"
                    >
                      {category}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </motion.div>

          {/* Feature Highlights */}
          <div className="grid grid-cols-3 gap-6 mt-8">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-white rounded-xl p-4 shadow-sm"
            >
              <div className="text-primary mb-2">
                <MapPinIcon className="w-6 h-6" />
              </div>
              <h3 className="font-heading font-semibold mb-2">
                Floor Navigation
              </h3>
              <p className="text-sm text-gray-600">
                Explore all floors with interactive controls
              </p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-white rounded-xl p-4 shadow-sm"
            >
              <div className="text-primary mb-2">
                <BookOpenIcon className="w-6 h-6" />
              </div>
              <h3 className="font-heading font-semibold mb-2">
                Section Details
              </h3>
              <p className="text-sm text-gray-600">
                View books and categories in each section
              </p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-white rounded-xl p-4 shadow-sm"
            >
              <div className="text-primary mb-2">
                <ArrowPathIcon className="w-6 h-6" />
              </div>
              <h3 className="font-heading font-semibold mb-2">
                Live Updates
              </h3>
              <p className="text-sm text-gray-600">
                Real-time availability tracking
              </p>
            </motion.div>
          </div>
        </div>
      </Container>
    </section>
  )
} 