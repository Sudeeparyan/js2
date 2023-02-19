import changeToFarenheit from "./export.js";
var weather_Data;
let currWeather;

/**
 * @desc function to fetch weather data from the json file and store in a
 * global variable.
 */
(function () {
  fetch("data.json")
    .then((data) => data.json())
    .then((result) => {
      weather_Data = result;
      updateDropDown();
      setTimeout(() => setWeathercard("sunny"), 300);
      // setInterval(filterCityCards, 1000);
      // setInterval(updateValidCityDetails, 1000);
      // setInterval(() => display(arr), 1000);
      // sortByContinent();
      updateValidCityDetails();
    });

  /**
   * @desc this function gives the updateDropDown for city selection
   */
  function updateDropDown() {
    var city = Object.keys(weather_Data);
    var option = ``;
    for (let i = 0; i < city.length; i++) {
      option += `<option>${weather_Data[city[i]].cityName}</option>`;
    }
    document.querySelector("#data_dropdown").innerHTML = option;
  }

  //temperature
  let tempInFahrenheit;
  let selectedCity;
  document
    .querySelector("#inputdata")
    .addEventListener("change", userSelectedCity);

  /**
   * @desc function to check whether user has entered vaild input city
   */
  function userSelectedCity() {
    selectedCity = document.querySelector("#inputdata").value.toLowerCase();
    let city = Object.keys(weather_Data);
    let currentCity = selectedCity;
    let flag = 0;
    for (let i = 0; i < city.length; i++) {
      if (currentCity == city[i]) {
        updateValidCityDetails();
        flag = 1;
      }
    }
    if (flag == 0) {
      updateInValidCityDetails();
    }
  }

  /**
   * @desc this function sets the null value for weather details when
   * invalid city is selected
   */
  function updateInValidCityDetails() {
    document.querySelector("#top-tempc").innerText = "-";
    document.querySelector("#top-far").innerText = "-";
    document.querySelector("#top-humidity").innerText = "-";
    document.querySelector("#top-precipitation").innerText = "-";
    document.querySelector("#top-date").innerText = "";
    document.querySelector("#top-time").innerText = "Enter a valid City";
    document.querySelector("#inputdata").style.borderColor = "red";
    document.querySelector("#top-time").style.color = "";
    document.querySelector("#top-img").src = "";
    for (let i = 0; i < 6; i++) {
      document.querySelector(`#time-${i + 1}`).innerText = "-";
      document.querySelector(`#icon-${i + 1}`).src = "";
      document.querySelector(`#temperature-${i + 1}`).innerText = "-";
    }
  }

  /**
   * @desc Based on the user selected city the various fields such as
   *  temperature,precipitation,humidity,live time,date and next
   * five hours temperature and climate icons we get updated.
   */
  function updateValidCityDetails() {
    var updateDropDown = document.querySelector("#inputdata").value.toLowerCase();
    var city = Object.keys(weather_Data);
    let monthArr = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    //Image
    document.getElementById(
      "top-img"
    ).src = `HTML & CSS/Icons for cities/${updateDropDown}.svg`;
    //temperature
    var temp = weather_Data[updateDropDown].temperature;
    document.getElementById("top-tempc").innerHTML = temp;
    //humidity
    document.getElementById("top-humidity").innerHTML =
      weather_Data[updateDropDown].humidity;
    //precipitation
    document.getElementById("top-precipitation").innerHTML =
      weather_Data[updateDropDown].precipitation;
    //temperature F
    let tempInCelsius = parseInt(weather_Data[updateDropDown].temperature);
    tempInFahrenheit = changeToFarenheit(tempInCelsius).toFixed(0) + "F";
    document.getElementById("top-far").innerHTML = tempInFahrenheit;
    //Date and time
    let datetimeArr;
    datetimeArr = weather_Data[updateDropDown].dateAndTime.split(",");
    document.getElementById("top-time").innerHTML = datetimeArr[1].slice(0, -2);
    document.getElementById("top-date").innerHTML = datetimeArr[0];
    //Date
    let dateSplit = datetimeArr[0];
    let dateArr = dateSplit.split("/");
    let dateInWords =
      String(dateArr[1].padStart(2, "0")) +
      "-" +
      monthArr[dateArr[0] - 1] +
      "-" +
      dateArr[2];
    document.getElementById("top-date").innerHTML = dateInWords;
    // Time
    let time;
    time = new Date().toLocaleString("en-US", {
      timeZone: weather_Data[selectedCity].timeZone,
      timeStyle: "medium",
      hourCycle: "h12",
    });
    document.getElementById("top-time").innerHTML = time;
    //Temperature Changing Left
    let sixtemp = [
      parseInt(weather_Data[`${updateDropDown}`].temperature.slice(0, -2)),
      parseInt(weather_Data[`${updateDropDown}`].temperature.slice(0, -2)),
    ];
    for (let i = 0; i < 4; i++) {
      sixtemp[i + 2] = parseInt(
        weather_Data[`${updateDropDown}`].nextFiveHrs[i].slice(0, -2)
      );
    }
    for (let i = 0; i < 6; i++) {
      document.querySelector(`#temperature-${i + 1}`).innerHTML = sixtemp[i];
    }
    // Image Changing wrt to Temperature
    for (let i = 0; i < 6; i++) {
      if (sixtemp[i] < 0) {
        document.querySelector(`#icon-${i + 1}`).src =
          "HTML & CSS/Weather Icons/snowflakeIcon.svg";
      } else if (sixtemp[i] < 18 && sixtemp[i] > 0) {
        document.querySelector(`#icon-${i + 1}`).src =
          "HTML & CSS/Weather Icons/rainyIcon.svg";
      } else if (sixtemp[i] >= 18 && sixtemp[i] <= 22) {
        document.querySelector(`#icon-${i + 1}`).src =
          "HTML & CSS/Weather Icons/windyIcon.svg";
      } else if (sixtemp[i] >= 23 && sixtemp[i] <= 29) {
        document.querySelector(`#icon-${i + 1}`).src =
          "HTML & CSS/Weather Icons/cloudyIcon.svg";
      } else if (sixtemp[i] > 29) {
        document.querySelector(`#icon-${i + 1}`).src =
          "HTML & CSS/Weather Icons/sunnyIcon.svg";
      }
    }
    //Hours changing with wrt to time.
    let hour = parseInt(time.split(":")[0]);
    let noon = time.slice(-2);
    for (let i = 0; i < 6; i++) {
      if (hour > 12) {
        hour = hour - 12;
      }
      if (i == 0) {
        document.querySelector(`#time-${i + 1}`).innerHTML = "NOW";
      } else {
        document.querySelector(`#time-${i + 1}`).innerHTML = hour + " " + noon;
      }
      if (hour == 11 && noon == "PM") {
        noon = "AM";
        hour = 12;
      } else if (hour == 11 && noon == "AM") {
        hour = 12;
        noon = "PM";
      } else {
        hour++;
      }
    }
  }

  //Task 2
  var sortedSunnyWeatherValues = [];
  var sortedSnowWeatherValues = [];
  var sortedRainyWeatherValues = [];
  document.querySelector("#sunny").addEventListener("click", () => {
    setWeathercard("sunny");
  });
  document.querySelector("#snowflake").addEventListener("click", () => {
    setWeathercard("snowflake");
  });
  document.querySelector("#rainy").addEventListener("click", () => {
    setWeathercard("rainy");
  });
  document
    .querySelector("#displaynum")
    .addEventListener("change", filterCityCards);

  /**
   * @desc function to sort cities based on sunny rainy or cold option choosen by the user
   * @param {@String} arr all values of cities data.
   * @param {*String} constraint type of weather like suuny,cold,rainy
   * @returns returns the sorted city array.
   */
  function sortCities(arr, constraint) {
    switch (constraint) {
      case "temperature":
        arr.sort((a, b) => {
          return parseInt(b.temperature) - parseInt(a.temperature);
        });
        break;
      case "precipitation":
        arr.sort((a, b) => {
          return parseInt(b.precipitation) - parseInt(a.precipitation);
        });
        break;
      default:
        arr.sort((a, b) => {
          return parseInt(b.humidity) - parseInt(a.humidity);
        });
        break;
    }
    return arr;
  }

  //Display Middle Cards
  /**
   * @desc function to display cards containing sorted cities  as per user preferences
   * @param {*} arr all cities data in string format.
   */
  function displayCityCards(arr) {
    let card = "";
    for (let i = 0; i < arr.length; i++) {
      let time = new Date().toLocaleString("en-US", {
        timeZone: arr[i].timeZone,
        timeStyle: "short",
        hourCycle: "h12",
      });
      card += `<div class="mid">
              <div class="mid-item">
                <div>${arr[i].cityName}</div>
                <div class="mid-img">
                  <img src="HTML & CSS/Weather Icons/${currWeather}Icon.svg" alt="sunny" />
                  <span>${arr[i].temperature}</span>
                </div>
              </div>
              <div class="city-card-time">${time}</div>
              <div>
                <img
                  src="HTML & CSS/Weather Icons/humidityIcon.svg"
                  alt="rainy"
                />${arr[i].humidity}
              </div>
              <div>
                <img src="HTML & CSS/Weather Icons/precipitationIcon.svg" 
                />${arr[i].precipitation}
              </div>
            </div>`;
    }
    document.querySelector(".middle-block").innerHTML = card;
    document.querySelectorAll(".mid").forEach((element, i) => {
      element.style.backgroundImage = `url('./HTML & CSS/Icons for cities/${arr[
        i
      ].cityName.toLowerCase()}.svg')`;
    });
  }

  /**
   * @desc function to manage the numberof cities cards displayed based on
   * display top like minimumand maximum numbers.
   */
  function filterCityCards() {
    let limiter = parseInt(document.querySelector("#displaynum").value);
    if (currWeather == "sunny") {
      if (sortedSunnyWeatherValues.length > limiter) {
        if (limiter < 4) {
          document.querySelector("#curser-left").style.display = "none";
          document.querySelector("#curser-right").style.display = "none";
        } else {
          document.querySelector("#curser-left").style.display = "block";
          document.querySelector("#curser-right").style.display = "block";
        }
        displayCityCards(sortedSunnyWeatherValues.slice(0, limiter));
      } else {
        displayCityCards(sortedSunnyWeatherValues);
      }
    } else if (currWeather == "snowflake") {
      if (sortedSnowWeatherValues.length > limiter) {
        if (limiter < 4) {
          document.querySelector("#curser-left").style.display = "none";
          document.querySelector("#curser-right").style.display = "none";
        } else {
          document.querySelector("#curser-left").style.display = "block";
          document.querySelector("#curser-right").style.display = "block";
        }
        displayCityCards(sortedSnowWeatherValues.slice(0, limiter));
      } else {
        displayCityCards(sortedSnowWeatherValues);
      }
    } else {
      if (sortedRainyWeatherValues.length > limiter) {
        if (limiter < 4) {
          document.querySelector("#curser-left").style.display = "none";
          document.querySelector("#curser-right").style.display = "none";
        } else {
          document.querySelector("#curser-left").style.display = "block";
          document.querySelector("#curser-right").style.display = "block";
        }
        displayCityCards(sortedRainyWeatherValues.slice(0, limiter));
      } else {
        displayCityCards(sortedRainyWeatherValues);
      }
    }
  }

  /**
   * function to define the content of the weather cards based on the
   *  weather attributes and display top attributes selected by the user
   * @param {*String} weather holds the value of currently
   * selected weather like sunny,snow, rainny
   */
  function setWeathercard(weather) {
    currWeather = weather;
    var cityValues = Object.values(weather_Data);
    let sunnyWeather = [];
    let snowWeather = [];
    let rainyWeather = [];
    document.getElementById("sunny").style.borderBottom = "none";
    document.getElementById("rainy").style.borderBottom = "none";
    document.getElementById("snowflake").style.borderBottom = "none";
    //SUNNY Weather
    if (weather == "sunny") {
      document.getElementById("sunny").style.borderBottom = "2px solid #1E90FF";
      //Get the cities with sunny weather using call function
      Array.prototype.forEach.call(cityValues, function (city) {
        if (
          parseInt(city.temperature) > 29 &&
          parseInt(city.humidity) < 50 &&
          parseInt(city.precipitation) >= 50
        ) {
          sunnyWeather.push(city);
        }
      });
      // Sort the cities in descending order of temperature
      sortedSunnyWeatherValues = sortCities(sunnyWeather, "temperature");
      //Display the city details in cards
      filterCityCards();
    }
    //SNOW Weather
    if (weather == "snowflake") {
      //Get the cities with snow weather
      document.getElementById("snowflake").style.borderBottom =
        "2px solid #1E90FF";
      for (let i = 0; i < cityValues.length; i++) {
        if (
          parseInt(cityValues[i].temperature) >= 20 &&
          parseInt(cityValues[i].temperature) < 28 &&
          parseInt(cityValues[i].humidity) > 50 &&
          parseInt(cityValues[i].precipitation) < 50
        ) {
          snowWeather.push(cityValues[i]);
        }
      }
      // Sort the cities in descending order of temperature
      sortedSnowWeatherValues = sortCities(snowWeather, "temperature");
      filterCityCards();
      //Display the city details in cards
    }
    //Rainy weather
    if (weather == "rainy") {
      //Get the cities with rainy weather using filter method.
      const rainyWeather = cityValues.filter((city) => {
        const temperature = parseInt(city.temperature);
        const humidity = parseInt(city.humidity);
        return temperature < 20 && humidity >= 50;
      });
      document.getElementById("rainy").style.borderBottom = "2px solid #1E90FF";
      //Sort cities in descending order of humidity
      sortedRainyWeatherValues = sortCities(rainyWeather, "humidity");
      //Display the city details in cards
      filterCityCards();
    }
  }
  //Previous button click
  document.querySelector("#curser-left").addEventListener("click", () => {
    document.querySelector("#middle-block").scrollLeft -= 300;
  }); //Next button click
  document.querySelector("#curser-right").addEventListener("click", () => {
    document.querySelector("#middle-block").scrollLeft += 300;
  });
})(); //IIFE
