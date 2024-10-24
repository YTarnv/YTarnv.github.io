import React, { useState, useEffect } from 'react';
import './imageInput.css';

function processImage(image) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = image;
  
      img.onload = () => {
        if (img.width < 300 || img.height < 300) {
          reject('Image is too small. Minimum size is 300px x 300px.');
        } else {
          // Cropping to square
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
  
          const minSide = Math.min(img.width, img.height);
          const offsetX = (img.width - minSide) / 2;
          const offsetY = (img.height - minSide) / 2;
  
          // Set canvas dimensions to 620x620px
          canvas.width = 620;
          canvas.height = 620;
  
          // Draw an image with cropping and resizing
          ctx.drawImage(img, offsetX, offsetY, minSide, minSide, 0, 0, 620, 620);
  
          // Return the normalized image as a Data URL
          resolve(canvas.toDataURL());
        }
      };
  
      img.onerror = () => {
        reject('Failed to load image.');
      };
    });
  }

export default function ImageInput({ onImageProcessed }) {

    const [customImage, setCustomImage] = useState('');
    const [message, setMessage] = useState('...or drop any image here');
    const [imageLoaded, setImageLoaded] = useState(false);
    const [imageData, setImageData] = useState(null);

    const handleDrop = (event) => {
        event.preventDefault();
        
        // Get files
        const files = event.dataTransfer.files;
    
        if (files && files[0]) {
          const file = files[0];
    
            // Check if a file is an image
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
        
                reader.onload = () => {
                    // pass the image to the function for processing
                    processImage(reader.result)
                      .then((processedImage) => {
                        setCustomImage(`url(${processedImage})`);
                        setMessage(''); // Clearing the message after successfully loading the image
                        setImageLoaded(true);
                        setImageData(processedImage);
          
                        // pass the processed image to the parent
                        if (onImageProcessed) {
                            onImageProcessed({ image: processedImage, timestamp: new Date().getTime() });
                        }
                      })
                      .catch((error) => {
                        setCustomImage("");
                        setMessage(error); // error message
                      });
                  };
        
                // Reading an image as a Data URL
                reader.readAsDataURL(file);
            }
            else
            {
                setCustomImage("");
                setMessage('The file is not an image. Please drop an image.');
            }
        }
    };

    // Handler for dragover event (needed for drop to work)
    const handleDragOver = (event) => {
        event.preventDefault();
    };

    const handleClick = () => {
        // If the image is loaded, pass it back to the parent on click
        if (imageLoaded && onImageProcessed  && imageData) {
            onImageProcessed({ image: imageData, timestamp: new Date().getTime() });
        }
      };
    
    const className = "imageInput";
    const styles = {
        backgroundImage: customImage,
        cursor: imageLoaded ? 'pointer' : 'default',
    }

    return (
        <div 
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={handleClick}
        className={className}
        style={styles}
        >
            {message && <span>{message}</span>}
        </div>
    )
}