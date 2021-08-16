const Coupoken = artifacts.require("Coupoken");
const EncNft = artifacts.require("EncNft");

module.exports = function(deployer) {
  deployer.deploy(Coupoken);
  deployer.deploy(EncNft, 'test', "TTN", "IPFS");
};
