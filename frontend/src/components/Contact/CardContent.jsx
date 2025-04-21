export default function CardContent(props) {
  return (
    <div className="card-content">
      <img className="card-icon" src={`/${props.icon}`} />
      <p className="">{props.text}</p>
    </div>
  );
}
