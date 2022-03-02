var glob = require("glob"),
  path = require("path");

class UserModel {
  constructor(id, filePath) {
    this.id = id;
    this.filePath = filePath;
    this.data = require(this.filePath);
  }
  isInActivitySelection(fromDate, toDate, filterType) {
    let validDates = Object.keys(this.data.calendar.dateToDayId).filter(
      (x) =>
        new Date(x) >= new Date(fromDate) && new Date(x) <= new Date(toDate)
    );
    let validDayIdsFromValidDates = validDates.map(
      (x) => this.data.calendar.dateToDayId[x]
    );
    let validDayIdsFromMealIds = Object.values(
      this.data.calendar.mealIdToDayId
    ).filter((x) => validDayIdsFromValidDates.includes(x));
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
let status, fromDate, toDate;

process.argv.forEach(function (val, index, array) {
  //console.log(index + ": " + val);
  if (index == 2) {
    status = val;
  }
  if (index == 3) {
    fromDate = val;
  }
  if (index == 4) {
    toDate = val;
  }
});

glob.sync("./../data/*.json").forEach(function (file) {
  require(path.resolve(file));
  let user = new UserModel(path.basename(file, ".json"), file);
  let isValidUserSelection = user.isInActivitySelection(
    fromDate,
    toDate,
    status
  );
  if (isValidUserSelection == true) {
    users.push(Number(user.id));
  }
});

console.log(users);