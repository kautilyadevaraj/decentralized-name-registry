// scripts/deploy.js
const hre = require("hardhat");

async function main() {
  const NameRegistry = await hre.ethers.getContractFactory("NameRegistry");
  const registry = await NameRegistry.deploy();

  await registry.deployed();

  console.log("NameRegistry deployed to:", registry.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
