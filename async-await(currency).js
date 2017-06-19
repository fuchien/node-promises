// USD CAD 23
// 23 USD is worth 28 CAD. You can spend there in the following countries

const yargs = require('yargs')
const rp = require('request-promise').defaults({
    headers: { 'User-Agent': 'request' },
    json: true
})

const argv = yargs
    .options({
        f: {
            demand: true,
            alias: 'from',
            describe: 'currencyCode from',
            string: true
        },
        t: {
            demand: true,
            alias: 'to',
            describe: 'currencyCode to',
            string: true
        },
        v: {
            demand: true,
            alias: 'value',
            describe: 'currency value',
            number: true
        }
    })
    .help()
    .alias('help', 'h')
    .argv

let from = encodeURIComponent(argv.from)
let to = encodeURIComponent(argv.to)
let value = encodeURIComponent(argv.value)

const getExchangeRate = async (from, to) => {
    try {
        const response = await rp.get(`http://api.fixer.io/latest?base=${from}`)
        const rate = response.rates[to]

        if (rate) {
            return rate
        } else {
            throw new Error()
        }
    } catch(err) {
        throw new Error(`Unable to get exchange rate for ${from} and ${to}!`)
    }
}

const getCountries = async (currencyCode) => {
    try {
        const response = await rp.get(`https://restcountries.eu/rest/v2/currency/${currencyCode}`)
        return response.map((country) => country.name)
    } catch(err) {
        throw new Error(`Unable to get countries that use ${currencyCode}`)
    }
}

const convertCurrency = (from, to, amount) => {
    let countries
    return getCountries(to)
        .then((tempCountries) => {
            countries = tempCountries
            return getExchangeRate(from, to)
        })
        .then((rate) => {
            const exchangedAmount = amount * rate

            return `${amount} ${from} is worth ${exchangedAmount.toFixed(2)} ${to}. ${to} can be used in following countries: ${countries.join(', ')}`
        })
}

// create convertCurrencyAlt as async function
// get countries and reate using await and our two function
// calculate exchangedAmount
// return status string
const convertCurrencyAlt = async (from, to, amount) => {
    const countries = await getCountries(to)
    const rate = await getExchangeRate(from, to)

    const exchangedAmount = amount * rate

    return `${amount} ${from} is worth ${exchangedAmount.toFixed(2)} ${to}. ${to} can be used in following countries: ${countries.join(', ')}`
}

convertCurrencyAlt(from, to, value)
    .then((status) => {
        console.log(status)
    })
    .catch((err) => {
        console.log(err.message)
    })