const express = require('express');
const app = express()
const request = require('request-promise');
const port = 4000
const path = require('path')
const bodyparser = require('body-parser');
const scrape = require('./lib/scraper')
app.use(express.static(__dirname + '/css'))
app.use(express.static(__dirname + '/img'))

app.use(bodyparser.urlencoded({
    extended: true
}));

app.use(bodyparser.json({
    extended: true
}));

app.get('/', function(req, res){
    res.sendFile(path.join(__dirname + '/index.html'));
})

app.post('/scrape', function(req, res){
    let username = req.body.username
    let value = async () => {
         let result = await scrape(username)
         console.log(result)
         return result
    }
    value().then((success)=> {
        res.send(success)
    })
})

app.listen(port, function(){
    console.log('YOur app is running on port'+ port)
})