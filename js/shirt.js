
/*******************************************************************************
    - class -
*******************************************************************************/

class Shirt
{
    constructor(title, price, url, imgUrl)
    {
        this.title = title;
        this.price = price;
        this.url = url;
        this.imgUrl = imgUrl;
    }
}


/*******************************************************************************
    - helper functions -
*******************************************************************************/

function construct(jQuery, url)
{
    let shirtPicture = jQuery('.shirt-picture').html();

    let title = jQuery('title').text();
    let price = jQuery('.price').text();
    let imgUrl = `http://shirts4mike.com/${shirtPicture.split(`img src="`)[1].split(`"`)[0]}`;

    return new Shirt(title, price, url, imgUrl);
}


/*******************************************************************************
    - exports -
*******************************************************************************/

module.exports.construct = construct;
