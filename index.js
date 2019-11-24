const Request = require("request-promise-native");
const Bunyan = require("bunyan");
const xml2js = require("xml2js");
const util = require("util");
const Adapter = require("./lib/adapter");

class RailData {
  constructor(user, pass) {
    this._user = user;
    this._pass = pass;
    this._log = new Bunyan({
      name: "rail-data",
      serializers: Bunyan.stdSerializers
    });
    this._xmlParseToJs = util.promisify(xml2js.parseString);
  }
  async _refreshAccessTokenIfRequired() {
    if (typeof this._token === "undefined") {
      await this._refreshAccessToken();
    }
  }
  async _refreshAccessToken() {
    try {
      let rawTokenData = await Request.post(
        "https://opendata.nationalrail.co.uk/authenticate"
      ).form({
        username: this._user,
        password: this._pass
      });
      this._token = JSON.parse(rawTokenData);
    } catch (err) {
      this._log.error(
        err,
        "Unable to obtain token to access national rail data feeds."
      );
      throw new Error(
        "Unable to obtain token to access national rail data feeds. Consider checking the provided username and password."
      );
    }
  }
  async getStations() {
    await this._refreshAccessTokenIfRequired();
    const rawXml = await Request.get(
      "https://opendata.nationalrail.co.uk/api/staticfeeds/4.0/stations",
      {
        headers: {
          "X-Auth-Token": this._token.token
        }
      }
    );
    const parsedStations = await this._xmlParseToJs(rawXml, {
      explicitArray: false
    });
    return parsedStations.StationList.Station.map(
      Adapter.StationAdapter.dtoToModel
    );
  }
  async getTrainOperatorCompanies() {
    await this._refreshAccessTokenIfRequired();
    const rawXml = await Request.get(
      "https://opendata.nationalrail.co.uk/api/staticfeeds/4.0/tocs",
      {
        headers: {
          "X-Auth-Token": this._token.token
        }
      }
    );
    const parsedTrainOperators = await this._xmlParseToJs(rawXml, {
      explicitArray: false
    });
    // console.log(
    //   parsedTrainOperators.TrainOperatingCompanyList.TrainOperatingCompany
    // );
    console.log(
      parsedTrainOperators.TrainOperatingCompanyList.TrainOperatingCompany.map(
        Adapter.TrainOperatorAdapter.dtoToModel
      )
    );
  }
}

module.exports = RailData;

const railData = new RailData("rockysta009@gmail.com", "Ytw3!ws@YXwdQ0VC");
railData.getTrainOperatorCompanies();
