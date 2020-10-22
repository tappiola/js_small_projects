const city = 'Minsk';
const apiKey = 'a94d0a5ac08570add4b47b8da933f247';

const getIcon = (item) => {
    return `http://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`;
}

const getWeatherDescription = (item) => {
    return item.weather[0].main;
}

const getTemp = (item) => {
    return Math.round(item.main.temp) + '°C';
}

const getDate = (item) => {
    return item.dt_txt.split(' ')[0]
}

const getTime = (item) => {
    return item.dt_txt.split(' ')[1].slice(0, 5);
    // another option to show exact time
    // return new Date().toLocaleString('en-GB', {hour: 'numeric', minute: 'numeric'});
}

const getLocation = (weatherData) => {
    return `${weatherData.city.name}, ${weatherData.city.country}`;
}

const getWindSpeed = (item) => {
    return Math.round(item.wind.speed * 10) / 10 + ' m/s';
}

const getWindDirection = (item) => {
    const degrees = item.wind.deg;
    if (degrees > 360 / 16 * 15) {
        return 'North'
    } else if (degrees > 360 / 16 * 13) {
        return 'North-West'
    } else if (degrees > 360 / 16 * 11) {
        return 'West'
    } else if (degrees > 360 / 16 * 9) {
        return 'South-West'
    } else if (degrees > 360 / 16 * 7) {
        return 'South'
    } else if (degrees > 360 / 16 * 5) {
        return 'South-East'
    } else if (degrees > 360 / 16 * 3) {
        return 'East'
    } else if (degrees > 360 / 16) {
        return 'North-East'
    } else {
        return 'North'
    }
}

const renderCurrentWeather = (weatherData) => {
    const temp = document.getElementsByTagName("template")[0];
    const item = temp.content.querySelector("div");

    const dayData = weatherData.list[0];

    const newDiv = document.importNode(item, true);
    newDiv.querySelector('img').src = getIcon(dayData);
    newDiv.querySelector('span.current-temp').textContent = getTemp(dayData);
    newDiv.querySelector('span.time').textContent = getTime(dayData);
    newDiv.querySelector('span.conditions').textContent = getWeatherDescription(dayData);
    newDiv.querySelector('span.location').textContent = getLocation(weatherData);
    newDiv.querySelector('span.wind-speed').textContent = getWindSpeed(dayData);
    newDiv.querySelector('span.wind-direction').textContent = getWindDirection(dayData);

    document.body.appendChild(newDiv);

}
const renderWeatherBlock = (dayData) => {
    const temp = document.getElementsByTagName("template")[1];
    const item = temp.content.querySelector("div");

    const newDiv = document.importNode(item, true);
    newDiv.querySelector('span.temp').textContent = getTemp(dayData);
    newDiv.querySelector('span.date').textContent = getDate(dayData);
    newDiv.querySelector('img').src = getIcon(dayData);

    document.body.appendChild(newDiv);
}
const showWeather = (response) => {
    const weatherData = response;
    renderCurrentWeather(weatherData);
    weatherData.list.filter(x => x.dt_txt.endsWith('12:00:00')).forEach(x => renderWeatherBlock(x));
}

const getWeatherData = () => {
    return new Promise((resolve, reject) => {

        let request = new XMLHttpRequest();
        request.responseType = 'json';
        request.onload = function () {
            resolve(request.response);

        }
        const paramsObject = {
            q: city,
            appid: apiKey,
            units: 'metric'
        };

        const target = new URL('https://cors-anywhere.herokuapp.com/https://api.openweathermap.org/data/2.5/forecast');
        target.search = new URLSearchParams(paramsObject).toString();
        console.log(target);

        request.open('GET', target.href);
        request.send();

    })
}

getWeatherData().then(response => showWeather(response));
