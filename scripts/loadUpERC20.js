var addresses = require("./addresses")

async function loadUpERC20() {
    ///////////////Send WETH//////////////////////////////////////////////////////////////////////
    const IERC20_SOURCE = "@openzeppelin/contracts/token/ERC20/IERC20.sol:IERC20";

    const WETH_WHALE = "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2";
    const WETH_ADDRESS = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";

    await hre.network.provider.request({
        method: "hardhat_impersonateAccount",
        params: [WETH_WHALE],
    });
    const accounts = await ethers.getSigners();
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

}

module.exports = loadUpERC20




