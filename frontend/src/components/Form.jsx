import { useEffect, useState } from "react";
import { contactSchema } from "../utils/contactSchema.js";
import FormField from "./FormField.jsx";
import { API_URL } from "../utils/api.js";

export default function Form(props) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState(props.contact);
  const [statusList, setStatusList] = useState([]);
  useEffect(() => {
    const loadStatusOptions = async () => {
      setIsLoading(true);
      try {
        const statusOptions = await fetchStatusOptions();
        setStatusList(statusOptions);
      } finally {
        setIsLoading(false);
      }
    };
    loadStatusOptions();
  }, []);

  const fetchStatusOptions = async () => {
    try {
      const response = await fetch(`${API_URL}/api/status-options`);
      if (!response.ok) {
        const error = await response.json();
        console.error(error);
      }
      const statusOptions = await response.json();
      return statusOptions;
    } catch (e) {
      console.error("Error occurred: ", e);
    }
  };

  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));

    const timeoutId = setTimeout(() => {
      validateField(name, value);
    }, 500);

    return () => clearTimeout(timeoutId);
  };

  const validateField = async (field, value) => {
    try {
      await contactSchema.validateAt(field, { [field]: value });
    } catch (e) {
      console.error("Error occurred: ", e);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // await contactSchema.validate(formData, { abortEarly: false });
      // TODO: Add duplicate detection and validation
      let url = `${API_URL}/api/contacts/`;
      let method = "POST";
      if (props.isEditing) {
        url = `${API_URL}/api/contacts/${props.contact.id}`;
        method = "PUT";
      }
      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
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
  };

  return (
    <form
      className="card items-center justify-end gap-2 bg-eminence-100"
      onSubmit={handleSubmit}
    >
      <div className="card-content">
        <h3 className="text-xl font-semibold">
          {props.isEditing ? "Edytowanie" : "Nowy kontakt"}
        </h3>
      </div>
      <FormField
        icon="/id.svg"
        type="text"
        name="name"
        placeholder="Imie"
        value={formData.name}
        onChange={handleFieldChange}
        onBlur={() => validateField("name")}
      />
      <FormField
        icon="/signature.svg"
        type="text"
        name="surname"
        placeholder="Nazwisko"
        value={formData.surname}
        onChange={handleFieldChange}
        onBlur={() => validateField("surname")}
      />
      <FormField
        icon="/mail.svg"
        type="email"
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleFieldChange}
        onBlur={() => validateField("email")}
      />
      <FormField
        icon="/phone.svg"
        type="text"
        name="phone_number"
        placeholder="Numer telefonu"
        value={formData.phone_number}
        onChange={handleFieldChange}
        onBlur={() => validateField("phone_number")}
      />
      <FormField
        icon="/city.svg"
        type="text"
        name="city"
        placeholder="Miasto zamieszkania"
        value={formData.city}
        onChange={handleFieldChange}
        onBlur={() => validateField("city")}
      />
      <div className="card-content">
        <label>
          <img className="card-icon" src="/status.svg" />
          <select
            name="status"
            value={formData.status}
            onChange={handleFieldChange}
          >
            {statusList.map((status, i) => (
              <option key={i} value={status}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
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
          {props.isEditing ? "Zatwierdź" : "Dodaj kontakt"}
        </button>
      </div>
    </form>
  );
}
