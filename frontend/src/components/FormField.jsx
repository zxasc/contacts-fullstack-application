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
        />
      </label>
    </div>
  );
}
