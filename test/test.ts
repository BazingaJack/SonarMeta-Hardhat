import {loadFixture} from "@nomicfoundation/hardhat-network-helpers";
import {expect} from "chai";
import {ethers} from "hardhat";
import { token } from "../typechain-types/@openzeppelin/contracts";

describe("SonarMeta deployed", async function () {
    // We define a fixture to reuse the same setup in every test.
    // We use loadFixture to run this setup once, snapshot that state,
    // and reset Hardhat Network to that snapshot in every test.
    async function deployContracts() {
        // Contracts are deployed using the first signer/account by default
        const [owner, member1, member2] = await ethers.getSigners();

        // deploy tokens
        const IPNFT = await ethers.getContractFactory("IPNFT");
        const ipnft = await IPNFT.deploy('IP Token', 'IPT');
        await ipnft.deployed();
        // const Union = await ethers.getContractFactory("Union");
        // const union = await Union.deploy();
        // await union.deployed();
        const ERC6551Account = await ethers.getContractFactory("ERC6551Account");
        const erc6551Account = await ERC6551Account.deploy();
        await erc6551Account.deployed();
        const ERC6551Registry = await ethers.getContractFactory("ERC6551Registry");
        const erc6551Registry = await ERC6551Registry.deploy();
        await erc6551Registry.deployed();
        const Governance = await ethers.getContractFactory("Governance");
        const governance = await Governance.deploy();
        await governance.deployed();
        const ERC4907 = await ethers.getContractFactory("ERC4907");
        const erc4907 = await ERC4907.deploy('ERC4907 token','T');
        await erc4907.deployed();
        // deploy main contract
        const SonarMeta = await ethers.getContractFactory("SonarMeta");
        const sonarmeta = await SonarMeta.deploy(ipnft.address, erc6551Account.address, erc6551Registry.address, erc4907.address);

        return {
            ipnft,
            erc6551Account,
            erc6551Registry,
            governance,
            erc4907,
            sonarmeta,
            accounts: {owner, member1, member2}
        };
    }

    //IPNFT test
    describe("IPNFT test", async function () {
        it("Should mint new IPNFT successfully",async function () {
            const tokenId = 0;
            const {ipnft, accounts} = await loadFixture(deployContracts);
            
            await ipnft.connect(accounts.owner).mint(accounts.member1.address,"IPNFT1");
            await expect((await ipnft.balanceOf(accounts.member1.address)).toNumber()).to.equal(1);
            await expect(await ipnft.ownerOf(tokenId)).to.equal(accounts.member1.address);
            await expect(await ipnft.tokenURI(tokenId)).to.equal("IPNFT1");

            await ipnft.connect(accounts.owner).mint(accounts.member2.address,"IPNFT2");
            await expect((await ipnft.balanceOf(accounts.member2.address)).toNumber()).to.equal(1);
            await expect(await ipnft.ownerOf(tokenId+1)).to.equal(accounts.member2.address);
            await expect(await ipnft.tokenURI(tokenId+1)).to.equal("IPNFT2");

        })
    })

    //Union test
    describe("Union test",async function () {
        it("Should create new Union successfully",async function () {
            const {sonarmeta, accounts} = await loadFixture(deployContracts);
            await sonarmeta.connect(accounts.owner).createNewUnion();
        })

        it("Should add a member to a union successfully",async function () {
            const {sonarmeta, accounts} = await loadFixture(deployContracts);
            await sonarmeta.connect(accounts.owner).createNewUnion();
            await sonarmeta.connect(accounts.owner).addMemberToUnion(0,accounts.member1.address,5);
            await expect(sonarmeta.connect(accounts.member1).addMemberToUnion(0,accounts.member2.address,5)).to.be.revertedWith('Error: Only union creator can add member to union.');
        })
    })

    describe("Create new IP test",async function () {
        it("Should create new IP successfully",async function () {
            const {sonarmeta, accounts} = await loadFixture(deployContracts);
            await sonarmeta.connect(accounts.owner).createNewIP("IPNFT1",accounts.member1.address,31337);
        })
    })

    describe("Grant to union test",async function () {
        it("Should grant to union successfully",async function () {
            const {sonarmeta, accounts,erc4907} = await loadFixture(deployContracts);
            await sonarmeta.connect(accounts.owner).createNewUnion();
            await sonarmeta.connect(accounts.owner).addMemberToUnion(0,accounts.member1.address,5);
            // await sonarmeta.connect(accounts.owner).mint4907Token(accounts.member2.address,0);
            await sonarmeta.connect(accounts.owner).grantToUnion(accounts.member2.address,0,0,100);
        })
    })
});
