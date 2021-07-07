const WEATHER_API_KEY = "YOUR-API_KEY-HERE"
const WEATHER_API_HOST = "YOUR-API-HOST-HERE"

const dayIMG = "assets/img/day.png"
const nightIMG = "assets/img/night.png"

let RANDOM_NUM = (minNumber, maxNumber) => {
    return Math.floor(Math.random() * (maxNumber - minNumber + 1) + minNumber)
}

let displayLoading = (toggle) => {
    document.getElementById("loading").setAttribute("style", `display:${toggle==true?'flex':'none'};`)
}

let GET_WEATHER = () => {
    displayLoading(true)
    fetch("https://api.ipify.org/?format=json", {
            mode: "cors",
            method: "GET",
            headers: {
                "Accept": "application/json"
            }
        })
        .then(response => {
            displayLoading(false)
            if (response.ok) {
                response.json()
                    .then(json => {
                        displayLoading(true)
                        logErr(`Succesfully fetched user IP (${json.ip})`)
                        fetch(`https://weatherapi-com.p.rapidapi.com/current.json?q=${json.ip}`, {
                                "method": "GET",
                                "headers": {
                                    "x-rapidapi-key": WEATHER_API_KEY,
                                    "x-rapidapi-host": WEATHER_API_HOST
                                }
                            })
                            .then(response => {
                                if (response.ok) {
                                    logErr("Successfully fetched Weather for the current IP")
                                    displayLoading(false)
                                    response.json()
                                        .then(json => {

                                            document.getElementById("currentlocation").innerText = json.location.name + ", " + json.location.country

                                            document.getElementById("weather_current").innerText = json.current.temp_c

                                            document.getElementById("weather_icon").src = `https:${json.current.condition.icon}`

                                            document.getElementById("weather_icon").alt = json.current.condition.text

                                            document.getElementById("weather_value").innerText = json.current.condition.text

                                            document.getElementById("temp_value").innerText = json.current.temp_c + "c / " + json.current.temp_f + "f"

                                            document.getElementById("wind_value").innerText = json.current.wind_mph + "mph / " + json.current.wind_kph + "kph"

                                            document.getElementById("windsecond_value").innerText = json.current.wind_degree + " / " + json.current.wind_dir

                                            document.getElementById("humid_value").innerText = json.current.humidity
                                        })
                                }
                            })
                            .catch(err => {
                                displayLoading(false)
                                logErr(err)
                            });
                    });
            }
        })
        .catch(err => {
            displayLoading(false)
            logErr(err)
        });

}


let GET_CURRENT_DATETIME = () => {
    let dt = new Date()
    let curH = (dt.getHours() > 12 ? dt.getHours() - 12 : dt.getHours()) //Hour in 12H format
    let curMI = (dt.getMinutes() < 10 ? `0${dt.getMinutes()}` : dt.getMinutes()) //Minute
    let curS = (dt.getSeconds() < 10 ? `0${dt.getSeconds()}` : dt.getSeconds()) //Second
    let curP = (dt.getHours() > 12 ? "PM" : "AM") //Period
    let curD = dt.getDay() //Day
    let curMO = dt.getMonth()
    let curY = dt.getFullYear()
    let weekday = new Array("Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday")
    let dayOfWeek = weekday[curD]
    let months = new Array("January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December")
    let curMonth = months[curMO]
    let isDay = ((dt.getHours() > 16 && dt.getHours() < 6) ? false : true)

    return {
        time: `${curH}:${curMI}:${curS} ${curP}`,
        date: `${dayOfWeek }, ${curMonth} ${curMO}, ${curY}`,
        isDay: isDay
    }
}

let logErr = (errorText) => {
    let errorspan = document.createElement("span")
    errorspan.innerText = errorText
    let errorspace = document.getElementById("errorlog")
    errorspace.append(errorspan)
}

logErr("Started Application")

setInterval(
    () => {
        let sTime = document.getElementById("timelabel")
        let sDate = document.getElementById("datelabel")
        let weatherWrap = document.getElementById("weather")
        if (GET_CURRENT_DATETIME().isDay) {
            document.body.className = 'day'
        } else {
            document.body.className = 'night'
        }
        sTime.innerText = (GET_CURRENT_DATETIME().time)
        sDate.innerText = (GET_CURRENT_DATETIME().date)
    }, 500)

GET_WEATHER()

let reloadBtn = document.getElementById("reload")
reloadBtn.addEventListener("click", () => {
    GET_WEATHER()
})

document.addEventListener("mousemove", () => {
    let mousex = event.clientX; // Gets Mouse X
    let mousey = event.clientY; // Gets Mouse Y
    let curReload = document.getElementById("reload")
    if (mousey > 50) {
        curReload.setAttribute("style", "display:none;")
    } else {
        curReload.setAttribute("style", "display:flex;")
    }
})

document.addEventListener('keydown', function(event) {
    if (event.ctrlKey && event.keyCode == 81 && !(event.shiftKey || event.altKey || event.metaKey)) {
        let errBox = document.getElementById('error')
        errBox.setAttribute("style", "display:flex")
    }
});

let hideConsole = document.getElementById("hideme")
hideConsole.addEventListener("click", () => {
    document.getElementById("error").setAttribute("style", "display:none;")
})