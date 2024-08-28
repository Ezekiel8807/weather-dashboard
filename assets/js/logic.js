// let's assign the key to a variable so I don't have to worry about typing it throughout the script.
var apiKey = '876a9cd8007aec3aef4fd80583307842';
// and let's create element var's to play with

//var to play with the hidden display until the user interacts with the app
var genDisplay = document.getElementById("general-display")

//search city history
var searchedCities = [];

//login check
var isLogin = () => {
    if(localStorage === null) {
        return false;

    }else {
        return true;
    }
}

//handle user registration 
$("#register").click(() => {

    //get user registration info
    let username = $("#username").val();
    let email = $("#email").val();
    let pass = $("#pass").val();

    //error message
    let errorMsg = $("#error_msg");

    if(!username || !email || !pass){
        errorMsg.text("All fields required!");

    }else {
        let newUser = {
            username,
            email,
            pass
        }

        localStorage.setItem(newUser.username, JSON.stringify(newUser));
        window.location.replace("/login.html");
        alert("Registration Successful");
    };
})

//handle user signing in
$("#login").click((isLogin) => {

    //get user login info
    let username = $("#username").val();
    let pass = $("#pass").val();

    //error message
    let errorMsg = $("#error_msg");

    if(!username || !pass){
        errorMsg.text("All fields required!");

    }else {
        let user = localStorage.getItem(username);

        if(user === null) {
            errorMsg.text("Wrong user details");

        }else{
            window.location.replace("/dashboard.html");
            alert("Login Successful");
        }
    };
})


function formSubmitHandler(event) {
    event.preventDefault()
    // grab the input value and store it in a variable
    var city = $("#city").val().trim();

    if (city) {
        $("#city").val('')
        getGenInfo(city)
    } else {
        alert("Please enter a valid city")
    }
}

function getGenInfo(city){
    var directGeoCode = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&&appid=${apiKey}`
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
    // genDisplay.classList.remove("hidden")
    //get the city name and state together
    var cityState = data[0].name + ", " + data[0].state;
    $("#searched-city").text(cityState)
    
    createButton(cityState)
}

//create a function for the dynamic button creation
function createButton(name) {
    // create a button with the data that's present.
    var recentSearch = document.createElement("button");
    recentSearch.setAttribute("class", "btn blue-gradient text-light mb-2 ml-2")
    recentSearch.setAttribute("id", "history")
    recentSearch.textContent = name;
    //Make sure that no duplicate buttons can be made
    if (!searchedCities.includes(recentSearch.textContent)){
        searchedCities.push(recentSearch.textContent);
        $("#recent-searches").append(recentSearch);
        saveCities();
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
    $("#current-weather").children().remove()

    //pull the weather icon link
    var weatherImg = "https://openweathermap.org/img/wn/" + weather.weather[0].icon + ".png"
    var weatherAlt = weather.weather[0].main + ": " + weather.weather[0].description;

    // var for the current Date-
    var currentDate = new Date(weather.dt * 1000).toLocaleDateString()
    //append to the screen
    $("#searched-city").append(" " + currentDate)
    $("#searched-city").append("<img class='icon' src='" + weatherImg + "' alt='" + weatherAlt + "'></>");

    // var for current temp, wind speed, humidity, and UVI
    var currentTemp = weather.temp;
    var currentWndSpd = weather.wind_speed + " MPH";
    var currentHmdty = weather.humidity + " %"
    var currentUvi = weather.uvi;

    //Append info to the screen
    $("#current-weather").append("<p class='list-item'>Temperature: <span id='temp'>" + currentTemp + "</span></p>")
    $("#current-weather").append("<p class='list-item'>Wind Speed: <span id='wind'>" + currentWndSpd + "</span></p>")
    $("#current-weather").append("<p class='list-item'>Humidity: <span id='humidity'>" + currentHmdty + "</span></p>")
    $("#current-weather").append("<p class='list-item'>UV-Index: <span id='uvi'>" + currentUvi + "</span></p>")
    checkUv(currentUvi)
}

function checkUv(uvi){
    if(uvi <= 4) {
        $("#uvi").attr("class", "bg-success")
    } else if(uvi > 4 && uvi <= 7) {
        $("#uvi").attr("class", "bg-warning")
    } else {
        $("#uvi").attr("class", "bg-danger")
    }
}

function displayFiveDayInfo(futureWeather){
    $("#five-day-forecast").children().remove();

    for(var i = 1; i < futureWeather.length; i++){
        var dailyForecast = futureWeather[i];
        // acquire the icon and description of the weather for each day
        var forecastWeatherImg = "https://openweathermap.org/img/wn/" + dailyForecast.weather[0].icon + "@2x.png"
        var forecastWeatherAlt = dailyForecast.weather[0].main + ": " + dailyForecast.weather[0].description;

        //create a div to put the weather cards up
        var forecastCard = document.createElement("div");
        forecastCard.setAttribute("class", "forecastCard")

        // get the forecast date to the screen
        var forecastDate = document.createElement("h4")
        forecastDate.setAttribute("class", "card-header text-center text-light bg-dark" )
        forecastDate.textContent = new Date(dailyForecast.dt * 1000).toLocaleDateString();
        forecastCard.appendChild(forecastDate);

        var forecastIcon = document.createElement("img");
        forecastIcon.setAttribute("src", forecastWeatherImg);
        forecastIcon.setAttribute("alt", forecastWeatherAlt);
        forecastIcon.setAttribute("class", "m-auto w-50")
        forecastCard.appendChild(forecastIcon);

        //get forecast temp to the screen
        var forecastTemp = document.createElement("span");
        forecastTemp.setAttribute("class", "list-item mb-2");
        forecastTemp.textContent = "Temperature: " + dailyForecast.temp.day;
        forecastCard.appendChild(forecastTemp);

        //get forecast wind to screen
        var forecastWind = document.createElement("span");
        forecastWind.setAttribute("class", "list-item mb-2");
        forecastWind.textContent = "Wind Speed: " + dailyForecast.wind_speed + " MPH";
        forecastCard.appendChild(forecastWind);

        //get forecast humidity to screen
        var forecastHmdty = document.createElement("span")
        forecastHmdty.setAttribute("class", "list-item mb-2");
        forecastHmdty.textContent = "Humidity: " + dailyForecast.humidity + "%";
        forecastCard.appendChild(forecastHmdty);

        //get uvi data to screen
        var forecastUvi = document.createElement("span");
        forecastUvi.setAttribute("class", "list-item mb-2");
        forecastUvi.textContent = "UV-Index: " + dailyForecast.uvi;
        forecastCard.appendChild(forecastUvi);

        $("#five-day-forecast").append(forecastCard)
    }
}

function saveCities() {
    localStorage.setItem("cities", JSON.stringify(searchedCities));
}

function loadCities() {
    var searchHistory = localStorage.getItem("cities");

    if(!searchHistory){
        return false;
    } else 
    {
        searchHistory = JSON.parse(searchHistory)

        for(var i = 0; i < searchHistory.length; i++) {
            createButton(searchHistory[i])
        }
    }
}

$("#search-btn").on("click", formSubmitHandler)

$("#recent-searches").on("click", "button", function() {
    var priorSearch = $(this).text()
    getGenInfo(priorSearch)
})

loadCities();

$(document).ready(() => {

    //default state weather forecast
    getGenInfo("Ondo");

    let check = isLogin();
    (check === true) ? $("#logo").attr("href", "dashboard.html") : $("#logo").attr("href", "index.html");


})