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
                const error = await response.json();
                console.error("Error occurred: ", error);
            }
            const weather_data = await response.json();
            return weather_data;
        } catch (e) {
            //fetchWeather(city);
            console.error(e);
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
                <div className="card">
                    <div className="card-header">
                        <img
                            className="rounded-full border-1 border-eminence-300"
                            src="https://placecats.com/neo/100/100"
                        />
                        <div>
                            <h4 className="text-lg/6 font-semibold tracking-tight">{contactData.name} {contactData.surname}</h4>
                            <div className="ml-0 w-auto card-content">
                                <img
                                    className="card-icon"
                                    src="/mail.svg"
                                />
                                <p className="text-wrap wrap-anywhere text-xs">{contactData.email}</p>
                            </div>
                        </div>
                    </div>
                    <div className="card-content">
                        <img
                            className="card-icon"
                            src="/phone.svg"
                        />
                        <p className="">{contactData.phone_number}</p>
                    </div>
                    <div className="card-content">
                        <img
                            className="card-icon"
                            src="/city.svg"
                        />
                        <p className="">{contactData.city}</p>
                    </div>
                    <div className="card-content">
                        <img
                            className="card-icon"
                            src="/temp.svg"
                        />
                        <p className=""> {weatherData.temperature || "--"} °C</p>
                        <img
                            className="ml-2 card-icon"
                            src="/cloud.svg"
                        />
                        <p className="">{weatherCodes.get(weatherData.weathercode) || "--"}</p>
                    </div>
                    <div className="card-content">
                        <img
                            className="card-icon"
                            src="/status.svg"
                        />
                        <p>{contactData.status.charAt(0).toUpperCase()+contactData.status.slice(1)}</p>
                    </div>
                    <div className="card-content">
                        <img
                            className="card-icon"
                            src="/calendar.svg"
                        />
                        <p className="">{parseDate(contactData.added_date)}</p>
                    </div>
                    <div className="mt-3 card-content mx-auto">
                        <button
                            className="button"
                            onClick={() => handleContactEdit(props.id)}
                        >
                            Edytuj kontakt
                        </button>
                        <button
                            className="button danger"
                            onClick={() => fetchWeather(props.city)}
                        >
                           Usuń kontakt
                        </button>
                    </div>
                </div>
            }
            {isEditing &&
                <Form
                    contact={contactData}
                    isEditing={isEditing}
                    setIsEditing={setIsEditing}
                    statusList={props.statusList}
                    handleContactEdit={handleContactEdit}
                    updateContact={setContactData}
                />
            }
        </>
    )
}