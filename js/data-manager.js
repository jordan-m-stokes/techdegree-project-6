

/*******************************************************************************
    - imports -
*******************************************************************************/

const Json2Csv = require('json2csv');

const FileSystem = require('fs');


/*******************************************************************************
    - fields -
*******************************************************************************/

const dataDirectory = './data/';
const errorLogDirectory = './scraper-error.log';

/*******************************************************************************
    - helper functions -
*******************************************************************************/

function logError(error)
{
    const date = new Date();

    try
    {
        const divider = '------------------------------------------------------------------------------------------------'

        FileSystem.appendFileSync(errorLogDirectory, `\n${divider}\nOccurred on:\t[${date}]\n\n${error.stack}\n${divider}\n`);
    }
    catch(error)
    {
        console.error(error);
    }
}

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
