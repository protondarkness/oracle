const TimestampRequestOracle = artifacts.require("TimestampRequestOracle");

module.exports = function (deployer) {
  deployer.deploy(TimestampRequestOracle);
};
