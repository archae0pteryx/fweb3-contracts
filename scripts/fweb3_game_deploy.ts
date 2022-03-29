import { Contract, ContractFactory } from 'ethers'
import hre from 'hardhat'

import { writeAddressToFile } from './utils'

const deployFweb3Game = async (tokenAddress: string): Promise<string> => {
  try {
    const Fweb3GameFactory: ContractFactory =
      await hre.ethers.getContractFactory('Fweb3Game')
    const fweb3Game: Contract = await Fweb3GameFactory.deploy(tokenAddress)
    await fweb3Game.deployed()
    const fweb3GameAddress: string = fweb3Game.address
    writeAddressToFile('fweb3_game', fweb3GameAddress)
    console.log('fweb3 game address:', fweb3GameAddress)
    return fweb3GameAddress
  } catch (e) {
    console.error(e)
    process.exit(1)
  }
}

export { deployFweb3Game }
