let key;

const keyPromise = fetch('/api/key')
  .then(response => response.json())
  .then(data => {
    return data.api_key;
  })
  .catch(error => {
    console.error('Error fetching API key:', error);
});

async function search() {
    try {
        const key = await keyPromise;
        const phrase = document.querySelector('input[type="text"]').value;
        const response = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${phrase}&limit=5&appid=${key}`);
        const data = await response.json();
        const ul = document.querySelector('form ul');
        ul.innerHTML = '';
        for (let i = 0; i < data.length; i++) {
            const { name, lat, lon, country, state} = data[i];
            
            let locationString = `${name} <span>${country}`;
            if (state !== undefined) {
                locationString += `, ${state}`;
            } else {
                locationString += `</span>`;
            }

            ul.innerHTML += `<li
                data-lat="${lat}"
                data-lon="${lon}"
                data-name="${name}"
                data-country="${country}"
                data-state="${state}">
                ${locationString}</li>`;
            }
        } catch (error) {
            console.error('Error:', error);
    }
}

// Lodash debounce function
const debouncedSearch = _.debounce(() => {
    search();
}, 500);

function updateTheme(temp) {
    var mainElement = document.querySelector('body');

    if (temp <= 20) {
        mainElement.classList.remove('hot-theme');
        mainElement.classList.add('cool-theme');
    } else if (temp > 20) {
        mainElement.classList.remove('cool-theme');
        mainElement.classList.add('hot-theme');
    }
}

async function showWeather(lat, lon, name, state, country) {
    try {
        const key = await keyPromise;
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${key}&units=metric`);
        const data = await response.json();
        const temp = Math.round(data.main.temp);
        const temp_min = Math.round(data.main.temp_min);
        const temp_max = Math.round(data.main.temp_max);
        const feelsLike = Math.round(data.main.feels_like);
        const humidity = Math.round(data.main.humidity);
        const wind = Math.round(data.wind.speed);
        const desc = data.weather[0].description;
        const icon = data.weather[0].icon;
        updateTheme(temp);

        if (state !== 'undefined') {
            document.getElementById('city').innerHTML = name + `<span>, ${state}, ${country}</span>`;
        } else {
            document.getElementById('city').innerHTML = name + `<span>, ${country}</span>`;
        }

        function capitalizeWords(str) {
            return str.replace(/\b\w/g, match => match.toUpperCase());
        }

        document.getElementById('desc').innerHTML = capitalizeWords(desc);
        document.getElementById('degrees').innerHTML = temp + '<span>&degC</span>';
        document.getElementById('minValue').innerHTML = temp_min + '<span>&degC</span>';
        document.getElementById('maxValue').innerHTML = temp_max + '<span>&degC</span>';
        document.getElementById('feelsLikeValue').innerHTML = feelsLike + '<span>&degC</span>';
        document.getElementById('windValue').innerHTML = wind + '<span>km/h</span>';
        document.getElementById('humidityValue').innerHTML = humidity + '<span>%</span>';
        document.getElementById('icon').src = `https://openweathermap.org/img/wn/${icon}@4x.png`
        document.querySelector('form').style.display = 'none';
        document.getElementById('weatherContainer').style.display = 'block';
      } catch (error) {
        console.error('Error:', error);
    }
}

async function showForecast(lat, lon) {
    try {
        const key = await keyPromise;
        const response2 = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${key}&units=metric`);
        const data = await response2.json();
        document.getElementById('weatherforecastContainer').style.display = 'grid';
        document.getElementById('forecastTitle').style.display = 'block';
        for (let i = 0; i < 5; i++) {
            document.getElementById("day" + (i + 1) + "min").innerHTML = "Min: " + data.list[i].main.temp_min + '<span>&degC</span>'; 
            document.getElementById("day" + (i + 1) + "max").innerHTML = "Max: " + data.list[i].main.temp_max + '<span>&degC</span>';
            document.getElementById("img" + (i + 1)).src = "https://openweathermap.org/img/wn/"+ data.list[i].weather[0].icon +".png";
        }
      } catch (error) {
        console.error('Error:', error);
    }
}

const d = new Date();
const weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

function checkDay(day) {
    if (day +d.getDay() > 6){
        return day + d.getDay() - 7;
    }
    else{
        return day + d.getDay();
    }
}

for (i = 0; i < 5; i++) {
    document.getElementById("day" + (i + 1)).innerHTML = weekday[checkDay(i)];
}

document.querySelector('input[type="text"]').addEventListener('keyup', debouncedSearch);

function showWeatherElements() {
    document.getElementById('weatherContainer').style.display = 'block';
    document.getElementById('forecastTitle').style.display = 'block';
    document.getElementById('weatherforecastContainer').style.display = 'grid';

    fadeInElement(weatherContainer);
    fadeInElement(forecastTitle);
    fadeInElement(weatherforecastContainer);
}

function hideWeatherElements() {
    document.getElementById('weatherContainer').style.display = 'none';
    document.getElementById('forecastTitle').style.display = 'none';
    document.getElementById('weatherforecastContainer').style.display = 'none';

    fadeOutElement(weatherContainer);
    fadeOutElement(forecastTitle);
    fadeOutElement(weatherforecastContainer);
}

function fadeInElement(element) {
    element.style.opacity = 0;
    element.style.display = 'block';
    
    requestAnimationFrame(() => {
        element.classList.add('fade-in');
        element.style.opacity = 1;
    });
}

function fadeOutElement(element) {
    element.style.opacity = 1;
    
    requestAnimationFrame(() => {
        element.classList.remove('fade-in');
        element.style.opacity = 0;
        element.style.display = 'none';
    });
}

const updateWeather = (lat, lon, name, state, country) => {
    if (lat) {
        localStorage.setItem('lat', lat);
        localStorage.setItem('lon', lon);
        localStorage.setItem('name', name);
        localStorage.setItem('state', state);
        localStorage.setItem('country', country);
        showWeather(lat, lon, name, state, country);
        showForecast(lat, lon);
        showWeatherElements();
    } else {
        hideWeatherElements();
    }
};

document.querySelector('ul').addEventListener('click', ev => {
    const {lat, lon, name, state, country} = ev.target.dataset;
    updateWeather(lat, lon, name, state, country);
});

document.querySelector('input[type="text"]').addEventListener('keydown', ev => {
    if (ev.key === 'Enter') {
        const firstLi = document.querySelector('li');
        if (firstLi) {
            const {lat, lon, name, country, state} = firstLi.dataset;
            updateWeather(lat, lon, name, state, country);
        }
    }
});

function handleButtonClick() {
    hideWeatherElements();
    document.querySelector('form').style.display = 'block';
    document.querySelector('body').classList.remove('cool-theme', 'hot-theme');
}
  
document.getElementById('change').addEventListener('click', handleButtonClick);
document.getElementById('home').addEventListener('click', handleButtonClick);

document.body.onload = () => {
    hideWeatherElements();
    const lat = localStorage.getItem('lat');
    const lon = localStorage.getItem('lon');
    const name = localStorage.getItem('name');
    const state = localStorage.getItem('state');
    const country = localStorage.getItem('country');

    if (lat !== null && lon !== null && name !== null && state !== null && country !== null) {
        showWeather(lat, lon, name, state, country);
        showForecast(lat, lon);
        showWeatherElements();
}
}