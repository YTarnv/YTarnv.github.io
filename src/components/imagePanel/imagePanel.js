import React, { useState, useEffect } from 'react';
import './imagePanel.css';
import ImageSquare from './ImageSquare/imageSquare.js';
import image from './previewImages/image1.jpg';
import images from './loadPreviews';

export default function ImagePanel({ setControlImage, controlImage }) {
    
    // const selectedImage = "image1.jpg"

    // const [imageSquares, setImageSquares] = useState(["image1","image2","image3","image4","image5","image6","image7","image8"]);

    const handleClickImage = (id) => {
        // Force state update
        setControlImage(null);  // Resetting the state
        setTimeout(() => {
            setControlImage(id);  // Set a new value with a short delay
        }, 0);
    };

    const imageElements = Object.keys(images).map(key => (
        <ImageSquare
        id={key}
        key={key}
        selected={controlImage}
        image={images[key]}
        clickImage={() => handleClickImage(key)}
        />
    ));

    return (
        <div className="imagePanel">
            <div className="imagesTitle">Select Image</div>
            <div className="imagesContainer">
                {imageElements}
            </div>
        </div>
    )
}