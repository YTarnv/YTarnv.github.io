import React, { useState, useEffect } from 'react';
import './playField.css';
import Square from '../square/square.js';
import {generateImageFragments, normalizeAndGenerateImageFragments} from './utils.js';
import image from './testimage.jpg';

const directions = {
    "1,0": [1, 0],  // right
    "-1,0": [-1, 0], // left
    "0,1": [0, 1],   // bottom
    "0,-1": [0, -1]  // top
};

function generateEmptySquare() {
    return {
        x: Math.floor(Math.random() * 5), // random value from 0 to 4 for x
        y: Math.floor(Math.random() * 5)  // random value from 0 to 4 for y
    };
}

function isSolvable(puzzle) {
    const squareValues = [];
    for (let y = 0; y < 5; y++) {
        for (let x = 0; x < 5; x++) {
            
            const foundItem = puzzle.find(item => item.positionX === x && item.positionY === y);

            if (foundItem) {
                const idNumber = parseInt(foundItem.id.replace("square", ""));
                squareValues.push(idNumber);
            }
        }
    }
    let inversions = 0;
    for (let i = 0; i<squareValues.length;i++)
    {
        for (let j = i; j<squareValues.length;j++)
        {
            if (squareValues[i] > squareValues[j]) 
                {
                    inversions++;
                }
        }
    }

    if (squareValues.length % 2 === 0) //the puzzle has an odd side length
    {
        if (inversions % 2 !== 0)
        {
            const firstObj = puzzle.find(obj => obj.content === puzzle.length);
            const secondObj = puzzle.find(obj => obj.content === puzzle.length-1);
            [firstObj.positionX, secondObj.positionX] = [secondObj.positionX, firstObj.positionX];
            [firstObj.positionY, secondObj.positionY] = [secondObj.positionY, firstObj.positionY];
        }
        return puzzle;
    }
    else //the puzzle has an even side length
    {
        //todo
        return "wrong";
    }
}

function isPuzzleSolved(squares) {
    for (let i = 0; i < squares.length; i++) {
        const square = squares[i];
        const expectedX = (square.content - 1) % 5; 
        const expectedY = Math.floor((square.content - 1) / 5); 
        if (square.positionX !== expectedX || square.positionY !== expectedY) {
            return false;
        }
    }
    return true;
}

function createNewSquares(emptySquare) {
    // Create an array of all possible coordinates
    const coordinates = [];
    for (let y = 0; y < 5; y++) {
        for (let x = 0; x < 5; x++) {
            coordinates.push({ x, y });
        }
    }

    // Remove coordinates for emptySquare
    const emptyIndex = coordinates.findIndex(coord => coord.x === emptySquare.x && coord.y === emptySquare.y);
    coordinates.splice(emptyIndex, 1);

    // shuffle the remaining coordinates randomly
    const shuffledCoordinates = coordinates.sort(() => Math.random() - 0.5);

    // Generate random ids from 1 to 24
    const ids = Array.from({ length: 24 }, (_, i) => i + 1).sort(() => Math.random() - 0.5);

    // Create an array newSquares with random ids and random coordinates
    const newSquares = shuffledCoordinates.map((coord, index) => ({
        positionX: coord.x,
        positionY: coord.y,
        content: ids[index],
        id: "square" + ids[index]
    }));

    return newSquares;
}

export default function PlayField({ buttonHandlers }) {

    const [emptySquare, setEmptySquare] = useState({ x: 0, y: 0 });
    const [squares, setSquares] = useState([]);
    const [images, setImages] = useState([]);

    const initializePuzzle = () => {
        let initialEmptySquare;
        let initialSquares;

        initialEmptySquare = generateEmptySquare();
        initialSquares = createNewSquares(initialEmptySquare);
        isSolvable(initialSquares);

        setEmptySquare(initialEmptySquare);
        setSquares(initialSquares);
    };

    useEffect(() => {
        normalizeAndGenerateImageFragments(image, 120, 5, 5)
    .then(imageFragments => {
        console.log('Image fragments successfully created');
        setImages(imageFragments);
    })
    .catch(error => {
        console.error('Error creating image fragments:', error);
    });
    },[])

    useEffect(() => {
        const handlers = {
            1: initializePuzzle,
            2: initializePuzzle
        };
        if (buttonHandlers && handlers[buttonHandlers]) {
            handlers[buttonHandlers]();
        }
    }, [buttonHandlers]);

    useEffect(() => {
        initializePuzzle();
    },[]);

    function moveSquare(x,y) {
        const dx = x - emptySquare.x;
        const dy = y - emptySquare.y;
        
        const key = `${dx},${dy}`;
        if (directions[key]) {
            let newSquares = squares.map(square => {
                return (square.positionX === x && square.positionY === y) ?
                {...square, positionX: square.positionX - directions[key][0], positionY: square.positionY - directions[key][1]} :
                square;
            });
            setSquares(newSquares);
            setEmptySquare({ "x":x, "y":y });
        }
    }

    const squareElements = squares.map(square => (
        <Square
            positionX = {square.positionX}
            positionY = {square.positionY}
            content = {square.content}
            id = {square.id}
            key = {"square" + square.content}
            image = {images[square.content-1]}
            moveSquare = {() => moveSquare(square.positionX,square.positionY)}
        />
    ))

        return (
        <div className="playField">
            {squareElements}
            {isPuzzleSolved(squares) && (
            <div className="solved">
                <h2>Congratulations! You solved the puzzle!</h2>
            </div>
        )}
        </div>
    )
    
}