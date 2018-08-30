

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

//data storage for "processPacket" function
let buffer = {};
let count = {};

//processes a response using the jQuery for the given url
function processPacket(jQuery, url, timeStamp)
{
    //if url is the catalog page, then get all the t-shirt urls and scrape them
    //indivually
    if(url === URL_CATALOG)
    {
        //gets list of t-shirts from catalog page
        const productsRawHtml = jQuery('.products').children('li');

        buffer[URL_CATALOG] = [];
        //stores the amount of t-shirts in memory
        count[URL_CATALOG] = productsRawHtml.length;

        //makes a seperate ajax request to each of the shirts websites
        productsRawHtml.each((index, element) =>
        {
            const text = jQuery(element).html();
            const shirtUrl = `http://shirts4mike.com/${text.split(`href="`)[1].split(`"`)[0]}`;

            scrape(shirtUrl);
        });
    }
    //scrapes data from shirt page
    else if(url.startsWith(URL_SHIRT))
    {
        //creates a new shirt object from jQuery
        let shirt = Shirt.construct(jQuery, url, timeStamp);

        //stores shirt object in memory
        buffer[URL_CATALOG].push(shirt);

        //if all shirts were scraped, then the csv file is generated
        if(buffer[URL_CATALOG].length === count[URL_CATALOG])
        {
            //converts shirt buffer to csv data
            const csv = DataManager.convertToCSV(buffer[URL_CATALOG], ['title', 'price', 'imgUrl', 'url', 'timeStamp']);
            //gets current time to timestamp csv file
            const date = new Date();
            const fileName = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}.csv`;

            //stores data in a csv file
            DataManager.overwriteFile(fileName, csv);
        }
    }
}

//function scrapes html based on the given url
function scrape(url)
{
    //creates a request
    Request(url, (error, response, html) =>
    {
        //if no error the response is processed
        if(!error && response.statusCode == 200)
        {
            const date = new Date();
            const timeStamp = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;

            processPacket(Cheerio.load(html), url, timeStamp);
        }
        //else error is thrown
        else
        {
            console.log(`There’s been an error. Cannot connect to ${url}.`);
            DataManager.logError(error);
        }
    });
}


/*******************************************************************************
    - init -
*******************************************************************************/

DataManager.init();

scrape(URL_CATALOG);
