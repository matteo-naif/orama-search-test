const path = require('path');
const fs = require('fs');
const orama = require('@orama/orama');

const BREAKLINE = '\n\n';

// Load JSON with data
const filePath = path.join(__dirname, '/db/movies-2020s.json');
const rawData = fs.readFileSync(filePath)
let data = JSON.parse(rawData)

const loadDb = async () => await orama.create({
        schema: {
            title: 'string',
            year: 'number',
            extract: 'string',
            thumbnail: 'string',
        },
    });

const insertData = async ( movieDB, data ) => await orama.insertMultiple(movieDB, data, 500);

const logger = (searchOptions, searchResult) => {

    content = ':: ' + currentDateTime() + BREAKLINE;
    content += "Search options" + BREAKLINE;
    content += JSON.stringify(searchOptions, null, 2) + BREAKLINE;

    content += `Movies found (${searchResult.count})`  + BREAKLINE;

    searchResult.hits.forEach((element, i) => {
        content += `#${i} ${BREAKLINE}`
        content += JSON.stringify(element, null, 2) + BREAKLINE;
    });

    // YYYY-MM-DD.txt
    const fileName = new Date().toISOString().split('T')[0] + '.txt';
    const filePath = path.join(__dirname, `/result/${fileName}` );
    fs.appendFile(filePath, content, err => {
        if (err) console.error(err);
        // file written successfully
      });

}

const start = async function (data) {
    // Create database
    const movieDB = await loadDb();
    // populate database
    await insertData(movieDB, data);
    // Perform a search
    const searchOptions = {
        term: 'Underwater',
        properties: '*',
    };
    const searchResult = await orama.search(movieDB, searchOptions)
    logger(searchOptions, searchResult);
}
start(data);

const currentDateTime = () => {

    let date_time = new Date();

    // get current date
    // adjust 0 before single digit date
    let date = ("0" + date_time.getDate()).slice(-2);

    // get current month
    let month = ("0" + (date_time.getMonth() + 1)).slice(-2);

    // get current year
    let year = date_time.getFullYear();

    // get current hours
    let hours = date_time.getHours();

    // get current minutes
    let minutes = date_time.getMinutes();

    // get current seconds
    let seconds = date_time.getSeconds();

    // prints date in YYYY-MM-DD format
    console.log(year + "-" + month + "-" + date);

    // prints date & time in YYYY-MM-DD HH:MM:SS format
    return year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds;

}