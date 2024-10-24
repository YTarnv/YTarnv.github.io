import './switch.css';

export default function Switch1(props) {
    const styles = {
        pointerEvents: props.solved ? "none": "auto",
        opacity: props.solved ? 0 : 1
    }
    
    return (
    <div className="switch1" style={styles}> 
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