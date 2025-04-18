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
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState(props.contact);


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
            // await contactSchema.validate(formData, { abortEarly: false });
            // TODO: Add duplicate detection and validation
            let url;
            let method;
            let response;
            if (props.isEditing) {
                url = `http://localhost:8000/api/contacts/${props.contact.id}`;
                method = 'PUT';
            } else {
                url = 'http://localhost:8000/api/contacts/';
                method = 'POST';
            }
            response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),});

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.detail);
            };
            const result = await response.json();
            if (props.isEditing) {
                props.updateContact(result);
            }
        } catch (e) {
            throw new Error(e);
        } finally {
            if (props.isEditing) {
                props.handleContactEdit();
            }
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
                            onBlur={() => validateField("surname")}
                        />
                    </label>
                </div>
                <div>
                    <label>
                        Phone number:
                        <input
                            type="text"
                            name="phone_number"
                            value={formData.phone_number}
                            onChange={handleFieldChange}
                            onBlur={() => validateField("phone_number")}
                        />
                    </label>
                </div>
                <div>
                    <label>
                        Email:
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleFieldChange}
                            onBlur={() => validateField("email")}
                        />
                    </label>
                </div>
                <div>
                    <label>
                        City:
                        <input
                            type="text"
                            name="city"
                            value={formData.city}
                            onChange={handleFieldChange}
                            onBlur={() => validateField("city")}
                        />
                    </label>
                </div>
                <div>
                    <label>
                        Status:
                        <input
                            type="text"
                            name="status"
                            value={formData.status}
                            onChange={handleFieldChange}
                            onBlur={() => validateField("status")}
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