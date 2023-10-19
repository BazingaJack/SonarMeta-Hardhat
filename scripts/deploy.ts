import {ethers} from "hardhat";
import * as fs from "fs";

async function main() {
    const network: any = process.env.HARDHAT_NETWORK;
    // Come from the hardhat.config.ts, the first account is the default account to deploy contracts.
    const [owner, member1, member2] = await ethers.getSigners();

    // deploy tokens
    console.log('Deploy contracts in ' + network)
    console.log('Deploy IPNFT Contract...')
    const IPNFT = await ethers.getContractFactory("IPNFT");
    const ipnft = await IPNFT.deploy('IP Token', 'IPT');
    await ipnft.deployed();
    // console.log('Deploy Union Contract...')
    // const Union = await ethers.getContractFactory("Union");
    // const union = await Union.deploy();
    // await union.deployed();
    console.log('Deploy ERC6551Account...')
    const ERC6551Account = await ethers.getContractFactory("ERC6551Account");
    const erc6551Account = await ERC6551Account.deploy();
    await erc6551Account.deployed();
    console.log('Deploy ERC6551Registry...')
    const ERC6551Registry = await ethers.getContractFactory("ERC6551Registry");
    const erc6551Registry = await ERC6551Registry.deploy();
    await erc6551Registry.deployed();
    // deploy governance
    console.log('Deploy governance...')
    const Governance = await ethers.getContractFactory("Governance");
    const governance = await Governance.deploy();
    await governance.deployed();
    console.log('Deploy ERC4907...')
    const ERC4907 = await ethers.getContractFactory("ERC4907");
    const erc4907 = await ERC4907.deploy('ERC4907 token','T');
    await erc4907.deployed();
    // deploy main contract
    console.log('Deploy SonarMeta...')
    const SonarMeta = await ethers.getContractFactory("SonarMeta");
    const sonarmeta = await SonarMeta.deploy(ipnft.address, erc6551Account.address, erc6551Registry.address, erc4907.address);

    // save the addresses
    const addresses = {
        main: sonarmeta.address,
        governance: governance.address,
        IPNFT: ipnft.address,
        ERC6551Account: erc6551Account.address,
        ERC6551Registry: erc6551Registry.address,
        ERC4907: erc4907.address,
    }
    console.log(addresses)
    fs.writeFile(`address-${network}.json`, JSON.stringify(addresses, undefined, 4), err => {
        if (err) console.log('Write file error: ' + err.message)
        else console.log(`Addresses is saved into address-${network}.json...`)
    })
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
