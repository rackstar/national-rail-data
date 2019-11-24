const StationAdapter = require("./station-adapter");
const TrainOperatorAdapter = require("./train-operator-adapter");

class Adapter {
  static get StationAdapter() {
    return StationAdapter;
  }
  static get TrainOperatorAdapter() {
    return TrainOperatorAdapter;
  }
}

module.exports = Adapter;
