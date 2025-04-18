export default function Card(props) {
    return (
        <section>
            <p>{props.number}!</p>
            <button onClick={props.onClick}>Click me!</button>
        </section>
    )
}