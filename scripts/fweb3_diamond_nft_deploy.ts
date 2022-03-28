import { Contract, ContractFactory } from 'ethers'
import hre from 'hardhat'
import fs from 'fs-extra'

const deployFweb3DiamondNFT = async (): Promise<string> => {
  try {
    const Fweb3DiamondNFTFactory: ContractFactory =
      await hre.ethers.getContractFactory('Fweb3DiamondNFT')
    const fweb3DiamondNFT: Contract = await Fweb3DiamondNFTFactory.deploy()
    await fweb3DiamondNFT.deployed()
    const fweb3DiamondNFTAddress = fweb3DiamondNFT.address
    console.log('diamond nft address:', fweb3DiamondNFTAddress)
    fs.writeFileSync(
      'deploy_addresses/fweb3_diamond_nft',
      fweb3DiamondNFTAddress
    )
    return fweb3DiamondNFTAddress
  } catch (e) {
    console.error(e)
    process.exit(1)
  }
}

export { deployFweb3DiamondNFT }
