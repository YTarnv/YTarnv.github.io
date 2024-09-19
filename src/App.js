import './App.css';
import React, { useState } from 'react';
import PlayField from './components/playField/playField.js'
import Controls from './components/Controls/controls.js'
import ImagePanel from './components/imagePanel/imagePanel.js'

function App() {
  const [controlHandlers, setControlHandlers] = useState([]);
  const [controlImage, setControlImage] = useState("image1.jpg");
  const [fieldStatus, setFieldStatus] = useState({started: false, solved: false})

  return (
    <main>
      <div className="gameField">
          <Controls setControlHandlers={setControlHandlers} />
          <PlayField  controlHandlers={controlHandlers} controlImage={controlImage} setFieldStatus={setFieldStatus}/>
          <ImagePanel setControlImage={setControlImage} controlImage={controlImage} fieldStatus = {fieldStatus}/>
      </div>
    </main>
  );
}

export default App;
