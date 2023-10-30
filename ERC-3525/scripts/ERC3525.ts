import { Address } from "cluster";
import { Typed } from "ethers";
import { ethers } from "hardhat";

async function main() {
  const owner = "0x562dd807824B816f484Dd7a0b74005c955A71A5C"
  const GettingStarted = await ethers.deployContract("ERC3525GettingStarted",[owner])
  await GettingStarted.waitForDeployment();
  console.log(`GettingStarted deployed to ${GettingStarted.target}`);
}


async function readERC3525(contractAdd:string, owner: Typed) {
  
  const contractIns = await ethers.getContractAt('ERC3525GettingStarted', contractAdd);

  const balanceOfOwner = await contractIns.balanceOf(owner);
  console.log(balanceOfOwner);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
// main().catch((error) => {
//   console.error(error);
//   process.exitCode = 1;
// });

const contractAddress= "0x642A95856b02AF873e0DE4ae33ba9C9B129E2Daf"

readERC3525(contractAddress,Typed.address('0x562dd807824B816f484Dd7a0b74005c955A71A5C')).catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

readERC3525(contractAddress, Typed.uint256('1')).catch((error) => {
  console.error(error);
  process.exitCode = 1;
})