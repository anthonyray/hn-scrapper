var dailyStories = require('./stories.js');

var ref = new Date(2011,1,1).getTime();
for (var i = 0 ; i < 365 ; i++){
  ref += 1000*60*60*24;
  dailyStories.getStories(ref,function(stories){
    if (stories){
      console.log(stories);
    }
    else
      console.log('fail');
    });
}
