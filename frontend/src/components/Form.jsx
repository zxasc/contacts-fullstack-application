import { useEffect, useState } from "react";
import { contactSchema } from "../utils/contactSchema.js";
import CardContent from "./CardContent.jsx";

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
                const error = await response.json();
                console.error(error);
            }
            const statusOptions = await response.json();
            return statusOptions;
        } catch (e) {
            console.error("Error occurred: ", e);
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
            console.error("Error occurred: ", e);
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
                console.error("Error occurred: ", error);
            }

            const result = await response.json();
            console.log(result);
            if (props.isEditing) {
                props.updateContact(result);
            } else {
                props.addContact(result);
            }
        } catch (e) {
            console.error("Error occurred: ", e);
        } finally {
            if (props.isEditing) {
                props.handleContactEdit();
            }
            setIsLoading(false);
        }
    }

    return (
        <form className="card items-center justify-end gap-2 bg-eminence-100" onSubmit={handleSubmit}>
            <div className="card-content">
                <h3 className="text-xl font-semibold">{props.isEditing ? "Edytowanie" : "Nowy kontakt"}</h3>
            </div>
            {/*<CardContent*/}
            {/*    type="form"*/}
            {/*    formData={formData}*/}
            {/*    setFormData={setFormData}*/}
            {/*    icon="id"*/}
            {/*    input="text"*/}
            {/*    name="name"*/}
            {/*    placeholder="Imię"*/}
            {/*/>*/}
            <div className="card-content">
                <label>
                    <img
                        className="card-icon"
                        src="/id.svg"
                    />
                    <input
                        type="text"
                        name="name"
                        placeholder="imie"
                        value={formData.name}
                        onChange={handleFieldChange}
                        onBlur={() => validateField("name")}
                    />
                </label>
            </div>
            <div className="card-content">
                <label>
                    <img
                        className="card-icon"
                        src="/signature.svg"
                    />
                    <input
                        type="text"
                        name="surname"
                        placeholder="Nazwisko"
                        value={formData.surname}
                        onChange={handleFieldChange}
                        onBlur={() => validateField("surname")}
                    />
                </label>
            </div>
            <div className="card-content">
                <label>
                    <img
                        className="card-icon"
                        src="/mail.svg"
                    />
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleFieldChange}
                        onBlur={() => validateField("email")}
                    />
                </label>
            </div>
            <div className="card-content">
                <label>
                    <img
                        className="card-icon"
                        src="/phone.svg"
                    />
                    <input
                        type="text"
                        name="phone_number"
                        placeholder="Numer telefonu"
                        value={formData.phone_number}
                        onChange={handleFieldChange}
                        onBlur={() => validateField("phone_number")}
                    />
                </label>
            </div>
            <div className="card-content">
                <label>
                    <img
                        className="card-icon"
                        src="/city.svg"
                    />
                    <input
                        type="text"
                        name="city"
                        placeholder="Miasto zamieszkania"
                        value={formData.city}
                        onChange={handleFieldChange}
                        onBlur={() => validateField("city")}
                    />
                </label>
            </div>
            <div className="card-content">
                <label>
                    <img
                        className="card-icon"
                        src="/status.svg"
                    />
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
            <div className="card-content mx-auto">
                {props.isEditing && (
                    <button
                        className="button danger"
                        onClick={() => props.setIsEditing(false)}
                    >
                        Przerwij
                    </button>
                )}
                <button
                    className="button"
                    onClick={handleSubmit}
                    type="submit"
                    disabled={isLoading}
                >
                    {props.isEditing ? ("Zatwierdź") : ("Dodaj kontakt")}
                </button>
            </div>
        </form>
    )
}