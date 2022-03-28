import { expect } from 'chai'
import { ethers } from 'hardhat'
import {Contract, utils} from 'ethers'
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'

let Fweb3ContractFactory, 
  fweb3Token: Contract, 
  owner: SignerWithAddress, 
  user1: SignerWithAddress

const toWei = (num: string): string => {
  return utils.formatEther(num)
}

describe('Fweb3 token deployment', async () => {
  beforeEach(async () => {
    Fweb3ContractFactory = await ethers.getContractFactory('Fweb3')
    fweb3Token = await Fweb3ContractFactory.deploy()
    await fweb3Token.deployed()
    ;[owner, user1] = await ethers.getSigners()
  })
  it('is created with some balance', async () => {
    const fweb3Balance = await fweb3Token.balanceOf(owner.address)
    const wei = await toWei(fweb3Balance)
    expect(wei).to.equal('10000000.0')
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
