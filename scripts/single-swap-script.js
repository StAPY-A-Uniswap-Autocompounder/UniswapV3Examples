// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
var addresses = require("./addresses")
require("./transferERC20")
const hre = require("hardhat");
const { ethers } = require("hardhat");

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

  ///////////////Send WETH//////////////////////////////////////////////////////////////////////
  const IERC20_SOURCE = "@openzeppelin/contracts/token/ERC20/IERC20.sol:IERC20";

  const WETH_WHALE = "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2";
  const WETH_ADDRESS = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";

  await hre.network.provider.request({
    method: "hardhat_impersonateAccount",
    params: [WETH_WHALE],
  });
  let signer = await ethers.provider.getSigner(WETH_WHALE);
  signer.address = signer._address;
  wethContract = await hre.ethers.getContractAt(IERC20_SOURCE, WETH_ADDRESS, signer);
  wethContract = wethContract.connect(signer);

  console.log("Signer WETH balance", ethers.utils.formatEther(await wethContract.balanceOf(signer.address)))
  // Signer WETH balance BigNumber { value: "443798472050547768667" }

  await wethContract.transfer(accounts[1].address, ethers.utils.parseEther("10"));
  balance = await wethContract.balanceOf(accounts[1].address);
  console.log("WETH balance: ", ethers.utils.formatEther(balance))

  ///////////////Send DAI//////////////////////////////////////////////////////////////////////

   await hre.network.provider.request({
     method: "hardhat_impersonateAccount",
     params: [addresses.DAI_WHALE],
   });
   signer = await ethers.provider.getSigner(addresses.DAI_WHALE);
   signer.address = signer._address;
   daiContract = await hre.ethers.getContractAt(IERC20_SOURCE, addresses.DAI, signer);
   daiContract = daiContract.connect(signer);

   console.log("Signer DAI balance", ethers.utils.formatEther(await daiContract.balanceOf(signer.address)))
   // Signer WETH balance BigNumber { value: "443798472050547768667" }

   await daiContract.transfer(accounts[1].address, ethers.utils.parseEther("123456"));
   balance = await daiContract.balanceOf(accounts[1].address);
   console.log("DAI balance: ", ethers.utils.formatEther(balance))

  ////////Send ETH/////////////////////////////////////////////////////////////////////////////
  balance = await ethers.provider.getBalance(accounts[1].address);
  console.log("balance before: ", ethers.utils.formatEther(balance));

  await signer.sendTransaction({
    to: accounts[1].address,
    value: ethers.utils.parseEther("1.0"), // Sends exactly 1.0 ether
  });



  balance = await ethers.provider.getBalance(accounts[1].address);
  console.log("balance after: ", ethers.utils.formatEther(balance));


  //////set Eth///////////////////////////////////////////////////////////////////////////////


  // await hre.network.provider.request({
  //   method: "hardhat_setBalance",
  //   params: ['0x70997970C51812dc3A010C7d01b50e0d17dc79C8', "0x1000"]
  // });

  // balance = await ethers.provider.getBalance(accounts[1].address);
  // console.log("balance set: ", balance.toString());


  //////Check all accounts///////////////////////////////////////////////////////////////////////////////


  for (const account of accounts) {
    balance = await ethers.provider.getBalance(account.address);
    console.log(account.address, "has balance", ethers.utils.formatEther(balance));
  }

  ///////swap //////////////////////////////////////////////////////////////////////////////

  tx = await singleSwap.connect(accounts[1]).swapExactOutputSingle(1,10000);
  console.log(tx);


}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
