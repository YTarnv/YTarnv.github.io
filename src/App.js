import './App.css';
import React, { useState, useEffect } from 'react';
import PlayField from './components/playField/playField.js'
import Controls from './components/Controls/controls.js'

function App() {
  const [buttonHandlers, setButtonHandlers] = useState([]);

  return (
    <main>
      <div className="gameField">
        <Controls setButtonHandlers={setButtonHandlers} />
        <PlayField  buttonHandlers={buttonHandlers} />
      </div>
    </main>
  );
}

export default App;
