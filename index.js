require('dotenv').config()

const { AIRTABLE_API_KEY: API_KEY, AIRTABLE_BASE_IDS } = process.env

const BASE_IDS = AIRTABLE_BASE_IDS.split(',').map(base => {
    const [display, id] = base.split(':')
    return {
        display,
        id
    }
})

console.log(API_KEY)
console.log(BASE_IDS)
