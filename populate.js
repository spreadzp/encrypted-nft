const Coupoken = artifacts.require("Coupoken");

module.exports = async function(callback) {
  const coupoken = await Coupoken.deployed();
  let user1 = "0x6a127a88b13ba193bb9554e8a210baa00c185a97"
  let user2 = "0x54a7f61e5c200886729d8550e6b2033a0ed39643"
  await coupoken.createMerchant('Bob', 'Clothes', 'test.com', {from: user1})
  let merchantInfo = await coupoken.getMerchantInfo(user1, {from: user1});
  console.log("Create Merchant");
  console.log(merchantInfo);

  await coupoken.createMerchant('Alice', 'Food', 'test2.com', {from: user2})
  let merchantInfo2 = await coupoken.getMerchantInfo(user2, {from: user2});

  console.log("Create Merchant 2");
  console.log(merchantInfo2);

  await coupoken.createCoupon('0', '100000', '1621814400', '1', 'https://gateway.pinata.cloud/ipfs/QmTjsJZqmQx15nUu1dfhjZ1akU9Y9CUPKbNzXtCKZL9nZD', {from: user1})
  let couponInfo = await coupoken.getCouponInfo(1, {from: user1});
  console.log("Minting complete");
  console.log(couponInfo);
  callback();
}


// Coupoken.deployed().then(function(instance) {app = instance})
