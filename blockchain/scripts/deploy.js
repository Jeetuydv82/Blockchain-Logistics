// blockchain/scripts/deploy.js
const hre = require("hardhat");

async function main() {
  console.log("🚀 Deploying ShipmentTracking contract...");

  const ShipmentTracking = await hre.ethers.getContractFactory("ShipmentTracking");
  const contract         = await ShipmentTracking.deploy();

  await contract.waitForDeployment();

  const address = await contract.getAddress();
  console.log(`✅ ShipmentTracking deployed to: ${address}`);
  console.log(`📌 Owner: ${(await hre.ethers.getSigners())[0].address}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});