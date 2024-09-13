import './App.css';
import React, { useState } from 'react';
import PlayField from './components/playField/playField.js'
import Controls from './components/Controls/controls.js'

function App() {
  const [controlHandlers, setControlHandlers] = useState([]);

  return (
    <main>
      <div className="gameField">
        <Controls setControlHandlers={setControlHandlers} />
        <PlayField  controlHandlers={controlHandlers} />
      </div>
    </main>
  );
}

export default App;
