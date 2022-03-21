// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
var addresses = require("./addresses")
const hre = require("hardhat");
const { ethers } = require("hardhat");
const loadUpERC20 = require("./loadUpERC20.js");

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
  const SingleSwap = await hre.ethers.getContractFactory("SingleSwap");
  const singleSwap = await SingleSwap.deploy(addresses.SWAP_ROUTER);

  await singleSwap.deployed();
  console.log("SingleSwap deployed to:", singleSwap.address);

  const accounts = await ethers.getSigners();


  await loadUpERC20();

  //////Check all accounts///////////////////////////////////////////////////////////////////////////////


  for (const account of accounts) {
    balance = await ethers.provider.getBalance(account.address);
    console.log(account.address, "has balance", ethers.utils.formatEther(balance));
  }

  ///////swap //////////////////////////////////////////////////////////////////////////////

  // tx = await singleSwap.connect(accounts[1]).swapExactOutputSingle(1,10000);
  // console.log(tx);


}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
