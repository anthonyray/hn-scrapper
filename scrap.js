var fs = require('fs');
var hnStories = require('./stories.js');

var ref = new Date(2014,1,1).getTime();

hnStories.getStories(ref,function(stories){
  if (stories){
    var buf = new Buffer(JSON.stringify(stories,null,2));
    fs.writeFileSync('stories.json',buf);
    console.log('Written to stories.json');
  }
  else
  {
    console.log('Abort !');
  }
});
