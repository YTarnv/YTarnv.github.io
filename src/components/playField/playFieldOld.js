import React from 'react';
import './playField.css';
import Square from '../square/square.js';

export default function PlayField() {

    const [squares, setSquares] = React.useState(createNewSquares());
    const [emptySquare, setEmptySquare] = React.useState({ "x":4, "y":4 })


    function createNewSquares() {
        var number = 1;
        const newSquares = [];
        for (let y = 0; y < 5; y++) {
            for(let x = 0; x < 5; x++) {
                if (number != 25) {
                    const newSquare = {
                        positionX: x,
                        positionY: y,
                        content: number,
                        id: "square" + number
                    }
                    number++;
                    newSquares.push(newSquare);
                }
            }
        }
        return newSquares;
    }

    function moveSquare(x,y) {
        const dx = x - emptySquare.x;
        const dy = y - emptySquare.y;
        const directions = {
            "1,0": [1, 0],  // right
            "-1,0": [-1, 0], // left
            "0,1": [0, 1],   // bottom
            "0,-1": [0, -1]  // top
        };
        const key = `${dx},${dy}`;
        if (directions[key]) {
            setSquares(oldSquare => oldSquare.map(square => {
                return (square.positionX === x && square.positionY === y) ?
                {...square, positionX: square.positionX - directions[key][0], positionY: square.positionY - directions[key][1]} :
                square;
            }))
            setEmptySquare({ "x":x, "y":y });
            console.log(emptySquare);
        }
    }

    const squareElements = squares.map(square => (
        <Square
            positionX = {square.positionX}
            positionY = {square.positionY}
            content = {square.content}
            id = {square.id}
            key = {"square" + square.content}
            moveSquare = {() => moveSquare(square.positionX,square.positionY)}
        />
    ))

        return (
        <div className="playField">
            {squareElements}
        </div>
    )
    
}