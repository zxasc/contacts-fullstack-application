export default function FormField(props) {
  return (
    <div className="card-content">
      <label>
        <div className="flex flex-row gap-2 items-center">
          <img className="card-icon" src={`${props.icon}`} />
          <input
            type={props.type}
            name={props.name}
            placeholder={props.placeholder}
            value={props.value}
            onChange={props.onChange}
            onBlur={props.onBlur}
            onKeyUp={props.onKeyUp}
            className={props.error ? "input-error" : ""}
          />
        </div>
        {props.error && (
          <span className="text-red-800 text-center max-w-48">
            {props.error}
          </span>
        )}
      </label>
    </div>
  );
}
