import { expect } from 'chai'
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'
import { Contract, ContractFactory } from 'ethers'
import { ethers } from 'hardhat'

let Fweb3GameFactory: ContractFactory,
  fweb3Game: Contract,
  Fweb3TokenFactory: ContractFactory,
  fweb3Token: Contract,
  owner: SignerWithAddress,
  user1: SignerWithAddress

describe('Fweb3 game deployment', async () => {
  beforeEach(async () => {
    ;[owner, user1] = await ethers.getSigners()

    Fweb3TokenFactory = await ethers.getContractFactory('Fweb3Token')
    fweb3Token = await Fweb3TokenFactory.deploy()
    await fweb3Token.deployed()

    Fweb3GameFactory = await ethers.getContractFactory('Fweb3Game')
    fweb3Game = await Fweb3GameFactory.deploy(fweb3Token.address)
    await fweb3Game.deployed()
  })
  it.only('creates game contract', async () => {
    expect(true).to.equal(true)
  })
})
