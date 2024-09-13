import React, { useState, useEffect } from 'react';
import './controls.css';
import Button from './Buttons/button.js';
import Switch from './Switches1/switch.js';
import Switch1 from './Switches1/switch1.js';

export default function Controls({ setControlHandlers }) {

    const [controls, setControls] = useState([]);

    const handleClick = (controlId) => {
        if (controlId.startsWith("switch")) 
        {
           switchSwitches(controlId); 
        }
        // Force state update
        setControlHandlers(null);  // Resetting the state
        setTimeout(() => {
            setControlHandlers(controlId);  // Set a new value with a short delay
        }, 0);
    };

    const switchSwitches = (id) => {
        let updatedControls = controls.map(item => {
            if (item.id === id) {
                // switch state
                return { ...item, state: !item.state };
            }
            return item;
        });
        const element1 = updatedControls.find(item => item.id === id);
        if (element1.set) {
            const element2 = updatedControls.find(
                item => item.set === element1.set && item.id !== id
            );
            if (element2 && !element1.state && !element2.state) {
                updatedControls = updatedControls.map(item =>
                    item.id === element2.id ? { ...item, state: true } : item
                );
            }
        }
        setControls(updatedControls);
    };

    const controlElements = controls.map(control => {
        switch (control.type) {
            case "button":
                return (
                    <Button
                        content={control.content}
                        id={control.id}
                        key={control.id}
                        clickButton={() => handleClick(control.id)}
                    />
                );
            case "switch":
                return (
                    <Switch
                        label={control.label}
                        id={control.id}
                        key={control.id}
                        state={control.state}
                        // onChange={() => handleSwitchChange(control.id)}
                    />
                );
            case "switch1":
                return (
                    <Switch1
                        label={control.label}
                        id={control.id}
                        key={control.id}
                        state={control.state}
                        onChange={() => handleClick(control.id)}
                    />
                );
            default:
                return null; // unknown type
        }
    });

    useEffect(() => {
        const controlsContent = [
            {type: "button", content: "New puzzle", id: "button1"},
            {type: "button", content: "New puzzle 4x4", id: "button2"},
            {type: "switch1", label: "Show numbers", id: "switch1", set: "view", state: true},
            {type: "switch1",  label: "Show image", id: "switch2", set: "view", state: true}
        ];
        setControls(controlsContent);
    }, []);

    return (
        <div className="controlPanel">
            {controlElements}
        </div>
    )
}