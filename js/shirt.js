
/*******************************************************************************
    - class -
*******************************************************************************/

//shirt class for storing shirt data
class Shirt
{
    constructor(title, price, imgUrl, url, timeStamp)
    {
        this.title = title;
        this.price = price;
        this.imgUrl = imgUrl;
        this.url = url;
        this.timeStamp = timeStamp;
    }
}


/*******************************************************************************
    - helper functions -
*******************************************************************************/

//creates shirt object based on given jQuery
function construct(jQuery, url, timeStamp)
{
    //navigates jQuery to get all the necessary data
    const shirtPicture = jQuery('.shirt-picture').html();
    const title = jQuery('title').text();
    const price = jQuery('.price').text();
    const imgUrl = `http://shirts4mike.com/${shirtPicture.split(`img src="`)[1].split(`"`)[0]}`;

    return new Shirt(title, price, imgUrl, url, timeStamp);
}


/*******************************************************************************
    - exports -
*******************************************************************************/

module.exports.construct = construct;
