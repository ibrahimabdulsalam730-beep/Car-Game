import { useState, useEffect, useRef, useCallback } from 'react';
import CarGame from './Game'; 
import Home from './Home';

function App() {
    // Game constants
    const roadWidth = 384; 
    const carWidth = 40;
    const carHeight = 80;

    // State management for the game
    const [isPlaying, setIsPlaying] = useState(false);
    const [score, setScore] = useState(0);
    const [lines, setLines] = useState([]); // State for rendering lines
    
    // Refs for mutable state inside the game loop (avoids stale state)
    const gameAreaRef = useRef(null);
    const keysRef = useRef({ ArrowUp: false, ArrowDown: false, ArrowLeft: false, ArrowRight: false });
    const playerRef = useRef({ x: 0, y: 0, speed: 3 });
    const enemyCarsRef = useRef([]); // Use Ref for game logic
    const animationFrameRef = useRef(); // Tracks the current animation frame ID

    // --- Utility Functions ---
    
    // Function to create a new enemy car with random position and type
    const createEnemy = (initialY = -200) => {
        const x = Math.floor(Math.random() * (roadWidth - carWidth));
        const type = Math.floor(Math.random() * 3) + 1; // car1, car2, or car3
        return { x, y: initialY, type };
    };

    // Collision detection logic
    const isCollisionDetected = useCallback((playerCar, enemyCar) => {
        const playerRect = { x: playerCar.x, y: playerCar.y, width: carWidth, height: carHeight };
        const enemyRect = { x: enemyCar.x, y: enemyCar.y, width: carWidth, height: carHeight };

        // Check for overlap on all four sides
        return playerRect.x < enemyRect.x + enemyRect.width &&
               playerRect.x + playerRect.width > enemyRect.x &&
               playerRect.y < enemyRect.y + enemyRect.height &&
               playerRect.height + playerRect.y > enemyRect.y;
    }, []);

    // --- Input Handlers (for both Keyboard and Buttons) ---
    
    // Universal function to update the keysRef state
    const updateKeys = useCallback((key, isActive) => {
        keysRef.current = { ...keysRef.current, [key]: isActive };
    }, []);

    // Keyboard press handler
    const handleKeyDown = useCallback((e) => {
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
            e.preventDefault();
            updateKeys(e.key, true);
        }
    }, [updateKeys]);

    // Keyboard release handler
    const handleKeyUp = useCallback((e) => {
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
            e.preventDefault();
            updateKeys(e.key, false);
        }
    }, [updateKeys]);

    // Button handler (passed down to CarGame.jsx)
    const handleMove = useCallback((direction, active) => {
        updateKeys(direction, active);
    }, [updateKeys]);

    // --- Game Logic Handlers ---
    
    // Function to set up the game state for a fresh start
    const handleStartGame = useCallback(() => {
        setIsPlaying(true);
        setScore(0);
        
        // If game area isn't measured yet, set a small timeout to try again.
        if (!gameAreaRef.current) {
            setTimeout(() => handleStartGame(), 50);
            return;
        }

        const gameArea = gameAreaRef.current.getBoundingClientRect();
        
        // Reset player position
        playerRef.current = { 
            speed: 3,
            x: (roadWidth - carWidth) / 2, 
            y: gameArea.height - carHeight - 10 
        };

        // Initialize road lines
        let initialLines = [];
        for (let i = 0; i < 5; i++) {
            initialLines.push({ y: i * 150 });
        }
        setLines(initialLines);

        // Initialize enemy cars
        let initialEnemies = [];
        for (let i = 0; i < 3; i++) {
            initialEnemies.push(createEnemy(i * 250 * -1)); // Create initial set
        }
        enemyCarsRef.current = initialEnemies; // Store in the ref for the game loop
        
        // Reset movement keys
        keysRef.current = { ArrowUp: false, ArrowDown: false, ArrowLeft: false, ArrowRight: false };
    }, []); 

    // Function to end the game on collision
    const endGame = useCallback(() => {
        setIsPlaying(false); // This causes the useEffect to clean up and the start screen to show
    }, []);

    // --- Game Loop Implementation ---

    useEffect(() => {
        if (!isPlaying) return;

        // Attach global keyboard listeners
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        const gameLoop = () => {
            const keys = keysRef.current;
            const player = playerRef.current;
            let enemies = enemyCarsRef.current;
            // Ensure gameAreaRef is current before reading dimensions
            if (!gameAreaRef.current) return; 
            const gameArea = gameAreaRef.current.getBoundingClientRect();

            // 1. Move Player
            let newX = player.x;
            let newY = player.y;

            if (keys.ArrowUp && newY > 0) newY -= player.speed;
            if (keys.ArrowDown && newY < (gameArea.height - carHeight)) newY += player.speed;
            if (keys.ArrowLeft && newX > 0) newX -= player.speed;
            if (keys.ArrowRight && newX < (roadWidth - carWidth)) newX += player.speed;
            
            // Update the player ref and force re-render if position changed
            if (newX !== player.x || newY !== player.y) {
                playerRef.current = { ...player, x: newX, y: newY };
            }

            // 2. Move Road Lines and Score
            setScore(prevScore => prevScore + 1);
            setLines(prevLines => prevLines.map(line => {
                const newY = line.y + player.speed;
                // Recycle lines
                return newY > gameArea.height ? { y: newY - (Math.ceil(gameArea.height / 150) * 150) } : { y: newY };
            }));

            // 3. Move Enemy Cars and Check Collision
            const isCollision = enemies.some(enemy => isCollisionDetected(playerRef.current, enemy));

            if (isCollision) {
                endGame();
                return;
            }

            // Update enemy car positions in the ref
            enemyCarsRef.current = enemies.map(enemy => {
                let newY = enemy.y + player.speed;
                if (newY > gameArea.height) {
                    return createEnemy(-200); 
                }
                return { ...enemy, y: newY };
            });

            // Schedule the next frame
            animationFrameRef.current = requestAnimationFrame(gameLoop);
        };

        // Start the game loop
        animationFrameRef.current = requestAnimationFrame(gameLoop);

        // Cleanup function
        return () => {
            cancelAnimationFrame(animationFrameRef.current);
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, [isPlaying, handleKeyDown, handleKeyUp, isCollisionDetected, endGame]);


    // Show Home when game is not playing and not started
    if (!isPlaying) {
        return <Home onStart={handleStartGame} />;
    }

    return (
        <div ref={gameAreaRef} className="w-screen h-screen">
            <CarGame
                score={score}
                isPlaying={isPlaying}
                onStartGame={handleStartGame}
                // Use the ref value to position the car
                playerCarStyle={{ left: `${playerRef.current.x}px`, top: `${playerRef.current.y}px` }}
                lines={lines}
                enemyCars={enemyCarsRef.current}
                onMove={handleMove}
            />
        </div>
    );
}

export default App;
