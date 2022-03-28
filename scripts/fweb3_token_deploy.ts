import { Contract, ContractFactory } from 'ethers'
import hre from 'hardhat'
import fs from 'fs-extra'

const deployFweb3Token = async (): Promise<string> => {
  try {
    const Fweb3TokenContract: ContractFactory =
      await hre.ethers.getContractFactory('Fweb3Token')
    const fweb3Token: Contract = await Fweb3TokenContract.deploy()
    await fweb3Token.deployed()
    const fweb3TokenAddress = fweb3Token.address
    fs.writeFileSync('deploy_addresses/fweb3_token', fweb3TokenAddress)
    return fweb3TokenAddress
  } catch (e) {
    console.error(e)
    process.exit(1)
  }
}

export { deployFweb3Token }
