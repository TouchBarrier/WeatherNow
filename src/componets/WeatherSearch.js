import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const WeatherSearch = () => {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [image, setImage] = useState(null);

  // Function to fetch weather and place photo
  const fetchWeather = async () => {
    try {
      // Fetch weather data
      const weatherResponse = await fetch(
        `https://api.weatherapi.com/v1/current.json?key=08c5819afdca4dcc86a131118240611&q=${city}`
      );
      const weatherData = await weatherResponse.json();

      // Check if the city is valid
      if (weatherData.error) {
        toast.error('City not found. Please enter a valid city name.');
        setWeather(null);
        setImage(null);
        return;
      }

      // Set the weather data
      setWeather(weatherData.current);

      // Fetch photo reference from Google Places API
      const photoReference = await fetchPlacePhoto(city);

      if (photoReference) {
        // Fetch the image from the Google Places Photo API
        const imageResponse = await fetch(
          `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photo_reference=${photoReference}&key=YOUR_GOOGLE_API_KEY`
        );
        setImage(imageResponse.url);
      } else {
        setImage(null);
      }

    } catch (err) {
      console.error('Error fetching data:', err);
      toast.error('Something went wrong. Please try again later.');
    }
  };

  // Function to fetch the photo reference from Google Places API
  const fetchPlacePhoto = async (city) => {
    try {
      const placeSearchResponse = await fetch(
        `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${city}&key=YOUR_GOOGLE_API_KEY`
      );
      const placeSearchData = await placeSearchResponse.json();

      // If the place has photos, return the photo_reference
      if (placeSearchData.results && placeSearchData.results.length > 0) {
        const photoReference = placeSearchData.results[0].photos[0].photo_reference;
        return photoReference;
      }
      return null;
    } catch (error) {
      console.error('Error fetching place photo reference:', error);
      return null;
    }
  };

  // Handle search button click
  const handleSearch = () => {
    if (city.trim() !== '') {
      fetchWeather();
    } else {
      toast.error('Please enter a city name');
    }
  };

  return (
    <div className="weather-search">
      <ToastContainer position="top-center" autoClose={3000} />
      <h1>Weather Now</h1>
      <input
        type="text"
        placeholder="Enter city name"
        value={city}
        onChange={(e) => setCity(e.target.value)}
      />
      <button onClick={handleSearch}>Search</button>

      {/* Background Image */}
      {image && (
        <div
          className="city-image"
          style={{
            backgroundImage: `url(${image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            height: '400px',
            width: '100%',
            position: 'relative',
          }}
        >
          {/* Weather Info Overlay */}
          <div
            className="weather-info-overlay"
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              padding: '20px',
              borderRadius: '10px',
              color: 'white',
              textAlign: 'center',
              maxWidth: '500px',
              width: '100%',
            }}
          >
            {weather && (
              <div className="weather-info">
                <p>Temperature: {weather.temp_c}°C</p>
                <p>Windspeed: {weather.wind_kph} km/h</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Fallback message if no city image is available */}
      {!image && weather && (
        <div className="weather-info">
          <p>Temperature: {weather.temp_c}°C</p>
          <p>Windspeed: {weather.wind_kph} km/h</p>
        </div>
      )}
    </div>
  );
};

export default WeatherSearch;
