var apiKey = 'fdb2ca00-9ffa-11e3-bac4-9d818938e717';
var appID = '5308006d3dd7d1a14e063a5c';
var logs = [];
var scores = {};
var scoresArray = [];
var topBillersTable = document.getElementById('top-billers-table');

$(function() {
  loadLogs();
  setTimeout(function(){getScores()}, 3000);
});

//load all records and save to logs array
function loadLogs() {

  // api 
  var api_url = 'https://api.knackhq.com/v1/objects/object_16/records';
  
  var customerPage = 1;
  var maxPage = 3;
  
  while(customerPage < maxPage) {

    var url = api_url + "?page=" + customerPage + "&rows_per_page=500&sort_field=field_95&sort_order=asc";
      
    $.ajax({
      url: url,
      async: true,
      type: "GET",
      headers: {
        'X-Knack-Application-Id': appID,
        'X-Knack-REST-API-Key': apiKey
      },
      success: function(data) {
        if (data != null && data.records != null) {
          maxPage = data.total_pages;
          for(var i = 0; i < data.records.length; i++) {
            if (data.records[i].field_318.length > 0 && data.records[i].field_97.length > 0) {
            var log = {
              tech: data.records[i].field_318_raw[0].identifier,
              hours: data.records[i].field_97,
            };
            }
            
         if (log.tech.length > 0 && log.hours.length > 0) { //only add if neither field is blank

         	logs.push(log);
           console.log(log.tech);
         }
            
          }
        }
      }
    });
    
    // increment page
    customerPage++;
  } 
}

function getScores () {
  
  var sortedScores = [];
  
  //initialize all scores to 0
  for (var i = 0; i < logs.length; i++) {
    scores[logs[i].tech] = 0;
  }
    
  for (var i = 0; i < logs.length; i++) {
    scores[logs[i].tech] += parseFloat(logs[i].hours);
  }
  console.log(scores);
  console.log(logs[0]);
  
//add names/compiled scores to array in order to sort (didn't have much luck sorting a dictionary in JS)
for (var key in scores) {
    if (scores.hasOwnProperty(key)) {
         var s = {
              tech: key,
              hours: scores[key]
            };
		sortedScores.push(s);
    }
 
}
  	//sort high to low
    sortedScores.sort(function (a, b) {
    var aHours = a.hours;
    var bHours = b.hours;

    return (aHours > bHours) ? -1 : 1;

});          
	//add results to HTML table
    for (var k = 0; k < sortedScores.length ; k++) {
    var row = topBillersTable.insertRow(topBillersTable.length);
    var cell = row.insertCell(0);
    cell.innerHTML = (k+1) + ".  " + sortedScores[k].tech;
    cell = row.insertCell(1);
    cell.innerHTML = sortedScores[k].hours;
  }
  
  $('#loading').addClass("hidden");
}



