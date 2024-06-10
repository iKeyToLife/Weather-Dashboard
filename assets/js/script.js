const searchEl = $(`#search`);
const submitBtn = $(`#submit`);
const btnSectionEl = $(`.buttons-city`);
const sectionContainer = $(`.container-fluid`)
const APIKey = `548704e26170b9290cd2484ab2201149`;

// class for create new object city
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

    const existsInLocalStorage = currentCityArray.some(city => city.id === dataCity.id);

    // check if we have in local storage, then do not save new city
    if (!existsInLocalStorage) {
        const newCity = new City(dataCity)
        currentCityArray.push(newCity);
        setCityInLocalStorage(currentCityArray);
        createBtnCard(newCity);
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
            saveInLocalStorage(currentData);
            renderCurrentDayWeather(data);
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
            renderCurrentForecastWeather(data)
        })
        .catch(error => console.error('Error:', error));
}




$(document).ready(function () {
    const searchEl = $('#search');
    let selectedData = null;

    // autocomplete for input
    searchEl.autocomplete({
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

// create Buttons for city
function createBtnCard(city) {
    const btnEl = $(`<button></button>`)
        .addClass(`btn btn-primary col-12 text-white mb-2`)
        .text(`${city.name}${city.state ? ', ' + city.state : ''}, ${city.country}`)
        .attr(`data-task-id`, city.id);
    btnEl.on(`click`, function (event) {
        event.preventDefault();
        fetchWeatherByLatLon(city);
        fetchForecastByLatLon(city);
    });

    btnSectionEl.append(btnEl);
}

// Init last city weather
function renderInit() {
    btnSectionEl.empty();
    const cityList = getCityFromLocalStorage();
    for (let i = cityList.length - 1; i >= 0; i--) {
        createBtnCard(cityList[i])
    }
    if (cityList.length > 0) {
        fetchWeatherByLatLon(cityList[cityList.length - 1]);
        fetchForecastByLatLon(cityList[cityList.length - 1]);
    }
}

// render current day
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

    // create new HTML elemets for current day
    const weatherInfoHTML =
        `<div class="city-weather-info weather-section p-3 d-inline-block col">
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

// render forecast
function renderCurrentForecastWeather(data) {

    const forecastCard = $(`<div></div>`)
        .addClass(`forecast-weather row flex-wrap">`);
    const h2ForecastEl = `<h2 class="mt-2">5-Day Forecast</h2>`;
    forecastCard.append(h2ForecastEl);
    let today = dayjs();
    let daysMax = 0;

    // loop for check dates and create new elements daylist for 5 days
    for (let i = 0; i < data.list.length && daysMax < 5; i++) {

        const dateFromData = data.list[i].dt_txt.split(' ')[0];

        const currentDate = dayjs(dateFromData);

        // if same go start loop
        if (currentDate.isSame(today, 'day')) {
            continue;
            // if not same create element
        } else {
            // update today today to current for check next day
            today = currentDate;
            const temperature = data.list[i].main.temp;
            const humidity = data.list[i].main.humidity;
            const windSpeed = data.list[i].wind.speed;
            const weatherIcon = data.list[i].weather[0].icon;
            const weatherIconUrl = `http://openweathermap.org/img/wn/${weatherIcon}@2x.png`;
            const formattedDate = today.format('MM/DD/YYYY');
            const html = `<div class="col-2 mt-2">
                                    <div class="weather-sections">
                                        <div class="weather-section-small">
                                            <div class="weather-details-small border border-white rounded p-2">
                                                <h3 class="day-name">${formattedDate}</h3>
                                                <p class="description"><img src="${weatherIconUrl}" alt="Weather Icon"
                            class="img-fluid weather-icon"></p>
                                                <p class="temperature">Temp: ${temperature}°C</p>
                                                <p class="wind">Wind: ${windSpeed} m/s</p>
                                                <p class="humidity">Humidity: ${humidity}%</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>`

            forecastCard.append(html);

            daysMax++;
        }
    }
    // add to weather section forecast
    $(".weather-section").append(forecastCard);
}

renderInit()