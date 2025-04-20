import * as yup from 'yup';
import {useEffect, useState} from "react";

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
    const [statusList, setStatusList] = useState([])
    useEffect(() => {
        const loadStatusOptions = async () => {
            setIsLoading(true);
            try {
                const statusOptions = await fetchStatusOptions();
                setStatusList(statusOptions);
            } finally {
                setIsLoading(false);
            }
        }
        loadStatusOptions();
    }, []);

    const fetchStatusOptions = async () => {
        try {
            const response = await fetch(`http://localhost:8000/api/status-options`);
            if (!response.ok) {
                throw Error(response.statusText);
            }
            const statusOptions = await response.json();
            return statusOptions;
        } catch (e) {
            throw Error(e);
        }
    }

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
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.detail);
            }

            const result = await response.json();
            if (props.isEditing) {
                props.updateContact(result);
            } else {
                props.addContact(result);
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
        <form className="contacts-row" onSubmit={handleSubmit}>
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
                    <select
                        name="status"
                        value={formData.status}
                        onChange={handleFieldChange}
                    >
                        {statusList.map((status, i) => (
                            <option
                                key={i}
                                value={status}
                            >
                                {status.charAt(0).toUpperCase()+status.slice(1)}
                            </option>
                        ))}
                    </select>
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
    )
}