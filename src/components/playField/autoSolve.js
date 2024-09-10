export function findSolutionPath(squares, emptySquare) {
    const goalState = generateGoalState();  // Целевое состояние (заданная последовательность)
    const visited = new Set();  // Набор для отслеживания посещенных состояний
    const priorityQueue = [];   // Очередь с приоритетом для A* (состояние, стоимость, глубина)
    
    priorityQueue.push({ squares, emptySquare, path: [], cost: 0 });
    visited.add(hashState(squares, emptySquare));  // Добавляем начальное состояние в посещенные

    while (priorityQueue.length > 0) {
        const { squares: currentSquares, emptySquare: currentEmpty, path, cost } = priorityQueue.shift();

        if (isPuzzleSolved(currentSquares)) {
            return path;  // Возвращаем путь к решению
        }

        const neighbors = getNeighbors(currentEmpty);  // Получаем возможные ходы пустого квадрата

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

        // Сортировка очереди по приоритету
        priorityQueue.sort((a, b) => a.cost - b.cost);
    }

    return null;  // Решение не найдено
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

    // Проходим по каждому квадрату
    for (const square of squares) {
        // Целевая позиция каждого квадрата — это положение его контента в отсортированной головоломке
        const targetX = (square.content - 1) % 5;  // вычисляем целевую координату X
        const targetY = Math.floor((square.content - 1) / 5);  // вычисляем целевую координату Y

        // Манхэттенское расстояние от текущей позиции до целевой
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
        { x: emptySquare.x + 1, y: emptySquare.y }, // Вправо
        { x: emptySquare.x - 1, y: emptySquare.y }, // Влево
        { x: emptySquare.x, y: emptySquare.y + 1 }, // Вниз
        { x: emptySquare.x, y: emptySquare.y - 1 }  // Вверх
    ];

    return directions.filter(dir => dir.x >= 0 && dir.x < 5 && dir.y >= 0 && dir.y < 5);  // Ограничение по границам
}

function isPuzzleSolved(squares) {
    for (let i = 0; i < squares.length; i++) {
        const square = squares[i];
        const expectedX = (square.content - 1) % 5; // ожидаемая позиция по X
        const expectedY = Math.floor((square.content - 1) / 5); // ожидаемая позиция по Y
        if (square.positionX !== expectedX || square.positionY !== expectedY) {
            return false;
        }
    }
    return true;
}