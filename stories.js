var request = require('request');
var cheerio = require('cheerio');

Date.prototype.yyyymmdd = function() {

        var yyyy = this.getFullYear().toString();
        var mm = (this.getMonth()+1).toString(); // getMonth() is zero-based
        var dd  = this.getDate().toString();

        return yyyy + '-' + (mm[1]?mm:"0"+mm[0]) + '-' + (dd[1]?dd:"0"+dd[0]);
};

exports.getStories = function (datems,cb) {
  var stories = [];
  var formattedDate = new Date(datems).yyyymmdd();

  request.get('http://www.daemonology.net/hn-daily/' + formattedDate + '.html',function(error, response, body){
    if (!error && response.statusCode == 200){
      var $ = cheerio.load(body);
      $('.storylink').each(function(index,element){
        var story = {title : $(this).text(), link : $(this).find('a').attr('href')};
        stories.push(story);
      });
      cb(stories);
    }
    else {
      cb();
    }
  }
  );
};
