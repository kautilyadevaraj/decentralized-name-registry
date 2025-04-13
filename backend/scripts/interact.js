// scripts/interact.js
const hre = require("hardhat");

async function main() {
  // Replace this with your deployed contract address
  const contractAddress = "0xA161123716B1a7EB5332a88CE9910601D0AB01b0";

  // Get the contract factory and attach to the deployed contract
  const NameRegistry = await hre.ethers.getContractFactory("NameRegistry");
  const registry = NameRegistry.attach(contractAddress);

  // Define the name to check and register
  const nameToRegister = "mytest.dcn";
  const durationYears = 1; // Change the number of years as needed

  // Check if the name is available
  const available = await registry.isAvailable(nameToRegister);
  console.log(`Name '${nameToRegister}' is available: ${available}`);

  if (available) {
    // Calculate the registration fee (0.01 ETH per year)
    const feePerYear = "0.01"; // in ETH
    const totalFee = hre.ethers.utils.parseEther(
      (parseFloat(feePerYear) * durationYears).toString()
    );

    console.log(
      `Registering '${nameToRegister}' for ${durationYears} year(s) with fee: ${totalFee.toString()} wei`
    );

    // Send the transaction to register the name
    try {
      const tx = await registry.register(nameToRegister, durationYears, {
        value: totalFee,
      });
      console.log("Transaction sent. Waiting for confirmation...");

      // Wait for the transaction to be mined
      const receipt = await tx.wait();
      console.log("Name registered successfully!");
      console.log("Transaction receipt:", receipt);
    } catch (err) {
      console.error("Registration failed:", err.reason || err.message);
    }
  } else {
    console.log("Name already registered. Choose another!");
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
