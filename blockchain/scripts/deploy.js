const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying with account:", deployer.address);

  // ─── Deploy ShipmentTracking ───────────────────────
  const ShipmentTracking = await hre.ethers.getContractFactory("ShipmentTracking");
  const shipmentContract = await ShipmentTracking.deploy();
  await shipmentContract.waitForDeployment();
  console.log("✅ ShipmentTracking deployed to:", await shipmentContract.getAddress());

  // ─── Deploy DocumentVerification ──────────────────
  const DocumentVerification = await hre.ethers.getContractFactory("DocumentVerification");
  const documentContract     = await DocumentVerification.deploy();
  await documentContract.waitForDeployment();
  console.log("✅ DocumentVerification deployed to:", await documentContract.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});