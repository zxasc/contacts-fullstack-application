import { useState, useEffect } from 'react';
import { weatherCodes } from "../utils/weatherCodes.js";
import Form from "./Form";

export default function Contact(props) {
    const [contactData, setContactData] = useState(props.contact);
    const [isEditing, setIsEditing] = useState(false)
    const [weatherData, setWeatherData] = useState({
        temperature: '',
        weathercode: ''
    });
    useEffect(() => {
        fetchWeather(contactData.city).then(weather => setWeatherData(weather));
    }, [contactData]);

    const handleContactEdit = () => {
        setIsEditing(!isEditing);
    };

    const fetchWeather = async (city) => {
        try {
            const response = await fetch(`http://localhost:8000/weather/${city}`, {});
            if (!response.ok) {
                throw new Error('Could not fetch weather');
            }
            const weather_data = await response.json();
            return weather_data;
        } catch (e) {
            fetchWeather(city);
            throw Error(e);
        }
    }

    return (
        <>
            { !isEditing &&
                <div className="contact">
                    <h4>{contactData.name} {contactData.surname}</h4>
                    <p>{contactData.phone_number}</p>
                    <p>{contactData.email}</p>
                    <p>{contactData.city}</p>
                    <p>{weatherData.temperature}°C | {weatherCodes.get(weatherData.weathercode)}</p>
                    <p>{contactData.added_date}</p>
                    <button
                        onClick={() => handleContactEdit(props.id)}
                    >
                        Edit contact
                    </button>
                    <button
                        onClick={() => fetchWeather(props.city)}
                    >
                        Delete contact
                    </button>
                </div>
            }
            {isEditing &&
                <Form
                    isEditing={isEditing}
                    contact={contactData}
                    handleContactEdit={handleContactEdit}
                    updateContact={setContactData}
                />
            }
        </>
    )
}