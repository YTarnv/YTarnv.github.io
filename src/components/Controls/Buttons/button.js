import './buttons.css';

export default function Button(props) {
    
    return (
    <div 
        id = {props.id}
        className="button"
        onClick = {props.clickButton}
    >
        {props.content}
    </div>
)
    
}