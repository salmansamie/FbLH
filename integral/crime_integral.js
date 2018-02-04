let https = require('https')

let url = 'https://data.police.uk/api/crimes-street/all-crime?poly=52.268,0.543:52.794,0.238:52.130,0.478&date=2017-01';

https.get(url, function(res){
    let body = '';

    res.on('data', function(chunk){
        body += chunk;
    });

    res.on('end', function(){
        let response = JSON.parse(body);
        let finishedArray = [];

        for (let i = 0; i < response.length; i++) {
            let record = response[i];

            finishedArray.push({
                category: record.category,
                location: {
                    latitude: record.location.latitude,
                    longitude: record.location.longitude,
            },
                month: record.month
            });
        }

        console.log(finishedArray);
    });

}).on('error', function(e){
    console.log("Got an error: ", e);
});
