import './App.css';
import React, { useState } from 'react';
import PlayField from './components/playField/playField.js'
import Controls from './components/Controls/controls.js'
import ImagePanel from './components/imagePanel/imagePanel.js'

function App() {
  const [controlHandlers, setControlHandlers] = useState([]);
  const [controlImage, setControlImage] = useState("image1.jpg");

  return (
    <main>
      <div className="gameField">
        <Controls setControlHandlers={setControlHandlers} />
        <PlayField  controlHandlers={controlHandlers} controlImage={controlImage}/>
        <ImagePanel setControlImage={setControlImage} controlImage={controlImage}/>
      </div>
    </main>
  );
}

export default App;
