export function generateImageFragments(imageUrl, fragmentSize, numRows, numCols) {
    return new Promise((resolve, reject) => {
        //debugger;
        const image = new Image();
        image.src = imageUrl;
        image.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = fragmentSize;
            canvas.height = fragmentSize;

            const fragments = [];
            for (let row = 0; row < numRows; row++) {
                for (let col = 0; col < numCols; col++) {
                    const offsetX = col * fragmentSize;
                    const offsetY = row * fragmentSize;

                    ctx.clearRect(0, 0, fragmentSize, fragmentSize);
                    ctx.drawImage(image, offsetX, offsetY, fragmentSize, fragmentSize, 0, 0, fragmentSize, fragmentSize);

                    const dataUrl = canvas.toDataURL();
                    fragments.push(dataUrl);
                }
            }

            resolve(fragments);
        };

        image.onerror = (error) => reject(error);
    });
}

export function normalizeAndGenerateImageFragments(imageUrl, fragmentSize, numRows) {
    return new Promise((resolve, reject) => {
        const numCols = numRows;
        const image = new Image();
        image.src = imageUrl;
        image.onload = () => {
            const originalWidth = image.width;
            const originalHeight = image.height;
            
            // Step 1: Trim to square
            const sideLength = Math.min(originalWidth, originalHeight);
            const offsetX = (originalWidth > originalHeight) ? (originalWidth - sideLength) / 2 : 0;
            const offsetY = (originalHeight > originalWidth) ? (originalHeight - sideLength) / 2 : 0;
            
            // Step 2: Scale to fragment grid size
            const totalSize = fragmentSize * numRows; // Overall grid size
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = totalSize;
            canvas.height = totalSize;
            
            // Crop and scale the image
            ctx.drawImage(image, offsetX, offsetY, sideLength, sideLength, 0, 0, totalSize, totalSize);
            
            const fragments = [];
            for (let row = 0; row < numRows; row++) {
                for (let col = 0; col < numCols; col++) {
                    const fragmentCanvas = document.createElement('canvas');
                    const fragmentCtx = fragmentCanvas.getContext('2d');
                    fragmentCanvas.width = fragmentSize;
                    fragmentCanvas.height = fragmentSize;

                    // Cut out a fragment of an image from the overall canvas
                    const fragmentX = col * fragmentSize;
                    const fragmentY = row * fragmentSize;
                    fragmentCtx.drawImage(canvas, fragmentX, fragmentY, fragmentSize, fragmentSize, 0, 0, fragmentSize, fragmentSize);

                    const dataUrl = fragmentCanvas.toDataURL();
                    fragments.push(dataUrl);
                }
            }

            resolve(fragments);
        };

        image.onerror = (error) => reject(error);
    });
}
