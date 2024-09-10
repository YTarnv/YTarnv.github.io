import './square.css';

export default function Square(props) {
    const styles = {
        top: props.positionY * 120 + 10,
        left: props.positionX * 120 + 10,
        backgroundImage: "URL(" + props.image + ")"
    }
    console.log(props.image);
    return (
    <div 
        id = {props.id}
        className="square"
        style = {styles}
        onClick = {props.moveSquare}
    >
        <h2>{props.content}</h2>
    </div>
)
    
}