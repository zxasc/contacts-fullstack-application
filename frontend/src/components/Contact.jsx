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
            //fetchWeather(city);
            throw Error(e);
        }
    }

    const parseDate = (date) => {
        const dateArr = date.slice(0,10).split('-');
        const dateStr = dateArr.reverse().join('.');
        return dateStr;
    }

    return (
        <>
            { !isEditing &&
                <div className="contacts-row">
                    <div className="contacts-name">
                        <h4 className="">{contactData.name} {contactData.surname}</h4>
                        <p className="">{parseDate(contactData.added_date)}</p>
                    </div>
                    <div>
                        <p className="">{contactData.phone_number}</p>
                    </div>
                    <div>
                        <p className="">{contactData.email}</p>
                    </div>
                    <div>
                        <p className="">{contactData.city} | {weatherData.temperature}°C | {weatherCodes.get(weatherData.weathercode)}</p>
                    </div>
                    <div>
                        <p>{contactData.status}</p>
                    </div>
                    <div>
                        <button
                            className="button"
                            onClick={() => handleContactEdit(props.id)}
                        >
                            Edit contact
                        </button>
                        <button
                            className="button"
                            onClick={() => fetchWeather(props.city)}
                        >
                            Delete contact
                        </button>
                    </div>
                </div>
            }
            {isEditing &&
                <Form
                    contact={contactData}
                    isEditing={isEditing}
                    statusList={props.statusList}
                    handleContactEdit={handleContactEdit}
                    updateContact={setContactData}
                />
            }
        </>
    )
}