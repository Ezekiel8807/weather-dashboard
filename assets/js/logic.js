// let's assign the key to a variable so I don't have to worry about typing it throughout the script.
var apiKey = 'appid=876a9cd8007aec3aef4fd80583307842';
var citySearchEl = $("#city");

function formSubmitHandler(event) {
    event.preventDefault()
    // grab the input value and store it in a variable
    var city = citySearchEl.val().trim();

    if (city) {
        geoCodeInfo(city)
        citySearchEl.val('')
    } else {
        alert("Please enter a valid city")
    }
}

//function to begin to get the city info
function geoCodeInfo(cityName) {
    // code in the apiUrl to fetch() info
    var geoCall = "https://api.openweathermap.org/geo/1.0/direct?q=" + cityName + "&" + apiKey;

    // get the data in vanilla JS format (safer and easier for me to read along
    fetch(geoCall).then(function(response) {
        //if request was successful
        if (response.ok) {
            response.json().then(function(data) {
                displayCurrentInfo(data, cityName)
                //lets get the longitude and latitude to feed into the next API call
                var latCoord = data[0].lat;
                var lonCoord = data[0].lon;
                // make a call to get the actual weather info
                var directCall = "https://api.openweathermap.org/data/2.5/onecall?lat=" 
                + latCoord + "&lon=" + lonCoord + "&exclude=minutely,hourly&units=imperial&" + apiKey;
                //make another fetch
                fetch(directCall).then(function(response) {
                    if (response.ok) {
                        response.json().then(function(data) {
                            displayWeatherInfo(data);
                        })
                    } else {
                        console.log("Error: Information Not Found")
                    }
                })
                .catch(function(error){
                    console.log("You spelled it wrong!")
                })
            })
        } else {
            console.log("Error: City Not Found");
        }
    })
    .catch(function(error) {
        alert("Unable to Connect to Server")
    })
}

function displayCurrentInfo (info, searchTerm) {
    if (info.length === 0) {
        console.log("No weather information found about " + searchTerm)
    }
    // Ensure that the info is clear every time this function is called
    $("#current-day").empty()


    var cityState = info[0].name + "," + info[0].state;
    //append it to the screen
    $("#current-day").append("<h3 class='text-start'>" + cityState + "</h3>");
}

function displayWeatherInfo(info) {
    var today = info.daily[0];

    $("#current-day").append("<ul>");
    $("ul").append("<li class='list-item'>High: " + today.temp.max + "</li>");
    $("ul").append("<li class='list-item'>Low: " + today.temp.min + "</li>");
    $("ul").append("<li class='list-item'>Wind: " + today.wind_speed + "</li>");
    $("ul").append("<li class='list-item'>Humidity: " + today.humidity + "%</li>");
    $("ul").append("<li class='list-item'>UV-Index: " + today.uvi + "</li>");

    for(var i = 0; i < 6; i++) {
        var milliseconds = info.daily[i].dt * 1000;
        var dateObject = new Date(milliseconds)
        var humanDate = dateObject.toLocaleDateString()

        console.log(humanDate);
    }
}

$("#search-btn").on("click", formSubmitHandler)