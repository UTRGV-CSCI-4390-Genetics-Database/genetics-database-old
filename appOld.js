const express = require('express');
var fs = require('fs');
const app = express();
const PORT = process.env.PORT || 5000
const path = require('path');
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({extended: false}))

app.get('/', function(req, res){
    res.sendFile(__dirname + '/public/index.html');
})

app.post('/end', function(req, res){
    res.send('to jest end');
})

app.post('/', function(req, res) {
  
    saveToPublicFolder(req.body, function(err) {
      if (err) {
        res.status(404).send('User not saved');
        return;
      }
       res.send('User saved');
    });
  });
  
  function saveToPublicFolder(person, callback) {
    fs.writeFile('./public/data.json', JSON.stringify(person), callback);
  }

  app.post('/new', function(req, res){
    res.send("witam dwa tygodnie pozniej");
  });

  app.get('/results', function(req, res){
    res.sendFile(__dirname + '/public/results.html');
  });

app.listen(PORT, function(){console.log(`severe started on port ${PORT}`)});
