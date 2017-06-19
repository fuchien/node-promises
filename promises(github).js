'use strict'

const yargs = require('yargs')
const rp = require('request-promise')

const options = {
    uri: '',
    headers: {
        'User-Agent': 'chain-of-requests'
    },
    json: true
}

const argv = yargs
    .options({
        a: {
            demand: true,
            alias: 'name',
            describe: 'Github name',
            string: true
        }
    })
    .help()
    .alias('help', 'h')
    .argv

const name = encodeURIComponent(argv.name)

let url1 = options
let url2 = options
let url3 = options

url1.uri = 'https://api.github.com/users/' + name

const cb1 = (response) => {
    console.log('1) Dados do usuário ' + response.name + ' =')
    console.log(` Github url --> ${response.html_url}`)
    console.log(` Repos url --> ${response.repos_url}`)
    console.log(` Organizations url --> ${response.organizations_url}`)
    console.log(` Blog url --> ${response.blog}`)
    console.log(` Location --> ${response.location}`)
    console.log(` Bio --> ${response.bio}`)
    console.log(` Followers --> ${response.followers}`)
    console.log(` Following --> ${response.following}\n`)
    url2.uri = response.repos_url
    return rp(url2)
}

const cb2 = (response) => {
    let reposName = [];
    console.log(`2) Quantidade dos repos --> ${response.length}`)
    response.forEach(repo => {
        reposName.push(repo.name)
    })
    console.log(reposName)
}

rp(url1)
    .then(cb1)
    .then(cb2)
    .catch(err => console.log(err))