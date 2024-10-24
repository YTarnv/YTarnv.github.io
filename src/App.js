import './App.css';
import React, { useState } from 'react';
import PlayField from './components/playField/playField.js'
import Controls from './components/Controls/controls.js'
import ImagePanel from './components/imagePanel/imagePanel.js'

function App() {
  const [controlHandlers, setControlHandlers] = useState([]);
  const [controlImage, setControlImage] = useState("");
  const [customImage, setCustomImage] = useState("");
  const [fieldStatus, setFieldStatus] = useState({started: false, solved: false})
  return (
    <main>
      <div className="gameField">
          <Controls setControlHandlers={setControlHandlers} fieldStatus = {fieldStatus}/>
          <PlayField  
            controlHandlers={controlHandlers} 
            setControlImage={setControlImage} 
            controlImage={controlImage} 
            setFieldStatus={setFieldStatus}
            customImage={customImage}
          />
          <ImagePanel 
            setControlImage={setControlImage} 
            controlImage={controlImage} 
            fieldStatus = {fieldStatus}
            setCustomImage={setCustomImage}
          />
      </div>
    </main>
  );
}

export default App;
