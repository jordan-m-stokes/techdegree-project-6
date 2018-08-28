

/*******************************************************************************
    - imports -
*******************************************************************************/

const Request = require('request');
const Cheerio = require('cheerio');

const DataManager = require('./data-manager.js');
const Shirt = require('./shirt.js');


/*******************************************************************************
    - fields -
*******************************************************************************/

const URL_CATALOG = 'http://shirts4mike.com/shirts.php';
const URL_SHIRT = 'http://shirts4mike.com/shirt.php?id';


/*******************************************************************************
    - helper functions -
*******************************************************************************/

let buffer = {};
let count = {};

function processPacket(jQuery, url)
{
    if(url === URL_CATALOG)
    {
        const productsRawHtml = jQuery('.products').children('li');

        buffer[URL_CATALOG] = [];
        count[URL_CATALOG] = productsRawHtml.length;

        productsRawHtml.each((index, element) =>
        {
            const text = jQuery(element).html();
            const shirtUrl = `http://shirts4mike.com/${text.split(`href="`)[1].split(`"`)[0]}`;

            scrape(shirtUrl);
        });
    }
    else if(url.startsWith(URL_SHIRT))
    {
        let shirt = Shirt.construct(jQuery, url);

        buffer[URL_CATALOG].push(shirt);

        if(buffer[URL_CATALOG].length === count[URL_CATALOG])
        {
            const csv = DataManager.convertToCSV(buffer[URL_CATALOG], ['title', 'price', 'url', 'imgUrl']);

            DataManager.overwriteFile('shirts4mike-catalog.csv', csv);
        }
    }
}

function scrape(url)
{
    Request(url, (error, response, html) =>
    {
        if(!error && response.statusCode == 200)
        {
            processPacket(Cheerio.load(html), url);
        }
        else
        {
            console.error(error);
            DataManager.logError(error);
        }
    });
}


/*******************************************************************************
    - init -
*******************************************************************************/

DataManager.init();

scrape(URL_CATALOG);
