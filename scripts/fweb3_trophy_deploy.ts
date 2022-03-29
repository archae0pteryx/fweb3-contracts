import { Contract, ContractFactory } from 'ethers'
import hre from 'hardhat'

import { writeAddressToFile } from './utils'

const deployFweb3TrophyNFT = async (gameAddress: string): Promise<string> => {
  try {
    const Fweb3TrophyNFTFactory: ContractFactory =
      await hre.ethers.getContractFactory('Fweb3TrophyNFT')
    const fweb3Trophy: Contract = await Fweb3TrophyNFTFactory.deploy(
      gameAddress
    )
    await fweb3Trophy.deployed()
    const fweb3TrophyAddress = fweb3Trophy.address
    writeAddressToFile('fweb3_trophy', fweb3TrophyAddress)
    console.log('fweb3 trophy address:', fweb3TrophyAddress)
    return fweb3TrophyAddress
  } catch (e) {
    console.error(e)
    process.exit(1)
  }
}

export { deployFweb3TrophyNFT }
