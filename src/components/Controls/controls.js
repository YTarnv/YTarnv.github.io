import React, { useState, useEffect } from 'react';
import './controls.css';
import Button from './Buttons/button.js';
import Switch from './Switches/switch.js';

export default function Controls({ setButtonHandlers }) {

    const [buttons, setButtons] = useState([]);

    const handleClick = (buttonId) => {
        // Force state update
        setButtonHandlers(null);  // Resetting the state
        setTimeout(() => {
            setButtonHandlers(buttonId);  // Set a new value with a short delay
        }, 0);
    };

    const buttonElements = buttons.map(button => (
        <Button
            content = {button.content}
            id = {button.id}
            key = {"button" + button.id}
            clickButton = {() => handleClick(button.id)}
        />
    ))

    useEffect(() => {
        const buttonsContent = [
            {content: "New puzzle", id: 1},
            {content: "Test button", id: 2}
        ];
        setButtons(buttonsContent);
    }, []);

    return (
        <div className="controlPanel">
            {buttonElements}
            <Switch />
        </div>
    )
}