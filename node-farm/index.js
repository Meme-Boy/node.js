const fs = require('fs');
const http = require('http');
const url = require('url');

////////////////////////////////////////////////////////////////////////////////
// FILES

// Synchronous, blocking way

// const textIn = fs.readFileSync('./starter/txt/input.txt', 'utf-8');
// console.log(textIn);
// const textOut = `This is what we know about the avocado ${textIn}`;
// fs.writeFileSync('./starter/txt/input.txt', textOut);
// console.log('file written')

 
// Async , non blocking way
//callback hell 

// fs.readFile('./starter/txt/start.txt', 'utf-8' , (err, data) => {
//     fs.readFile(`./starter/txt/${data}.txt`, 'utf-8', (err, data1) => {
//         console.log(data1);
//         fs.readFile(`./starter/txt/append.txt`, 'utf-8', (err, data2) => {
//             console.log(data2);

//             fs.writeFile('./starter/txt/final.txt', `${data1}\n${data2}`, 'utf-8', err => {
//                 if(err){
//                     console.log('an error occured reading the file');
//                 }
//                 console.log('file written');
//             });
//         });
//     });
// });
// console.log('reading file');
 
/////////////////////////////////////////////////////////////////////////////////////////
// SERVER

const replaceTemplate = (temp, product) => {
    let output = temp.replace(/{%PRODUCTNAME%}/g, product.productName);
    output = output.replace(/{%IMAGE%}/g, product.image);
    output = output.replace(/{%PRICE%}/g, product.price);
    output = output.replace(/{%FROM%}/g, product.from);
    output = output.replace(/{%QUANTITY%}/g, product.quantity);
    output = output.replace(/{%NUTRIENTS%}/g, product.nutrients);
    output = output.replace(/{%ID%}/g, product.id);
    output = output.replace(/{%DESCRIPTION%}/g, product.description);
    if(!product.organic) output = output.replace(/{%NOT_ORGANIC%}/g, 'not-organic');
    return output;
}

const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8');
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8');
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8');

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data); //array of all object in data

const server = http.createServer((req, res) => {

    const {query, pathname} = url.parse(req.url, true); // create 2 variables: query=query part of req and pathName=pathname of req
    
    //Overview page
    if (pathname === '/' || pathname === '/overview'){
        res.writeHead(200, {'Content-type': 'text/html'});
        const cardsHtml = dataObj.map(element => replaceTemplate(tempCard, element)).join('');
        const output = tempOverview.replace('{%PRODUCT_CARD%}', cardsHtml);
        res.end(output);
    }

    //Product page
    else if (pathname === '/product'){
        const product = dataObj[query.id];
        res.writeHead(200, {'Content-type': 'text/html'});
        const output = replaceTemplate(tempProduct, product);
        res.end(output);         
    }

    //API Page
    else if (pathname === '/api'){
        res.writeHead(200, {
            'Content-type': 'application/json'
        });
        res.end(data);
    }

    //404
    else {
        res.writeHead(404, {
            'Content-type': 'text/html',
            'Test-header': 'header'
        });
        res.end('<h1>PAGE NOT FOUND<h1>');
    }
});

const PORT = 8080;

server.listen(PORT, () => {
    console.log(`server started listening to req on port ${PORT}`);
});

 