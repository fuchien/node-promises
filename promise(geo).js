const yargs = require('yargs')
const axios = require('axios') //npm install axios --save
const rp = require('request-promise')

const argv = yargs
    .options({
        a: {
            demand: true,
            alias: 'address',
            describe: 'Address to fetch weather for',
            string: true
        }
    })
    .help()
    .alias('help', 'h')
    .argv

let encodedAddress = encodeURIComponent(argv.address)
let geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}`

//axios.get(geocodeUrl)... there's no need of transform it to Object
rp.get(geocodeUrl)
    .then((response) => {
        if (response.status === 'ZERO_RESULTS') {
            throw new Error('Unable to find that address!')
        }

        let resp = JSON.parse(response)
        console.log(resp)
        let lat = resp.results[0].geometry.location.lat
        let lng = resp.results[0].geometry.location.lng

        let weatherUrl = `https://api.forecast.io/forecast/4a04d1c42fd9d32c97a2c291a32d5e2d/${lat},${lng}`
        console.log(resp.results[0].formatted_address)
        return axios.get(weatherUrl)
    })
    .then((response) => {
        let temperature = response.data.currently.temperature
        let apparentTemperature = response.data.currently.apparentTemperature

        let tempCelsius = ( temperature - 32) * 5/9
        let apparentCelsius = (apparentTemperature - 32) * 5/9

        console.log(`It's currently ${tempCelsius.toFixed(2)}°C. It feels like ${apparentCelsius.toFixed(2)}°C!`)
    })
    .catch((err) => {
        if (err.code === 'ENOTFOUND') {
            console.log('Unable to connect to API servers!')
        } else {
            console.log(err.message)
        }
    })