var request = require('request');
var cheerio = require('cheerio');
var async = require('async');

Date.prototype.yyyymmdd = function() { // Helper function that turns a Date to a string formatted in this fashion : yyyy-mm-dd

        var yyyy = this.getFullYear().toString();
        var mm = (this.getMonth()+1).toString(); // getMonth() is zero-based
        var dd  = this.getDate().toString();

        return yyyy + '-' + (mm[1]?mm:"0"+mm[0]) + '-' + (dd[1]?dd:"0"+dd[0]);
};

exports.getStories = function(refDate,cb){

  function getDailyStory(date,callback){ // Helper function that retrieve a story given a Date. The stories are pushed to the "stories" array.
    if (date){
      var formattedDate = date.yyyymmdd();

      request.get('http://www.daemonology.net/hn-daily/' + formattedDate + '.html',function(error, response, body){
        if (!error && response.statusCode == 200){ // Make sure everything goes right when making the request
          var $ = cheerio.load(body);
          $('.storylink').each(function(index,element){
            var story = {title : $(this).text(), link : $(this).find('a').attr('href'), date : date};
            process.stdout.write("."); // "Progress bar"
            stories.push(story);
          });
          callback();

        }
        else {
          callback('Error while issuing the request');
        }
      }
      );
    }
  }

  function generateDates(refDate){ // Helper function that generates an array of dates that starts from refDate (in ms) and goes to the 2014-04-10
    var dates = [];
    var ref = refDate;
    while( !((new Date(ref).getFullYear() == 2014) && ( (new Date(ref).getMonth() + 1) == 4) && (new Date(ref).getDate() == 10)) ){
      ref += 1000 * 60 * 60 * 24;
      dates.push(new Date(ref));
    }
    return dates;
  }

  // Generate a array of dates starting from refDate
  var dates = generateDates(refDate);

  // We now have the dates collection
  var stories = [];

  async.eachLimit(dates,5,getDailyStory,function(err){ // Make 5 simultaneous requests to the website
    if(err){
      console.log('Something went wrong ... Sorry !');
      cb()
    }
    else
    {
      console.log('Done!');
      cb(stories);
    }
  });


}
