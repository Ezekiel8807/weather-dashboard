// let's assign the key to a variable so I don't have to worry about typing it throughout the script.
var apiKey = '876a9cd8007aec3aef4fd80583307842';
// and let's create element var's to play with

// input from the search bar
var citySearchEl = $("#city");
// display for city name on the page
var cityNameEl = $("#searched-city")
// display for weather
var currentWeather = $("#current-weather")
// display for 5-day weather
var fiveDayDisplay = $("#five-day-forecast")
// create an array for the purpose of monitoring all the buttons
var searchedCities = [];

/* DATA TO FOCUS ON:
    TEMP
    WIND
    HUMIDITY
    UV-INDEX [current day only]
*/

function formSubmitHandler(event) {
    event.preventDefault()
    // grab the input value and store it in a variable
    var city = citySearchEl.val().trim();

    if (city) {
        citySearchEl.val('')
        getGenInfo(city)
    } else {
        alert("Please enter a valid city")
    }
}

function getGenInfo(city){
    var directGeoCode = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&&appid=${apiKey}`
    //fetch the general info - we want city name, state name, and lat/lon
    fetch(directGeoCode).then(function(response){
        if(response.ok) {
            response.json().then(function(data){
                displayGenInfo(data, city)
                getCurrentWeather(data[0].lat, data[0].lon)
            })
        } else {
            alert("Error: City Not Found")
        }
    })
    .catch(function(error){
        alert("Unable to Connect to Weather System")
    })
}

function displayGenInfo(data, city){
    //get the city name and state together
    var cityState = data[0].name + ", " + data[0].state;
    $("#searched-city").text(cityState)

    // create a button with the data that's present.
    var recentSearch = document.createElement("button");
    recentSearch.setAttribute("class", "btn btn-primary")
    recentSearch.setAttribute("id", "history")
    recentSearch.textContent = data[0].name;
    //Make sure that no duplicate buttons can be made
    if (!searchedCities.includes(recentSearch.textContent)){
        //debugger;
        searchedCities.push(recentSearch.textContent);
        $("#recent-searches").append(recentSearch)
    }
}

function getCurrentWeather(lat, lon){
    var oneCall = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&exclude=hourly,minutely&appid=${apiKey}`

    fetch(oneCall).then(function(response){
        if(response.ok){
            response.json().then(function(data){
                displayCurrentInfo(data.current);
                displayFiveDayInfo(data.daily)
            })
        } else {
            alert("City Not Found")
        }
    })
    .catch(function(error){
        alert("Unable to Connect to Weather System")
    })
}

function displayCurrentInfo(weather) {
    //clear out the list for every call
    currentWeather.children().remove()

    // var for the current Date-
    var currentDate = new Date(weather.dt * 1000).toLocaleDateString()
    //append to the screen
    $("#searched-city").append(" " + currentDate)

    // var for current temp, wind speed, humidity, and UVI
    var currentTemp = weather.temp;
    var currentWndSpd = weather.wind_speed + " MPH";
    var currentHmdty = weather.humidity + "%";
    var currentUvi = weather.uvi;

    //Append info to the screen
    $("#current-weather").append("<li class='list-item'>Temperature: " + currentTemp + "</li>")
    $("#current-weather").append("<li class='list-item'>Wind Speed: " + currentWndSpd + "</li>")
    $("#current-weather").append("<li class='list-item'>Humidity: " + currentHmdty + "</li>")
    $("#current-weather").append("<li class='list-item'>UV-Index: " + currentUvi + "</li>")
}

function displayFiveDayInfo(futureWeather){
    fiveDayDisplay.children().remove()

    //console.log(futureWeather)

    for(var i = 1; i < 6; i++){
        var dailyForecast = futureWeather[i];

        //create a div to put the weather cards up
        var forecastCard = document.createElement("div");
        forecastCard.setAttribute("class", "card")
        //console.log(forecastCard);

        // get the forecast date to the screen
        var forecastDate = document.createElement("h4")
        forecastDate.setAttribute("class", "card-header")
        forecastDate.textContent = new Date(dailyForecast.dt * 1000).toLocaleDateString();
        forecastCard.appendChild(forecastDate);

        //get forecast temp to the screen
        var forecastTemp = document.createElement("span");
        forecastTemp.setAttribute("class", "list-item");
        forecastTemp.textContent = "Temperature: " + dailyForecast.temp.day;
        forecastCard.appendChild(forecastTemp);

        //get forecast wind to screen
        var forecastWind = document.createElement("span");
        forecastWind.setAttribute("class", "list-item");
        forecastWind.textContent = "Wind Speed: " + dailyForecast.wind_speed + " MPH";
        forecastCard.appendChild(forecastWind);

        //get forecast humidity to screen
        var forecastHmdty = document.createElement("span")
        forecastHmdty.setAttribute("class", "list-item");
        forecastHmdty.textContent = "Humidity: " + dailyForecast.humidity + "%";
        forecastCard.appendChild(forecastHmdty);

        fiveDayDisplay.append(forecastCard)
    }
}

$("#search-btn").on("click", formSubmitHandler)

$("#recent-searches").on("click", "button", function() {
    var priorSearch = $(this).text()
    console.log(priorSearch);
    getGenInfo(priorSearch)
})