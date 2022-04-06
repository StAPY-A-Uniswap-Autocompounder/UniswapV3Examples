// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
var addresses = require("./addresses")
const hre = require("hardhat");
const { ethers } = require("hardhat");
const loadUpERC20 = require("./loadUpERC20.js");

function log_balances(address, eth_balance, dai_balance, weth_balance) {
  let eth_balance_f = ethers.utils.formatEther(eth_balance);
  let dai_balance_f = ethers.utils.formatEther(dai_balance);
  let weth_balance_f = ethers.utils.formatEther(weth_balance);
  eth_balance_f = (+eth_balance_f).toFixed(4);
  dai_balance_f = (+dai_balance_f).toFixed(4);
  weth_balance_f = (+weth_balance_f).toFixed(4);
  console.log(address, ":", eth_balance_f, "ETH, ", dai_balance_f, "DAI, ", weth_balance_f, "WETH");
}


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

  // for (const account of accounts) {
  //   balance = await ethers.provider.getBalance(account.address);
  //   console.log(account.address, "has balance", ethers.utils.formatEther(balance));
  // }

  ///////swap //////////////////////////////////////////////////////////////////////////////

  signer = await ethers.provider.getSigner(accounts[1].address);
  const IERC20_SOURCE = "@openzeppelin/contracts/token/ERC20/IERC20.sol:IERC20";
  daiContract = await hre.ethers.getContractAt(IERC20_SOURCE, addresses.DAI, signer);
  wethContract = await hre.ethers.getContractAt(IERC20_SOURCE, addresses.weth9, signer);

  let eth_balance = await ethers.provider.getBalance(accounts[1].address);
  let dai_balance = await daiContract.balanceOf(accounts[1].address);
  let weth_balance = await wethContract.balanceOf(accounts[1].address);
  log_balances(accounts[1].address, eth_balance, dai_balance, weth_balance);

  let dai_amount = ethers.utils.parseUnits("3456.0", daiContract.decimals);

  console.log("Approving singleSwap for daiContract...")
  daiContract = daiContract.connect(signer);
  tx = await daiContract.approve(singleSwap.address, dai_amount);
  // console.log(tx);

  console.log("Calling swapExactInputSingle..")
  tx = await singleSwap.connect(accounts[1]).swapExactInputSingle(dai_amount);
  console.log(tx);

  eth_balance = await ethers.provider.getBalance(accounts[1].address);
  dai_balance = await daiContract.balanceOf(accounts[1].address);
  weth_balance = await wethContract.balanceOf(accounts[1].address);

  log_balances(accounts[1].address, eth_balance, dai_balance, weth_balance);

  // weth_amount =
  // dai_amount = .. be sure to include a little bit extra to account for variance
  // console.log("Calling swapExactOutputSingle..")
  // tx = await singleSwap.connect(accounts[1]).swapExactOutputSingle(weth_amount, dai_amount);
  // console.log(tx);

  // log_balances(accounts[1].address, eth_balance, dai_balance, weth_balance);


}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
