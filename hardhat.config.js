require("dotenv/config")
require("@nomiclabs/hardhat-etherscan")
require("@nomiclabs/hardhat-waffle")
require("@nomiclabs/hardhat-ethers")
require("solidity-coverage")

require("./tasks/accounts")
require("./tasks/balance")
require("./tasks/block-number")


module.exports = {
  solidity: "0.7.6",
  networks: {
    hardhat: {
      forking: {
        url: process.env.ALCHEMY_MAINNET_RPC_URL,
        blockNumber: 14530590  // April 6th 2022, around 05:52 UTC
      }
    }
  },
  mocha: {
    timeout: 200000
  }
};
