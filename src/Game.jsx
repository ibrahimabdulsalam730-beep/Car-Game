import React from 'react';

// NOTE: For this to work, you must have 'bg_image.png', 'car1.png', 'car2.png', 'car3.png', and 'car4.png' 
// in your project's public folder or imported as assets!

const CarGame = ({ 
    score, 
    isPlaying, 
    onStartGame, 
    playerCarStyle, 
    lines, 
    enemyCars,
    onMove // A single, more flexible event handler
}) => {
    const scoreClass = isPlaying ? 'flex' : 'hidden';
    const startScreenClass = isPlaying ? 'hidden' : 'block';

    return (
        <div 
            className="w-screen h-screen bg-cover bg-center bg-no-repeat relative"
            style={{ backgroundImage: 'url("/images/bg_image.png")', fontFamily: "'Josefin Sans', sans-serif" }}
        >
            
            <div 
                className={`absolute top-4 left-4 sm:left-12 bg-green-500 text-white h-16 w-64 sm:w-80 text-xl shadow-md 
                            justify-center items-center ${scoreClass} rounded-lg p-2 font-semibold`}
            >
                Score: {score || 0}
            </div>

            <div 
                className={`absolute bg-red-500 text-white z-10 text-center border border-red-400 p-4 sm:p-6 cursor-pointer 
                            shadow-xl tracking-wider leading-relaxed uppercase transition-all duration-300 
                            hover:bg-red-600 rounded-xl w-11/12 max-w-lg mx-auto top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
                            ${startScreenClass}`}
                onClick={onStartGame}
            >
                <p className="space-y-2 text-base sm:text-lg">
                    <span className="block font-bold text-xl">Click here to start</span>
                    <span className="block">Use buttons to move</span>
                    <span className="block">If you hit another car you will lose</span>
                </p>
            </div>

            <div className="w-96 h-screen mx-auto bg-gray-800 relative overflow-hidden border-r-4 border-l-4 border-dashed border-gray-300">
                
                {lines && lines.map((line, index) => (
                    <div 
                        key={index}
                        className="w-3 h-24 bg-white absolute left-1/2 -ml-1.5"
                        style={{ top: `${line.y}px` }}
                    ></div>
                ))}

                <div 
                    className="w-10 h-20 bg-center bg-no-repeat absolute bg-cover"
                    style={{ 
                        backgroundImage: 'url("/images/car4.png")', 
                        ...playerCarStyle 
                    }}
                ></div>

                {enemyCars && enemyCars.map((enemy, index) => (
                    <div 
                        key={index}
                        className="w-10 h-20 bg-center bg-no-repeat absolute bg-cover"
                        style={{ 
                            backgroundImage: `url("/images/car${enemy.type}.png")`, 
                            top: `${enemy.y}px`, 
                            left: `${enemy.x}px` 
                        }}
                    ></div>
                ))}

                {/* --- NEW: Game Control Buttons --- */}
                {isPlaying && ( // Only show buttons when the game is playing
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-48 z-20">
                        <div className="flex justify-center mb-2">
                            <button 
                                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full shadow-lg transition-colors duration-200 w-full"
                                onMouseDown={() => onMove('ArrowUp', true)} onMouseUp={() => onMove('ArrowUp', false)} onTouchStart={() => onMove('ArrowUp', true)} onTouchEnd={() => onMove('ArrowUp', false)}
                            >
                                Up
                            </button>
                        </div>
                        <div className="flex justify-between">
                            <button 
                                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full shadow-lg transition-colors duration-200 w-5/12"
                                onMouseDown={() => onMove('ArrowLeft', true)} onMouseUp={() => onMove('ArrowLeft', false)} onTouchStart={() => onMove('ArrowLeft', true)} onTouchEnd={() => onMove('ArrowLeft', false)}
                            >
                                Left
                            </button>
                            <button 
                                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full shadow-lg transition-colors duration-200 w-5/12"
                                onMouseDown={() => onMove('ArrowRight', true)} onMouseUp={() => onMove('ArrowRight', false)} onTouchStart={() => onMove('ArrowRight', true)} onTouchEnd={() => onMove('ArrowRight', false)}
                            >
                                Right
                            </button>
                        </div>
                        <div className="flex justify-center mt-2">
                            <button 
                                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full shadow-lg transition-colors duration-200 w-full"
                                onMouseDown={() => onMove('ArrowDown', true)} onMouseUp={() => onMove('ArrowDown', false)} onTouchStart={() => onMove('ArrowDown', true)} onTouchEnd={() => onMove('ArrowDown', false)}
                            >
                                Down
                            </button>
                        </div>
                    </div>
                )}
                {/* --- END NEW: Game Control Buttons --- */}

            </div>
        </div>
    );
};

export default CarGame;