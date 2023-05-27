const orama = require('@orama/orama');
const { loadDataFromFile, createDb, populateDb, logger } = require('./utils.js');

// Read from args the value to search or a default
const args = process.argv.length > 2 ? process.argv[2] : 'Underwater';

const start = async function () {
    // Load JSON with data
    let data = loadDataFromFile('movies-2020s.json')
    // Create database
    const movieDB = await createDb();
    // Populate database
    await populateDb(movieDB, data);
    // Perform a search
    const searchOptions = {
        term: args,
        properties: '*',
    };
    const searchResult = await orama.search(movieDB, searchOptions);
    // Log the result
    logger(searchOptions, searchResult);
}
start();
