import React, { useState, useEffect } from 'react';
import './timer.css';

export default function Timer({ fieldStatus, useTimer }) {
    const [time, setTime] = useState(0);

    useEffect(() => {
        let interval;
        
        // Если таймер выключен, останавливаем и обнуляем
        if (!useTimer) {
            setTime(0);
            return () => clearInterval(interval);
        }
        
        // Таймер работает только если игра начата и не решена
        if (fieldStatus?.started && !fieldStatus?.solved) {
            interval = setInterval(() => {
                setTime(prevTime => prevTime + 1);
            }, 1000);
        } else if (!fieldStatus?.started) {
            // Сбрасываем таймер только когда игра не запущена
            setTime(0);
        }
        // Если solved === true, таймер просто останавливается, но не сбрасывается
        return () => clearInterval(interval);
    }, [fieldStatus?.started, fieldStatus?.solved, useTimer]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${String(mins).padStart(2, '0')}.${String(secs).padStart(2, '0')}`;
    };

    if (!useTimer) {
        return (
            <div className="timer timer-hidden">
                {formatTime(time)}
            </div>
        );
    }

    return (
        <div className={`timer ${fieldStatus?.solved ? 'timer-solved' : ''}`}>
            {formatTime(time)}
        </div>
    );
}