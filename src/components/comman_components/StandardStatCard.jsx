import React from 'react'

const StandardStatCard = ({ name, icon: Icon, value, color }) => {
    return (
        <div className='bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200 hover:shadow-md transition-all duration-300 relative group'>
            {/* Multicolored Left Side Corner */}
            <div 
                className='absolute top-0 left-0 bottom-0 w-1'
                style={{ 
                    background: `linear-gradient(180deg, ${color} 0%, ${color}CC 50%, ${color}80 100%)`
                }}
            />
            
            {/* Colored Left Corner Accent */}
            <div 
                className='absolute top-0 left-0 w-16 h-16 opacity-12 group-hover:opacity-20 transition-opacity duration-300'
                style={{ 
                    background: `radial-gradient(circle at top left, ${color}, transparent 65%)`
                }}
            />
            
            <div className='px-3 py-4 sm:px-4 sm:py-4 relative z-10 pl-4'>
                <div className='flex items-center justify-between mb-2'>
                    <span className='flex items-center text-xs font-semibold text-gray-700'>
                        <div 
                            className='mr-1.5 p-1 rounded-md'
                            style={{ backgroundColor: `${color}15` }}
                        >
                            <Icon
                                size={16}
                                style={{ color: color }}
                            />
                        </div>
                        <span className="text-xs font-medium">{name}</span>
                    </span>
                </div>
                <p
                    className='text-gray-900 font-bold text-xl sm:text-2xl mt-1'
                    style={{ color: color }}
                >
                    {value}
                </p>
            </div>
        </div>
    )
}

export default StandardStatCard

