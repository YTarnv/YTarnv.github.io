export function findSolutionPath(squares, emptySquare) {
    const goalState = generateGoalState();  // Target state (specified sequence)
    const visited = new Set();  // Set for tracking visited states
    const priorityQueue = [];   // A* priority queue (state, cost, depth)
    
    priorityQueue.push({ squares, emptySquare, path: [], cost: 0 });
    visited.add(hashState(squares, emptySquare));  // Добавляем начальное состояние в посещенные

    while (priorityQueue.length > 0) {
        const { squares: currentSquares, emptySquare: currentEmpty, path, cost } = priorityQueue.shift();

        if (isPuzzleSolved(currentSquares)) {
            return path;  // Returning the path to the solution
        }

        const neighbors = getNeighbors(currentEmpty);  // Get possible moves of empty square

        for (const neighbor of neighbors) {
            const newSquares = moveSquareImitation(currentSquares, currentEmpty, neighbor);
            const newEmptySquare = { x: neighbor.x, y: neighbor.y };

            const newStateHash = hashState(newSquares, newEmptySquare);
            if (!visited.has(newStateHash)) {
                visited.add(newStateHash);
                const newPath = [...path, { from: currentEmpty, to: neighbor }];
                const priority = cost + 1 + heuristicCost(newSquares);
                priorityQueue.push({ squares: newSquares, emptySquare: newEmptySquare, path: newPath, cost: cost + 1 });
                console.log(priorityQueue.length + " --- " + priorityQueue.at(-1).path.length);
            }
        }

        // Sorting the queue by priority
        priorityQueue.sort((a, b) => a.cost - b.cost);
    }

    return null;  // Solution not found
}

function generateGoalState() {
    let goal = [];
    let number = 1;

    for (let y = 0; y < 5; y++) {
        for (let x = 0; x < 5; x++) {
            if (number <= 24) {
                goal.push({ positionX: x, positionY: y, content: number });
                number++;
            }
        }
    }

    return goal;
}

function hashState(squares, emptySquare) {
    const positions = squares.map(square => `${square.positionX},${square.positionY},${square.content}`).join(';');
    return `${positions};empty:${emptySquare.x},${emptySquare.y}`;
}

function heuristicCost(squares) {
    let distance = 0;

    // Walk through every square
    for (const square of squares) {
        // The target position of each square is the position of its content in the sorted puzzle.
        const targetX = (square.content - 1) % 5;  // calculate the target X coordinate
        const targetY = Math.floor((square.content - 1) / 5);  // calculate the target Y coordinate

        // Manhattan distance from current position to target
        distance += Math.abs(square.positionX - targetX) + Math.abs(square.positionY - targetY);
    }

    return distance;
}

function moveSquareImitation(squares, emptySquare, newEmpty) {
    const newSquares = squares.map(square => {
        if (square.positionX === newEmpty.x && square.positionY === newEmpty.y) {
            return { ...square, positionX: emptySquare.x, positionY: emptySquare.y };
        }
        return square;
    });

    return newSquares;
}

function getNeighbors(emptySquare) {
    const directions = [
        { x: emptySquare.x + 1, y: emptySquare.y }, // right
        { x: emptySquare.x - 1, y: emptySquare.y }, // left
        { x: emptySquare.x, y: emptySquare.y + 1 }, // bottom
        { x: emptySquare.x, y: emptySquare.y - 1 }  // Top
    ];

    return directions.filter(dir => dir.x >= 0 && dir.x < 5 && dir.y >= 0 && dir.y < 5);  // Limitation by borders
}

function isPuzzleSolved(squares) {
    for (let i = 0; i < squares.length; i++) {
        const square = squares[i];
        const expectedX = (square.content - 1) % 5; // expected position on X
        const expectedY = Math.floor((square.content - 1) / 5); // expected position on Y
        if (square.positionX !== expectedX || square.positionY !== expectedY) {
            return false;
        }
    }
    return true;
}