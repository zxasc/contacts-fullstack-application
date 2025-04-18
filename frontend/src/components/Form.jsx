import * as yup from 'yup';
import {useState} from "react";

const contactSchema = yup.object().shape({
    name: yup.string().required(),
    surname: yup.string().required(),
    phone_number: yup.string().required(),
    email: yup.string().email().required(),
    city: yup.string().required(),
    state: yup.string().required(),
    added_date: yup.date().required().default(() => new Date()),
})

export default function Form(props) {
    const [success, setSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        surname: "",
        phone_number: "",
        email: "",
        city: "",
        added_date: "",
    });

    const handleFieldChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({...prevState, [name]: value}));

        const timeoutId = setTimeout(() => {
            validateField(name, value);
        }, 500);

        return () => clearTimeout(timeoutId);
    }

    const validateField = async (field, value) => {
        try {
            await contactSchema.validateAt(field, {[field]: value});
        } catch (e) {
            console.error(e);
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await contactSchema.validate(formData, { abortEarly: false });
            // TODO: Add duplicate detection
            // TODO: Make the code reusable for edits
            const url = 'http://localhost:8000/api/contacts';
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.detail);
            };
            const result = await response.json();
            console.log(result);
            setSuccess(true);
        } catch (e) {
            throw new Error(e);
        } finally {
            setIsLoading(false);
        };
    }

    return (
        <section>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>
                        Name:
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleFieldChange}
                            onBlur={() => validateField("name")}
                        />
                    </label>
                </div>
                <div>
                    <label>
                        Surname:
                        <input
                            type="text"
                            name="surname"
                            value={formData.surname}
                            onChange={handleFieldChange}
                            onBlur={() => validateField("name")}
                        />
                    </label>
                </div>
                <button
                    onClick={handleSubmit}
                    type="submit"
                    disabled={isLoading}
                >
                    Submit
                </button>

            </form>
        </section>
    )
}