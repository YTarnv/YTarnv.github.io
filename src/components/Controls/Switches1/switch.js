import './switch.css';

export default function Switch(props) {
    
    return (
    <div className="switch"> 
        <div>{props.label}</div>
        <div className="switchBody">
            <div className="switchBase"></div>
            <div className="switchLever"></div>
        </div>
    </div>
)
    
}