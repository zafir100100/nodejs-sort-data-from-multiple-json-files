var glob = require('glob')
    , path = require('path');

class UserModel {
    constructor(id, filePath) {
        this.id = id;
        this.filePath = filePath;
        this.data = require(this.filePath);
    }
    isInActivitySelection(fromDate, toDate, filterType) {
        let validDates = Object.keys(this.data.calendar.dateToDayId).filter(x => new Date(x) >= new Date(fromDate) && new Date(x) <= new Date(toDate));
        let validDayIdsFromValidDates = validDates.map(x => this.data.calendar.dateToDayId[x]);
        let validDayIdsFromMealIds = Object.values(this.data.calendar.mealIdToDayId).filter(x => validDayIdsFromValidDates.includes(x));
        let activityCount = validDayIdsFromMealIds.length;
        if (filterType == "active" && activityCount >= 5 && activityCount <= 10) {
            return true;
        } else if (filterType == "superactive" && activityCount >= 11) {
            return true;
        } else if (filterType == "bored" && activityCount <= 4) {
            return true;
        } else {
            return false;
        }
    }
}

let users = [];

glob.sync('./assets/se-coding-assignment/data/*.json').forEach(function (file) {
    require(path.resolve(file));
    let user = new UserModel(path.basename(file, '.json'), file);
    let isValidUserSelection = user.isInActivitySelection("2016-07-01", "2016-07-31", "superactive");
    if (isValidUserSelection == true) {
        users.push(Number(user.id));
    }
});

console.log(users);









// const express = require('express'); //Import the express dependency
// const { timeStamp } = require('console');
// const app = express();              //Instantiate an express app, the main work horse of this server
// const port = 5000;                  //Save the port number where your server will be listening

// app.get('/', function (req, res) {
//     res.send('GET request to homepage')
// });

// // //Idiomatic expression in express to route and respond to a client request
// // app.get('/', (req, res) => {        //get requests to the root ("/") will route here
// //     res.sendFile('index.html', {root: __dirname});      //server responds by sending the index.html file to the client's browser
// //                                                         //the .sendFile method needs the absolute path to the file, see: https://expressjs.com/en/4x/api.html#res.sendFile
// // });

// app.listen(port, () => {            //server starts listening for any attempts from a client to connect at port: {port}
//     console.log(`Now listening on port ${port}`);
// });