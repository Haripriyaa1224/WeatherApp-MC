import React, { useState } from 'react';
import './Main.css';
import axios from 'axios';

const Main = () => {
  const cities = ['Las Vegas', 'London', 'Los Angeles', 'New York'];
  const [currentCityIndex, setCurrentCityIndex] = useState(0);
  const [weatherData, setWeatherData] = useState([]);
  const [highlightedCities, setHighlightedCities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchCity, setSearchCity] = useState(''); 
  const [highlightedRow, setHighlightedRow] = useState(null); 

  // Function to calculate Data Age in hours
  const calculateDataAge = (dataTime) => {
    const currentTime = new Date();
    const weatherTime = new Date(dataTime);
    const diffInMilliseconds = currentTime - weatherTime;
    const diffInHours = (diffInMilliseconds / (1000 * 60 * 60)).toFixed(2); 
    return diffInHours;
  };

  const fetchWeatherData = async () => {
    if (currentCityIndex >= cities.length) return;

    try {
      setLoading(true);
      setError('');
      const city = cities[currentCityIndex];
      const response = await axios.get(`https://python3-dot-parul-arena-2.appspot.com/test?cityname=${city}`);

      setWeatherData(prevData => [...prevData, { city, ...response.data }]);
      setHighlightedCities(prev => [...prev, currentCityIndex]);
      setLoading(false);
      setCurrentCityIndex(prevIndex => prevIndex + 1);
    } catch (err) {
      setLoading(false);
      setError('Failed to fetch weather data.');
    }
  };

  const handleDelete = (index, cityIndex) => {
    setWeatherData(prevData => prevData.filter((_, i) => i !== index));
    setHighlightedCities(prev => prev.filter(highlightedIndex => highlightedIndex !== cityIndex));
    setCurrentCityIndex(prev => Math.max(prev - 1, 0));
  };

  const handleDescriptionChange = (index, value) => {
    setWeatherData(prevData => prevData.map((data, i) => (i === index ? { ...data, description: value } : data)));
  };

  // Search and highlight row for 3 seconds
  const handleSearch = () => {
    const cityIndex = weatherData.findIndex(data => data.city.toLowerCase() === searchCity.toLowerCase());
    
    if (cityIndex !== -1) {
      setHighlightedRow(cityIndex); // Set the highlighted row index

      // Remove highlight after 3 seconds
      setTimeout(() => {
        setHighlightedRow(null);
      }, 3000);
    }
  };

  return (
    <>
      <div className="main">
        <div className="aside">
          <button onClick={fetchWeatherData} disabled={currentCityIndex >= cities.length}>
            Get Weather
          </button>
          <p>City</p>

          <table style={{ border: '1px solid black', borderCollapse: 'collapse' }}>
            <tbody>
              {cities.map((city, index) => (
                <tr
                  key={city}
                  style={{
                    border: highlightedCities.includes(index) ? '2px solid #00F700' : '1px solid gray',
                  }}
                >
                  <td style={{ padding: '5px' }}>{city}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="divider"></div>
        <div className="middle">
          <div className="search-bar">
            <input
              type="text"
              placeholder="City Name"
              value={searchCity}
              onChange={(e) => setSearchCity(e.target.value)} 
            />
            <button onClick={handleSearch}>Search</button>
          </div>

          <table style={{ border: '1px solid black', borderCollapse: 'collapse' }}>
            <tbody>
              <tr>
                <td style={{ border: '1px solid black', padding: '10px' }}>City</td>
                <td style={{ border: '1px solid black', padding: '10px' }}>Description</td>
                <td style={{ border: '1px solid black', padding: '10px' }}>Temperature</td>
                <td style={{ border: '1px solid black', padding: '10px' }}>Pressure</td>
                <td style={{ border: '1px solid black', padding: '10px' }}>Humidity</td>
                <td style={{ border: '1px solid black', padding: '10px' }}>Data Age (hrs)</td>
                <td style={{ border: '1px solid black', padding: '10px' }}>Action</td>
              </tr>

              {loading ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center' }}>Loading...</td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', color: 'red' }}>{error}</td>
                </tr>
              ) : weatherData.length > 0 ? (
                weatherData.map((data, index) => (
                  <tr
                    key={index}
                    style={{
                      backgroundColor: highlightedRow === index ? 'yellow' : 'transparent', 
                    }}
                  >
                    <td style={{ border: '1px solid black' }}>{data.city}</td>
                    <td style={{ border: '1px solid black' }}>
                      <input
                        type="text"
                        value={data.description}
                        onChange={(e) => handleDescriptionChange(index, e.target.value)}
                      />
                    </td>
                    <td style={{ border: '1px solid black' }}>{data.temp_in_celsius} °C</td>
                    <td style={{ border: '1px solid black' }}>{data.pressure_in_hPa} hPa</td>
                    <td style={{ border: '1px solid black' }}>{data.humidity_in_percent} %</td>
                    <td style={{ border: '1px solid black' }}>{calculateDataAge(data.date_and_time)} hrs</td>
                    <td style={{ border: '1px solid black' }}>
                      <button onClick={() => handleDelete(index, cities.indexOf(data.city))}>Delete</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center' }}>
                    <h1>No Data</h1>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default Main;
