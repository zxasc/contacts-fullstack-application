export default function FormField(props) {
  return (
    <div className="card-content">
      <label>
        <img className="card-icon" src={`${props.icon}`} />
        <input
          type={props.type}
          name={props.name}
          placeholder={props.placeholder}
          value={props.value}
          onChange={props.onChange}
          onBlur={props.onBlur}
          onKeyUp={props.onKeyUp}
          className={props.error && props.touched ? "input-error" : ""}
        />
      </label>
      {props.error && props.touched && <span>{props.error}</span>}
    </div>
  );
}
