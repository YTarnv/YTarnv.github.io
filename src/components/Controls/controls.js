import React, { useState, useEffect } from 'react';
import './controls.css';
import Button from './Buttons/button.js';

export default function Controls({ setButtonHandlers }) {

    const [buttons, setButtons] = useState([]);

    const handleClick = (buttonId) => {
        // Принудительное обновление состояния
        setButtonHandlers(null);  // Сбрасываем состояние
        setTimeout(() => {
            setButtonHandlers(buttonId);  // Устанавливаем новое значение с небольшой задержкой
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
        </div>
    )
}