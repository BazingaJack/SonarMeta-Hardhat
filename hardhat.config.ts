import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomicfoundation/hardhat-chai-matchers";

const config: HardhatUserConfig = {
  solidity: "0.8.20",
  networks: {
    hardhat: {},
    ganache: {
        url: 'http://localhost:7545',
        accounts: [
            '0xfc02eb04c430e8ce7e5afdeb579045d73ec158acf8d00532ef09c27130b1cbb9',
            '0xd0e3f2286024f9b9088c3e4ad162b85fefdc1322f76fb26d36de54de342356e8',
            '0x601a166a21b1ca5841049537015dac5537b0ec7fd364dcac335c101a51a06fe3',
      ],
    },
    goerli: {
      url: 'https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
      accounts: [
          '0x50fb7c000bfbbc198b4bfab7c504a710efa84bc96f01f885e51cab7d1a28de86',
          '0xae498178730bc3c079f150bf3794a690ea5e05b0ec27949e51c953c1c785ee4f',
          '0x212bfdfb1280a9cf5fbd9e23e10efda6bd570be6ea8911d004634a1eb2274dc1',
      ]
    }
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
},
};

export default config;
