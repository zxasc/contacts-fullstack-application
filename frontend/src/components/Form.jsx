import * as yup from "yup";
import { transformYupErrorsIntoObject } from "../utils/TransformYupErrorIntoObject.js";
import { useEffect, useState } from "react";
import { contactSchema } from "../utils/contactSchema.js";
import FormField from "./FormField.jsx";
import { API_URL } from "../utils/api.js";

export default function Form(props) {
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  // Set default state for `status`, if it hasn't been provided
  const [formData, setFormData] = useState({
    ...props.contact,
    status: props.contact.status || "nowy",
  });
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

  const validateField = async (field, value) => {
    try {
      const fieldSchema = yup.object().shape({
        [field]: contactSchema.fields[field],
      });
      await fieldSchema.validate(
        { [field]: value },
        { abortEarly: false, strict: false },
      );
      setErrors((prevState) => ({ ...prevState, [field]: "" }));
    } catch (err) {
      const validationErrors = transformYupErrorsIntoObject(err);
      setErrors((prev) => ({ ...prev, [field]: validationErrors[field] }));
    }
  };

  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
    validateField(name, value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await contactSchema.validate(formData, { abortEarly: false });

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

      if (props.isEditing) {
        props.updateContact(result);
        setFormData({
          name: "",
          surname: "",
          email: "",
          phone_number: "",
          status: "nowy",
        });
      } else {
        props.addContact(result);
        setFormData({
          name: "",
          surname: "",
          email: "",
          phone_number: "",
          status: "nowy",
        });
      }
    } catch (err) {
      const validationErrors = transformYupErrorsIntoObject(err);
      setErrors((prev) => ({ ...prev, validationErrors }));
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
        error={errors.name}
      />
      <FormField
        icon="/signature.svg"
        type="text"
        name="surname"
        placeholder="Nazwisko"
        value={formData.surname}
        onChange={handleFieldChange}
        error={errors.surname}
      />
      <FormField
        icon="/mail.svg"
        type="email"
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleFieldChange}
        error={errors.email}
      />
      <FormField
        icon="/phone.svg"
        type="text"
        name="phone_number"
        placeholder="Numer telefonu"
        value={formData.phone_number}
        onChange={handleFieldChange}
        error={errors.phone_number}
      />
      <FormField
        icon="/city.svg"
        type="text"
        name="city"
        placeholder="Miasto zamieszkania"
        value={formData.city}
        onChange={handleFieldChange}
        error={errors.city}
      />
      <div className="card-content">
        <label>
          <div className="flex flex-row gap-2 items-center">
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
          </div>
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
