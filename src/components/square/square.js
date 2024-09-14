import './square.css';

export default function Square(props) {
    const styles = {
        width: 600/props.puzzleSize,
        height: 600/props.puzzleSize,
        top: props.positionY * 600/props.puzzleSize + 10,
        left: props.positionX * 600/props.puzzleSize + 10,
        backgroundImage: props.needImage ? `url(${props.image})` : "unset"
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