import { useState, useEffect } from "react";
import { weatherCodes } from "../../utils/weatherCodes.js";
import Form from "../Form";
import { API_URL } from "../../utils/api.js";
import CardContent from "./CardContent";

export default function Contact(props) {
  const [contactData, setContactData] = useState(props.contact);
  const [isEditing, setIsEditing] = useState(false);
  const [weatherData, setWeatherData] = useState({
    temperature: "--",
    weathercode: "0",
  });
  useEffect(() => {
    const loadWeather = async () => {
      try {
        const weather = await fetchWeather(contactData.city);
        setWeatherData(weather);
      } catch (error) {
        console.error("Error fetching weather data:", error);
      }
    };
    loadWeather();
  }, [contactData]);

  const handleContactEdit = (id) => {
    setIsEditing(!isEditing);
  };

  const fetchWeather = async (city) => {
    try {
      const response = await fetch(`${API_URL}/weather/${city}`, {});
      if (!response.ok) {
        const error = await response.json();
        console.log("Error occurred: ", error);
      }
      const weather_data = await response.json();
      return weather_data;
    } catch (e) {
      console.error(e);
      return {
        temperature: "--",
        weathercode: "0",
      };
    }
  };

  const deleteContact = async (id) => {
    try {
      const response = await fetch(`${API_URL}/api/contacts/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        const error = await response.json();
        console.error("Error occurred: ", error);
      }
      props.deleteContact(id);
    } catch (e) {
      console.error(e);
    }
  };

  const parseDate = (date) => {
    const dateArr = date.slice(0, 10).split("-");
    const dateStr = dateArr.reverse().join(".");
    return dateStr;
  };

  return (
    <>
      {!isEditing && (
        <div className="card">
          <div className="card-header">
            <img
              className="rounded-full border-1 border-eminence-300"
              src="https://placecats.com/neo/100/100"
            />
            <div>
              <h4 className="text-lg/6 font-semibold tracking-tight">
                {contactData.name} {contactData.surname}
              </h4>
              <div className="ml-0 w-auto card-content">
                <img className="card-icon" src="/mail.svg" />
                <p className="text-wrap wrap-anywhere text-xs">
                  {contactData.email}
                </p>
              </div>
            </div>
          </div>

          <CardContent icon="phone.svg" text={contactData.phone_number} />
          <CardContent icon="city.svg" text={contactData.city} />
          <CardContent
            icon="temp.svg"
            text={`${weatherData.temperature} °C` || "--"}
          />
          <CardContent
            icon="cloud.svg"
            text={weatherCodes.get(Number(weatherData.weathercode)) || "--"}
          />
          <CardContent
            icon="status.svg"
            text={
              contactData.status.charAt(0).toUpperCase() +
              contactData.status.slice(1)
            }
          />
          <CardContent
            icon="calendar.svg"
            text={parseDate(contactData.added_date)}
          />

          <div className="mt-3 card-content mx-auto">
            <button
              className="button"
              onClick={() => handleContactEdit(contactData.id)}
            >
              Edytuj kontakt
            </button>
            <button
              className="button danger"
              onClick={() => deleteContact(contactData.id)}
            >
              Usuń kontakt
            </button>
          </div>
        </div>
      )}
      {isEditing && (
        <Form
          contact={contactData}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          statusList={props.statusList}
          handleContactEdit={handleContactEdit}
          updateContact={setContactData}
        />
      )}
    </>
  );
}
