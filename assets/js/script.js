const searchEl = $(`#search`);
const submitBtn = $(`#submit`)

const APIKey = `548704e26170b9290cd2484ab2201149`;
let city;
const URLWeather = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APIKey}`;


$(document).ready(function () {

    const changeColor = () => {
        const theme = localStorage.getItem('headerColor') === 'true';
        $(':root').css({
            '--header-yellow': theme ? 'var(--dark)' : 'var(--yellow)',
            '--header-dark': theme ? 'var(--yellow)' : 'var(--dark)'
        });
    };


    changeColor();


    $('.header').click(function () {

        const currentTheme = localStorage.getItem('headerColor') === 'true';
        localStorage.setItem('headerColor', !currentTheme);
        changeColor();
    });
});

function something(event) {
    event.preventDefault();
    console.log(searchEl.val().trim())
}

submitBtn.on('click', function (event) {
    event.preventDefault();
    something(event);
});