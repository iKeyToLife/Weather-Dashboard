const searchEl = $(`#search`);
const submitBtn = $(`#submit`);
const btnSectionEl = $(`.buttons-city`);
const sectionContainer = $(`.container-fluid`)
const APIKey = `548704e26170b9290cd2484ab2201149`;

class City {
    constructor(cityData) {
        this.id = cityData.id;
        this.name = cityData.name;
        this.country = cityData.country;
        this.state = cityData.state;
        this.lat = cityData.lat;
        this.lon = cityData.lon;
    }
}

// save city list in local storage
function setCityInLocalStorage(cityList) {
    localStorage.setItem("cityList", JSON.stringify(cityList));
}

// check have we in local storage current city
function saveInLocalStorage(dataCity) {
    let currentCityArray = getCityFromLocalStorage();
    console.log("check me/n")
    console.log(dataCity)
    const existsInLocalStorage = currentCityArray.some(city => city.id === dataCity.id);
    const newCity = new City(dataCity)
    if (!existsInLocalStorage) {
        currentCityArray.push(newCity);
        setCityInLocalStorage(currentCityArray);
    }
}

// get city list from local storage 
function getCityFromLocalStorage() {
    return JSON.parse(localStorage.getItem("cityList")) || [];
}


// get weather current city
function fetchWeatherByLatLon(currentData) {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${currentData.lat}&lon=${currentData.lon}&appid=${APIKey}&units=metric`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            currentData.id = data.id;
            // saveInLocalStorage(currentData);
            const temperature = data.main.temp;
            const humidity = data.main.humidity;
            const windSpeed = data.wind.speed;
            const weatherDescription = data.weather[0].description;
            const weatherIcon = data.weather[0].icon;
            const weatherIconUrl = `http://openweathermap.org/img/wn/${weatherIcon}@2x.png`;
            renderCurrentDayWeather(data);

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
function fetchForecastByLatLon(currentData) {
    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${currentData.lat}&lon=${currentData.lon}&appid=${APIKey}&units=metric`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            console.log(data)
        })
        .catch(error => console.error('Error:', error));
}




$(document).ready(function () {
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
            console.log(selectedData);
            console.log(`Selected: ${ui.item.value}`);
        }
    });

    $("#submit").click(function (event) {
        event.preventDefault();
        if (selectedData) {
            console.log("=====================================")
            console.log(selectedData.lat);
            fetchWeatherByLatLon(selectedData);
            fetchForecastByLatLon(selectedData);
        }
    });
});
function createBtnCard(city) {
    const btnEl = $(`<button></button>`)
        .addClass(`btn btn-primary col-12 text-white mb-2`)
        .text(`${city.name}${city.state ? ', ' + city.state : ''}, ${city.country}`)
        .attr(`data-task-id`, city.id);
    btnEl.on(`click`, function () {
        fetchWeatherByLatLon(city);
    });

    btnSectionEl.append(btnEl);
}

function renderInit() {
    btnSectionEl.empty();
    const cityList = getCityFromLocalStorage();
    for (let i = cityList.length - 1; i >= 0; i--) {
        createBtnCard(cityList[i])
    }
}

function renderCurrentDayWeather(data) {
    $(".container-fluid .city-weather-info").remove();

    const cityName = data.name;
    const temperature = data.main.temp;
    const humidity = data.main.humidity;
    const windSpeed = data.wind.speed;
    const weatherDescription = data.weather[0].description;
    const weatherIcon = data.weather[0].icon;
    const weatherIconUrl = `http://openweathermap.org/img/wn/${weatherIcon}@2x.png`;

    const today = dayjs();

    const formattedDate = today.format('MM/DD/YYYY');

    const weatherInfoHTML = `
    <div class="city-weather-info weather-section p-3 d-inline-block col">
        <div class="weather-details border border-white rounded p-3">
            <h2 class="city-name">${cityName} ${formattedDate} <img src="${weatherIconUrl}" alt="Weather Icon"
                    class="img-fluid weather-icon">
            </h2>
            <p class="description">Weather ${weatherDescription}</p>
            <p class="temperature">Temp: ${temperature}°C</p>
            <p class="wind">Wind: ${windSpeed} m/s</p>
            <p class="humidity">Humidity: ${humidity}%</p>
        </div>
    </div>`;
    $(".container-fluid").append(weatherInfoHTML);
}
renderInit()


// TODO:
// fetch forecast 5 days
// save localStorage id & NameCity country state
// render cards buttons city
// render cards weather and forecast
// make init