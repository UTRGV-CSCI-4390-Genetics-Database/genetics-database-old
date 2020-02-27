const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;
app.use( express.static('public'));
/*app.use('/', serveIndex('public'))*/

app.get('/', (req, res) => {
    res.sendFile(__dirname +"/public/search.html");
});
app.get('/nowy', (req, res) => {
    res.sendFile(__dirname +"/public/moj.html");
});
app.get('/text', (req, res) => {
    res.sendFile(__dirname +"/public/text.txt");
});


app.listen(PORT, () => console.log(`Listening on ${ PORT }`))


/*const path = require('path');
var fs = require('fs');
const serveIndex = require('serve-index');
const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000

express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/index'))
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))*/
