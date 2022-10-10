import fs from 'fs'
import { file } from 'tmp-promise'
import Axios from 'axios'

const { AIRTABLE_API_KEY: API_KEY, TEST_AIRTABLE_BASE_ID: BASE_ID } = process.env

async function getTable(baseId, table) {
    const REQUEST_URL = `https://api.airtable.com/v0/${baseId}/${table}`
    const config = {
        headers: { Authorization: `Bearer ${API_KEY}` }
    }
    const {data: {records}} = await Axios.get(REQUEST_URL, config)
    return records
}

async function tableToCSV(table) {
    const content = table.map(row => {
        const fields = Object.values(row.fields).join(';')
        return `${row.id};${row.createdTime};${fields}`
    })
    const fieldNames = Object.keys(table[0].fields).join(';')
    const header = `ID;Created Time;${fieldNames}`
    return `${header}\n${content.join('\n')}`
}

async function saveTmpFile(content) {
    const { path, cleanup } = await file()
    const csvPath = `${path}.csv`
    await fs.promises.writeFile(csvPath, content)
    await cleanup()
    return csvPath
}

export default defineComponent({
    async run({ steps, $ }) {
        const table = await getTable(BASE_ID, 'Main')
        const csv = await tableToCSV(table)
        return await saveTmpFile(csv)
    },
})
