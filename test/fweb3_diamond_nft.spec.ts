import { Contract, ContractFactory } from '@ethersproject/contracts'
import { ethers } from 'hardhat'
import { expect } from 'chai'

import { mockDiamondNFT } from './__mocks__/mockDiamondNFT'
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'

let Fweb3DiamondNFTFactory: ContractFactory,
  Fweb3TokenFactory: ContractFactory,
  fweb3Token: Contract,
  fweb3DiamondNFT: Contract,
  user1: SignerWithAddress,
  owner: SignerWithAddress

describe('Fweb3 token deployment', async () => {
  beforeEach(async () => {
    ;[owner, user1] = await ethers.getSigners()

    Fweb3TokenFactory = await ethers.getContractFactory('Fweb3Token')
    fweb3Token = await Fweb3TokenFactory.deploy()
    await fweb3Token.deployed()

    Fweb3DiamondNFTFactory = await ethers.getContractFactory('Fweb3DiamondNFT')
    fweb3DiamondNFT = await Fweb3DiamondNFTFactory.deploy()
    await fweb3DiamondNFT.deployed()
  })
  it('creates a diamond nft', async () => {
    await fweb3DiamondNFT.mint(1)
    const tokenURI = await fweb3DiamondNFT.tokenURI(1)
    const tokenBase64 = tokenURI.split('data:application/json;base64,')[1]
    const tokenBuffer = Buffer.from(tokenBase64, 'base64')
    const tokenJSON = JSON.parse(tokenBuffer.toString())
    const imageBase64 = tokenJSON.image.split('data:image/svg+xml;base64,')[1]
    const imageBuffer = Buffer.from(imageBase64, 'base64')
    const svg = imageBuffer.toString()
    expect(tokenJSON.name).to.equal('Fweb3 Diamond NFT')
    expect(tokenJSON.description).to.equal(
      'This NFT represents participation in Fweb3 2022.'
    )
    expect(svg).to.equal(mockDiamondNFT)
  })
})
