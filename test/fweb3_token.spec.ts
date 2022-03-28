import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'
import { Contract, ContractFactory, utils } from 'ethers'
import { ethers } from 'hardhat'
import { expect } from 'chai'

let Fweb3ContractFactory: ContractFactory,
  fweb3Token: Contract,
  owner: SignerWithAddress,
  user1: SignerWithAddress

describe('Fweb3 token deployment', async () => {
  beforeEach(async () => {
    ;[owner, user1] = await ethers.getSigners()
    Fweb3ContractFactory = await ethers.getContractFactory('Fweb3Token')
    fweb3Token = await Fweb3ContractFactory.deploy()
    await fweb3Token.deployed()
  })
  it('is created with some balance', async () => {
    const fweb3Balance = await fweb3Token.balanceOf(owner.address)
    const ethBalance = await utils.formatEther(fweb3Balance)
    expect(ethBalance).to.equal('10000000.0')
  })
  it('will send tokens to another account', async () => {
    await fweb3Token.transfer(user1.address, 100)
    const user1Balance = await fweb3Token.balanceOf(user1.address)
    const user1BalanceStr = user1Balance.toString()
    const ownerBalance = await fweb3Token.balanceOf(owner.address)
    const ownerBalanceStr = ownerBalance.toString()
    expect(user1BalanceStr).to.equal('100')
    expect(ownerBalanceStr).to.equal('9999999999999999999999900')
    expect(ownerBalance - user1Balance).to.equal(9999999999999999999999900)
  })
})
