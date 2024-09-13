import './square.css';

export default function Square(props) {
    const styles = {
        top: props.positionY * 120 + 10,
        left: props.positionX * 120 + 10,
        backgroundImage: props.needImage ? `url(${props.image})` : undefined
    }
    return (
    <div 
        id = {props.id}
        className="square"
        style = {styles}
        onClick = {props.moveSquare}
    >
        {props.needNumbers && <h2>{props.content}</h2>}
    </div>
)
    
}