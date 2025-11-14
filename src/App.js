import './App.css';
import React, { useState } from 'react';
import PlayField from './components/playField/playField.js'
import Controls from './components/Controls/controls.js'
import ImagePanel from './components/imagePanel/imagePanel.js'
import Timer from './components/Timer/timer.js'

function App() {
  const [controlHandlers, setControlHandlers] = useState([]);
  const [controlImage, setControlImage] = useState("");
  const [customImage, setCustomImage] = useState("");
  const [fieldStatus, setFieldStatus] = useState({started: false, solved: false})
  const [useTimer, setUseTimer] = useState(true);
  return (
    <main>
      <div className="gameField">
          <Timer fieldStatus={fieldStatus} useTimer={useTimer} />
          <div className="gameField-bottom">
            <Controls setControlHandlers={setControlHandlers} fieldStatus = {fieldStatus} setUseTimer={setUseTimer}/>
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
      </div>
    </main>
  );
}

export default App;
