import { motion } from 'framer-motion'

const spaces = [
  { id: 'A1', type: 'Quiet Zone', available: 15, total: 20 },
  { id: 'B1', type: 'Group Study', available: 3, total: 8 },
  { id: 'C1', type: 'Computer Lab', available: 10, total: 15 },
  { id: 'D1', type: 'Reading Area', available: 25, total: 30 }
]

export default function LibrarySpace() {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-heading font-semibold text-gray-800">
          Library Spaces
        </h2>
        <button className="text-sm text-primary hover:text-primary-dark">
          Book a Space
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {spaces.map((space, index) => (
          <motion.div
            key={space.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="bg-gray-50 rounded-lg p-4"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">
                {space.type}
              </span>
              <span className="text-xs font-mono bg-primary/10 text-primary px-2 py-1 rounded-full">
                {space.id}
              </span>
            </div>
            <div className="space-y-2">
              <div className="text-2xl font-mono font-semibold text-gray-800">
                {space.available}/{space.total}
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-500"
                  style={{ 
                    width: `${(space.available / space.total) * 100}%` 
                  }}
                />
              </div>
              <p className="text-xs text-gray-500">
                {space.available} spaces available
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
} 