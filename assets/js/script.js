const searchEl = $(`#search`);
const submitBtn = $(`#submit`);

// get weather current city
function fetchWeatherByLatLon(data) {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${data.lat}&lon=${data.lon}&appid=${data.apiKey}&units=metric`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            const temperature = data.main.temp;
            const humidity = data.main.humidity;
            const windSpeed = data.wind.speed;
            const weatherDescription = data.weather[0].description;
            const weatherIcon = data.weather[0].icon;
            const weatherIconUrl = `http://openweathermap.org/img/wn/${weatherIcon}@2x.png`;

            console.log(`Temperature: ${temperature}°C`);
            console.log(`Humidity: ${humidity}%`);
            console.log(`Wind Speed: ${windSpeed} m/s`);
            console.log(`Weather: ${weatherDescription}`);
            console.log(`Weather Icon: ${weatherIconUrl}`);
            console.log(data);
            console.log(url);
        })
        .catch(error => console.error('Error:', error));
}

// get forecast data
function fetchForecastByLatLon(data) {
    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${data.lat}&lon=${data.lon}&appid=${data.apiKey}&units=metric`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            console.log(data)
        })
        .catch(error => console.error('Error:', error));
}




$(document).ready(function () {
    const APIKey = `548704e26170b9290cd2484ab2201149`;
    const searchEl = $('#search');
    let selectedData = null;

    // autocomplete for input
    searchEl.autocomplete({
        //
        source: function (request, response) {
            $.ajax({
                url: `https://api.openweathermap.org/geo/1.0/direct?q=${request.term}&limit=5&appid=${APIKey}`,
                success: function (data) {
                    response(data.map(city => ({
                        label: `${city.name}, ${city.state ? city.state + ', ' : ''}${city.country}`,
                        value: `${city.name}, ${city.state ? city.state + ', ' : ''}${city.country}`,
                        cityData: city
                    })));
                }
            });
        },
        minLength: 2,
        select: function (event, ui) {
            selectedData = ui.item.cityData;
            selectedData.apiKey = APIKey;
            console.log(`Selected: ${ui.item.value}`);
        }
    });

    $("#submit").click(function (event) {
        event.preventDefault();
        if (selectedData) {
            fetchWeatherByLatLon(selectedData);
            fetchForecastByLatLon(selectedData);
        }
    });
});



// TODO:
// fetch forecast 5 days
// save localStorage id & NameCity country state
// render cards buttons city
// render cards weather and forecast
// make init