import React, { useState, useEffect } from 'react';
import './imageSquare.css';

export default function ImageSquare(props) {
    const styles = {
        backgroundImage: `url(${props.image})`
    }
    const className = props.id === props.selected ? "imageSquareSelected" : "imageSquare";

    return (
        <div 
        id = {props.id}
        className={className}
        style = {styles}
        onClick = {props.clickImage}
        >
        </div>
    )
}