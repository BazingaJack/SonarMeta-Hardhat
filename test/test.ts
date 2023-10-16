import {loadFixture} from "@nomicfoundation/hardhat-network-helpers";
import {expect} from "chai";
import {ethers} from "hardhat";

describe("SonarMeta", async function () {
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
        const Union = await ethers.getContractFactory("Union");
        const union = await Union.deploy();
        await union.deployed();
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
        const sonarmeta = await SonarMeta.deploy(ipnft.address, erc6551Account.address, erc6551Registry.address, erc4907.address, union.address);

        return {
            ipnft,
            union,
            erc6551Account,
            erc6551Registry,
            governance,
            erc4907,
            sonarmeta,
            accounts: {owner, member1, member2}
        };
    }

    describe("createNewIP", async function () {
        it("Should create new ip successfully", async function () {
            const {sonarmeta,ipnft , accounts} = await loadFixture(deployContracts);
            await sonarmeta.connect(accounts.owner).createNewIP("SonarMeta",accounts.owner.address,5);
            const a =  await ipnft.connect(accounts.owner).balanceOf(accounts.owner.address);
            await expect(ipnft.connect(accounts.owner).balanceOf(accounts.owner.address)).to.equal(1);
        });
    });
});
