require("@nomicfoundation/hardhat-toolbox");

module.exports = {
  solidity: "0.8.20",
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545"
    },
    sepolia: {
      url: "https://eth-sepolia.g.alchemy.com/v2/684lCNrsBC8E08ZVVJqDT",
      accounts: ["94ef6126933a16f8aac988533893025efe6060291e5c43aeda8c2a542f2ca1fa"]  // ← paste your key here
    }
  }
};