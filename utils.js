const orama = require('@orama/orama');
const path = require('path');
const fs = require('fs');

const BREAKLINE  = '\n\n';

/**
 * Get the current Datetime in YYYY-MM-DD HH:MM:SS format
 * @returns string
 */
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

    // prints date & time in YYYY-MM-DD HH:MM:SS format
    return year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds;

}

/**
 * Read and return data from json file
 * @returns Object[]
 */
const loadDataFromFile = (filename) => {
    const filePath = path.join(__dirname, '/db/' + filename);
    const rawData = fs.readFileSync(filePath)
    let data = JSON.parse(rawData)
    return data;
}

/**
 * Create an Orama db with a specific schema
 * @returns Orama
 */
const createDb = async () => await orama.create({
    schema: {
        title: 'string',
        year: 'number',
        extract: 'string',
        thumbnail: 'string',
    },
});

/**
 * Populate an Orama db with data
 * @param {Orama[]} movieDB 
 * @param {Object[]} data 
 * @returns 
 */
const populateDb = async (movieDB, data) => { 
    return await orama.insertMultiple(movieDB, data, 500);
};

/**
 * Write a file to log results
 * @param {*} searchOptions 
 * @param {*} searchResult 
 */
const logger = (searchOptions, searchResult) => {

    const dateTime = currentDateTime();
    const date = dateTime.split(" ")[0];

    content = ':: ' + dateTime + BREAKLINE;
    content += "Search options" + BREAKLINE;
    content += JSON.stringify(searchOptions, null, 2) + BREAKLINE;

    content += `Movies found (${searchResult.count})` + BREAKLINE;

    searchResult.hits.forEach((element, i) => {
        content += `#${i} ${BREAKLINE}`
        content += JSON.stringify(element, null, 2) + BREAKLINE;
    });

    // YYYY-MM-DD.txt
    const fileName = date + '.txt';
    const filePath = path.join(__dirname, `/result/${fileName}`);
    fs.appendFile(filePath, content, err => {
        if (err) console.error(err);
        // file written successfully
    });

}

module.exports = { loadDataFromFile, createDb, populateDb, logger }