import hre from 'hardhat'
import fs from 'fs-extra'
import dotenv from 'dotenv'
dotenv.config()

const { PLAYER_ACCOUNT } = process.env

;(async () => {
  try {
    const Fweb3DiamondNFTFactory = await hre.ethers.getContractFactory(
      'Fweb3DiamondNFT'
    )
    const fweb3DiamondNFT = await Fweb3DiamondNFTFactory.deploy()
    await fweb3DiamondNFT.deployed()
  
    console.log('fweb3 diamond nft deployed to:', fweb3DiamondNFT.address)
    process.exit(0)
  } catch (e) {
    console.error(e)
    process.exit(1)
  }
})()
