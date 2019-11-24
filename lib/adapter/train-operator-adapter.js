class TrainOperatorCompanyAdapter {
  static dtoToModel(trainOperatorDto) {
    return {
      tocCode: trainOperatorDto.AtocCode,
      name: trainOperatorDto.Name,
      website: trainOperatorDto.CompanyWebsite
    };
  }
}
module.exports = TrainOperatorCompanyAdapter;
