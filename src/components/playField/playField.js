import React, { useState, useEffect, useCallback } from 'react';
import './playField.css';
import Square from '../square/square.js';
import Congrat from './Congrat/congrat.js';
import {normalizeAndGenerateImageFragments} from './utils.js';

const directions = {
    "1,0": [1, 0],  // right
    "-1,0": [-1, 0], // left
    "0,1": [0, 1],   // bottom
    "0,-1": [0, -1]  // top
};

function generateEmptySquare(size) {
    return {
        x: Math.floor(Math.random() * size), // random value from 0 to size-1 for x
        y: Math.floor(Math.random() * size)  // random value from 0 to size-1 for y
    };
}

function isSolvable(puzzle,empty) {
    const size = puzzle.length === 8 ? 3 : puzzle.length === 15 ? 4 : puzzle.length === 24 ? 5 : null;
    const squareValues = [];
    for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
            
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

    let unSolvable = false;
    if (squareValues.length % 2 === 0) //the puzzle has an odd side length
    {
        if (inversions % 2 !== 0)
        {
            unSolvable = true;
        }
    }
    else //the puzzle has an even side length
    {
        if ((inversions % 2 === 0 && empty.y % 2 === 0) || (inversions % 2 !== 0 && empty.y % 2 !== 0))
            {
                unSolvable = true;
            }
    }
    if (unSolvable) {
        const firstObj = puzzle.find(obj => obj.content === puzzle.length);
        const secondObj = puzzle.find(obj => obj.content === puzzle.length-1);
        [firstObj.positionX, secondObj.positionX] = [secondObj.positionX, firstObj.positionX];
        [firstObj.positionY, secondObj.positionY] = [secondObj.positionY, firstObj.positionY];
    }
    return puzzle;
}

function isPuzzleSolved(squares) {
    const size = squares.length === 8 ? 3 : squares.length === 15 ? 4 : squares.length === 24 ? 5 : null;
    if (!squares || squares.length === 0) {
        return false;
    }
    for (let i = 0; i < squares.length; i++) {
        const square = squares[i];
        const expectedX = (square.content - 1) % size; 
        const expectedY = Math.floor((square.content - 1) / size); 
        if (square.positionX !== expectedX || square.positionY !== expectedY) {
            return false;
        }
    }
    return true;
}

function createNewSquares(emptySquare, size) {
    // Create an array of all possible coordinates
    const coordinates = [];
    for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
            coordinates.push({ x, y });
        }
    }

    // Remove coordinates for emptySquare
    const emptyIndex = coordinates.findIndex(coord => coord.x === emptySquare.x && coord.y === emptySquare.y);
    coordinates.splice(emptyIndex, 1);

    // shuffle the remaining coordinates randomly
    const shuffledCoordinates = coordinates.sort(() => Math.random() - 0.5);

    // Generate random ids from 1 to 24
    const ids = Array.from({ length: size*size-1 }, (_, i) => i + 1).sort(() => Math.random() - 0.5);

    // Create an array newSquares with random ids and random coordinates
    const newSquares = shuffledCoordinates.map((coord, index) => ({
        positionX: coord.x,
        positionY: coord.y,
        content: ids[index],
        id: "square" + ids[index]
    }));

    return newSquares;
}

const loadImage = async (imageName) => {
    try {
        const image = await import(`./Images/${imageName}`);
        return image.default;  // path to image
    } catch (error) {
        // console.error(`Image ${imageName} not found`, error);
        return null;  // if image not founded
    }
};

export default function PlayField({ controlHandlers, controlImage, setFieldStatus }) {

    const [emptySquare, setEmptySquare] = useState({ x: 0, y: 0 });
    const [squares, setSquares] = useState([]);
    const [images, setImages] = useState([]);
    const [settings, setSettings] = useState({
        set1: {switch1: true, switch2: true}, 
        set2: {switch3: true, switch4: true}, 
        size: 5, 
        started: false,
        solved: false
    });
    const [imageSrc, setImageSrc] = useState(null);

    const initializePuzzle = () => {
        let initialEmptySquare;
        let initialSquares;

        initialEmptySquare = generateEmptySquare(settings.size);
        initialSquares = createNewSquares(initialEmptySquare, settings.size);
        isSolvable(initialSquares, initialEmptySquare);

        setEmptySquare(initialEmptySquare);
        setSquares(initialSquares);
        setSettings(prevSettings => ({
            ...prevSettings,
            started: false
        }));
    };

    const prepareInitialization = () => {
        if (controlHandlers.startsWith("button")) {
            const updatedSize = 6 - parseInt(controlHandlers.slice(6));
    
            if (settings.size !== updatedSize) 
            {
                setSettings(prevSettings => ({
                    ...prevSettings,
                    size: updatedSize
                }));
            }
            else 
            {
                initializePuzzle();
            }
        } 
    };

    const switchSwitched = () => {
        setSettings(prevSettings => {
            // Create a new object based on the previous state
            const updatedSettings = { ...prevSettings };
            
            const setContainingKey = ['set1', 'set2'].find(setKey =>
                controlHandlers in updatedSettings[setKey]
            );

            if (!setContainingKey) {
                // If controlHandlers does not exist in any set, return previous state
                return updatedSettings;
            }

            // Toggle the value of the key in the identified set
            updatedSettings[setContainingKey][controlHandlers] = !updatedSettings[setContainingKey][controlHandlers];

            // Extract the keys of the identified set
            const keys = Object.keys(updatedSettings[setContainingKey]);

            // Check if both elements in the set are false
            const allFalse = keys.every(key => !updatedSettings[setContainingKey][key]);

            if (allFalse) {
                // If both elements are false, set the other element to true
                keys.forEach(key => {
                    if (key !== controlHandlers) {
                        updatedSettings[setContainingKey][key] = true;
                    }
                });
            }

            // Return the updated state
            return updatedSettings;
        });
    };

    const backStyle = {
        backgroundImage: imageSrc ? `url(${imageSrc})` : undefined
    };

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
            setSettings(prevSettings => ({
                ...prevSettings,
                started: true
            }));
        }
    }

    useEffect(() => {
        setSettings(prevSettings => ({
            ...prevSettings,
            solved: isPuzzleSolved(squares)
        }));
    },[squares]);

    useEffect(() => {
        const fetchImage = async () => {
            const loadedImage = await loadImage(controlImage);
            if (loadedImage) {
                setImageSrc(loadedImage);
            }
        };

        fetchImage();
    }, [controlImage]);

    useEffect(() => {
        initializePuzzle();
    }, [settings.size]);

    useEffect(() => {
        setFieldStatus({started: settings.started, solved: settings.solved});
    },[settings.started, settings.solved]);

    useEffect(() => {
        if (imageSrc) {
        normalizeAndGenerateImageFragments(imageSrc, 600/settings.size, settings.size)
            .then(imageFragments => {
                setImages(imageFragments);
            })
            .catch(error => {
                console.error('Error creating image fragments:', error);
            });
        }
    },[settings.size, imageSrc])

    useEffect(() => {
        const handlers = {
            button1: prepareInitialization,
            button2: prepareInitialization,
            button3: prepareInitialization,
            switch1: switchSwitched,
            switch2: switchSwitched
        };
        if (controlHandlers && handlers[controlHandlers]) {
            handlers[controlHandlers]();
        }
    }, [controlHandlers]);

    useEffect(() => {
        initializePuzzle();
    },[]);

    const squareElements = squares.map(square => (
        <Square
            puzzleSize = {settings.size}
            positionX = {square.positionX}
            positionY = {square.positionY}
            content = {square.content}
            id = {square.id}
            key = {"square" + square.content}
            image = {images[square.content-1]}
            needNumbers={settings.set1.switch1}
            needImage={settings.set1.switch2}
            moveSquare = {() => moveSquare(square.positionX,square.positionY)}
        />
    ))

        return (
        <div className="playField">
            {settings.set1.switch2 && 
                (<div className="backLight"></div>

            )}
            {settings.solved && <Congrat />}
         <div
            className="backImage"
            style={
                settings.set1.switch2
                    ? {
                        ...backStyle, // Save backStyle
                        filter: settings.solved
                            ? 'none'
                            : 'grayscale(90%) brightness(200%)', // fiter animation
                        opacity: settings.solved ? 1 : 0.3, // opacity animation
                        transition: settings.solved
                            ? 'filter 1s ease 1.5s, opacity 1s ease 1.5s'
                            : 'filter 1s ease, opacity 1s ease'
                    }
                : null // if switch2 == false, remove styles
                }
            ></div>
            <div className="squareContainer"
            style={{ 
                opacity: settings.solved ? 0 : 1,
                pointerEvents: settings.solved ? 'none' : 'auto' 
            }}
            >
                {squareElements}
            </div>
        </div>
    )
    
}