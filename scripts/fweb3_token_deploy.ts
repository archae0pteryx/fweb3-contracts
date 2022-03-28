import hre from "hardhat"
import fs from 'fs-extra'

;(async () => {
  try {
    const Fweb3TokenContract = await hre.ethers.getContractFactory('Fweb3');
    const fweb3Token = await Fweb3TokenContract.deploy();
    await fweb3Token.deployed();

    fs.writeFileSync('deploy_addresses/fweb3_token', fweb3Token.address)
    
    console.log("fweb3 token deployed to:", fweb3Token.address);
  } catch (e) {
    console.error(e)
    process.exit(1)
  }
})()
