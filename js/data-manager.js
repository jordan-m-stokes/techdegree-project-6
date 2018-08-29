

/*******************************************************************************
    - imports -
*******************************************************************************/

const Json2Csv = require('json2csv');

const FileSystem = require('fs');


/*******************************************************************************
    - fields -
*******************************************************************************/

//directories for what's stored
const dataDirectory = './data/';
const errorLogDirectory = './scraper-error.log';

/*******************************************************************************
    - helper functions -
*******************************************************************************/

//function logs given error to console and to a "scraper-error.log" file
function logError(error)
{
    //gets current time
    const date = new Date();

    try
    {
        const divider = '------------------------------------------------------------------------------------------------'
        //writes error
        FileSystem.appendFileSync(errorLogDirectory, `\n${divider}\nOccurred on:\t[${date}]\n\n${error.stack}\n${divider}\n`);
    }
    //if writing file throws an error, it's logged to console
    catch(error)
    {
        console.error(error);
    }
}

//writes given data to given file path
function overwriteFile(path, data)
{
    try
    {
        const completePath = `${dataDirectory}${path}`;

        FileSystem.writeFileSync(completePath, data, {encoding: 'utf8'});

        console.log(`- wrote to file: [${completePath}]`);
    }
    catch(error)
    {
        console.log(error);
        logError(error);
    }

}

//converts javascript objects to csv based on the given keys
function convertToCSV(object, keys)
{
    try
    {
        const csv = Json2Csv.parse(object, {keys});

        return csv;
    }
    catch(error)
    {
        console.error(error);
        logError(error);

        return '';
    }
}

//makes sure needed directories and files exist and are ready for use
function init()
{
    try
    {
        if(!FileSystem.existsSync(dataDirectory))
        {
            FileSystem.mkdirSync(dataDirectory);
        }
        if(!FileSystem.existsSync(errorLogDirectory))
        {
            FileSystem.writeFileSync(errorLogDirectory, '', {encoding: 'utf8'});
        }
    }
    catch(error)
    {
        console.log(error);
        logError(error);
    }
}


/*******************************************************************************
    - exports -
*******************************************************************************/

module.exports.logError = logError;
module.exports.overwriteFile = overwriteFile;
module.exports.convertToCSV = convertToCSV;
module.exports.init = init;
