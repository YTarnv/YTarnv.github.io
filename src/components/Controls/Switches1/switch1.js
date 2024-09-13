import './switch.css';

export default function Switch1(props) {
    
    return (
    <div className="switch1"> 
        <div className="switch1Label">
            {props.label}
        </div>
        <input 
            onChange={() => props.onChange()} 
            className = "switch1Body" 
            type="checkbox" 
            id={`switch1-${props.label}`} 
            checked={props.state}
        /> 
    </div>
)
    
}