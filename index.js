var http = require('http');
var express = require('express');
var templates = require('mustache');
var request = require('request');
const port = process.env.PORT;
//setting up the server and basic routes;

const app = express();

app.get('/', (req, res, next) => {
    console.log("Entered the function.\n");
    res.render("pages/home");
    function next() {
        console.log("Rendering over;\n");
    };
});

// set the view engine to ejs
app.set('view engine', 'ejs');

//main stock route;
app.get('/:symbol', function(req, client_response) {
    
    //forming the url;
    var symbol = req.params.symbol;
    var querystring = "https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=" + symbol + "&interval=60min&outputsize=compact&apikey=8J2C7GOK7UT02D6C";
    
    var stock_price;
    var stockPromise = new Promise(function (resolve, reject) {
        //making the request;
        request(querystring, {json: "yes"}, function(err, res, body) {
            if (err) {
                reject(err);
            } else {
                resolve(body);
            }
        })
    }).then( function(result, err) {
        if (err) {
            console.log(err);
        } else {
            name = result["Global Quote"]["01. symbol"];
            stock_price = result["Global Quote"]["02. open"];
            client_response.render('pages/stock_result', {
                stock_name: name,
                stock_value: stock_price
            });
        }
    })
});     //end of app.get;

app.listen(process.env.PORT, () => {
    console.log("Rad Stocks is listening for requests on port 3000.");
});
