var express = require('express');

var app = express();
var PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static('public'));

var friends = require('./app/data/friends');
require('./app/routing/apiRoutes')(app);
require('./app/routing/htmlRoutes')(app);

console.log(friends);

app.listen(PORT, function() {
  console.log(`Now listening on port:${PORT}`);
});