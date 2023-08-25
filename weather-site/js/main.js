const cityCoordinates = {};
/*Fetching City Coordinates:
The code uses the fetch() function to retrieve the content of a CSV file named city_coordinates.csv.
This file likely contains information about various cities, including their coordinates(latitude and longitude).*/
fetch('city_coordinates.csv')
    .then(response => response.text())
    .then(data => {
        const rows = data.split('\n');
        for (const row of rows.slice(1)) {
            const [latitude, longitude, city, country] = row.split(',');
            const cityName = city.toLowerCase().trim();
            cityCoordinates[cityName] = { lat: parseFloat(latitude), lon: parseFloat(longitude) };

            // Dynamically add city options to the selector
            const option = document.createElement('option');
            option.value = cityName;
            option.textContent = `${city}, ${country}`;
            citySelector.appendChild(option);
        }
    });

const fetchWeatherButton = document.getElementById('fetchWeather');
const citySelector = document.getElementById('citySelector');
const weatherDisplay = document.getElementById('weatherDisplay');

fetchWeatherButton.addEventListener('click', () => {
    const selectedCity = citySelector.value;
    const coordinates = cityCoordinates[selectedCity];
    if (!coordinates) {
        weatherDisplay.innerHTML = 'Coordinates not available.';
        return;
    }

    const apiUrl = `https://www.7timer.info/bin/api.pl?lon=${coordinates.lon}&lat=${coordinates.lat}&product=civil&output=json`;

    // Make API request
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            const currentDate = new Date();
            const forecastData = data.dataseries;

            let weatherHTML = `<h2>${selectedCity.toUpperCase()} Weather Forecast</h2>`;
            weatherHTML += '<ul>';

            for (let index = 0; index < 7; index++) {
                const forecastDate = new Date(currentDate);
                forecastDate.setDate(currentDate.getDate() + index); // Increment date for each forecast

                const dayData = forecastData[index];
                const formattedDate = forecastDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
                const weatherImage = getWeatherImage(dayData.weather);

                weatherHTML += `
                    <li>
                        <strong>${formattedDate}</strong><br>
                        <img class="weather-icon" src="${weatherImage}" alt="${dayData.weather}">
                        Temperature: ${dayData.temp2m}°C
                    </li>`;
            }

            weatherHTML += '</ul>';
            weatherDisplay.innerHTML = weatherHTML;
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
            weatherDisplay.innerHTML = 'An error occurred while fetching weather data.';
        });
});


//here i should add some error handling to ensure that the dayData.weather value is valid before attempting to retrieve an image path based on it. 
function getWeatherImage(weather) {
    const lowerCaseWeather = (weather || '').toLowerCase(); // Ensure 'weather' is not undefined
    const weatherImages = {
        clearday: './images/clear.png',
        pcloudynight: './images/pcloudy.png',
        mcloudyday: './images/mcloudy.png',
        cloudyday: './images/cloudy.png',
        lightrainday: './images/lightrain.png',
        lightrainnight: './images/lightrain.png',
        rain: './images/rain.png',
        lightsnow: './images/lightsnow.png',
        snow: './images/snow.png',
        ishowernight: './images/ishower.png ',
        oshowerday: './images/oshower.png',
        clearnight: './images/clear.png',
        humidnight: './images/humid.png',
        cloudynight: './images/cloudy.png',
        pcloudyday: './images/pcloudy.png',
        ishowerday: './images/ishower.png ',
        mcloudynight: './images/mcloudy.png',
        oshowernight: './images/oshower.png',
        tsday: './images/tsrain.png'


    };

    return weatherImages[lowerCaseWeather] || '/images/default.png';
}

// HERE ALSO 2ND APPROCH 

/*function getWeatherImage(weather) {
   
    const weatherImages = {
        clear: "./images/clear.png",
        pcloudy: './images/pcloudy.png',
        mcloudy: './images/mcloudy.png',
        cloudy: './images/cloudy.png',
        lightrain: './images/lightrain.png',
        rain: './images/rain.png',
        lightsnow: './images/lightsnow.png',
        snow: './images/snow.png'
    };

    const lowerCaseWeather = weather.toLowerCase();
    return weatherImages[lowerCaseWeather] || '/images/default.png';
}
getWeatherImage();*/
