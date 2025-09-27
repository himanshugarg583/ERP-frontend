import React from 'react';

const Parent_ExamDetail = React.memo(({ title, data, suggestion }) => (
    <details className="mb-2 sm:mb-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all">
        <summary className="p-2 sm:p-3 cursor-pointer font-semibold flex justify-between items-center text-sm sm:text-base">
            <span>{title}</span>
            <svg className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
        </summary>
        <div className="p-2 sm:p-3 pt-0 border-t border-gray-200">
            {Object.entries(data).map(([key, value], idx) => (
                <div key={idx} className="grid grid-cols-1 sm:grid-cols-2 gap-1 sm:gap-2 mb-1 sm:mb-2">
                    <div className="text-xs sm:text-sm">
                        {key}: <span className="font-medium">{value}</span>
                    </div>
                </div>
            ))}
            <div className="mt-1 sm:mt-2 text-xs sm:text-sm text-gray-600 italic">Suggestion: {suggestion}</div>
        </div>
    </details>
));

export default Parent_ExamDetail;