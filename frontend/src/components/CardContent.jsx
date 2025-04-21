import { contactSchema } from "../utils/contactSchema.js";

export default function CardContent(props) {
    const iconPath = `/${props.icon}.svg`

    if (props.type === "form") {
        const handleFieldChange = (e) => {
            const { name, value } = e.target;
            props.setFormData(prevState => ({...prevState, [name]: value}));

            const timeoutId = setTimeout(() => {
                validateField(name, value);
            }, 500);

            return () => clearTimeout(timeoutId);
        }

        const validateField = async (field, value) => {
            try {
                await contactSchema.validateAt(field, {[field]: value});
            } catch (e) {
                console.error("Error occurred: ", e);
            }
        }

        return (
            <div className="card-content">
                <label>
                    <img
                        className="card-icon"
                        src={iconPath}
                    />
                    <input
                        type={props.input}
                        name={props.name}
                        placeholder={props.placeholder}
                        value={props.formData.name}
                        onChange={handleFieldChange}
                        onBlur={() => validateField(`${props.name}`)}
                    />
                </label>
            </div>

        )
    } else {
        return (
            <div className="card-content">
                <img
                    className="card-icon"
                    src={iconPath}
                />
                <p className="">{contactData.city}</p>
            </div>
        )
    }
};