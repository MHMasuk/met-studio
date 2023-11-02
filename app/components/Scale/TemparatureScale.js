import React from 'react';

const TemperatureScale = ({ progressData }) => {
    return (
        <div className="relative w-full h-5 rounded-full bg-gradient-to-r from-blue-300 via-yellow-500 to-red-500 text-center">
            <div className="absolute w-full h-full text-white text-xs text-center flex justify-between px-4 py-0.5">
                <span> kw </span>
                {progressData.map((item, index) => (
                    <div key={index} className={`w-${100 / progressData.length}%`}>
                        {item.percentage}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TemperatureScale;
