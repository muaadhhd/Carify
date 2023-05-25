![Screen Shot 2023-04-17 at 3 42 29 PM](https://user-images.githubusercontent.com/123268689/232593652-1bff4955-988d-4a94-a69b-24334b3d7b77.png)


# Carify

## Technology Stack & Tools

- Solidity (Writing Smart Contracts & Tests)
- Javascript (React & Testing)
- [Hardhat](https://hardhat.org/) (Development Framework)
- [Ethers.js](https://docs.ethers.io/v5/) (Blockchain Interaction)
- [React.js](https://reactjs.org/) (Frontend Framework)

## Requirements For Initial Setup

- Install [NodeJS](https://nodejs.org/en/)
- Install [Metamask] (https://metamask.io/download/)
- Add the a local Hardhat Network to your metamask
  - Network Name: Hardhat — This is up to you and defines how the network will show up in your network dropdown.
  - New RPC URL: http://127.0.0.1:8545/ — The endpoint returned from running npx hardhat node earlier.
  - Chain ID: 31337 — This is the default chain identifier that is implemented by Hardhat. You can refer to their documentation here.
  - Currency Symbol: HardhatETH — This is up to you and defines the symbol for the local network currency (ie. ETH). 

## Setting Up

### 1. Clone/Download the Repository

### 2. Install Dependencies:

`$ npm install`

### 3. Run tests

`$ npx hardhat test`

### 4. Start Hardhat node

`$ npx hardhat node`

### 5. Run deployment script

In a separate terminal execute:
`$ npx hardhat run ./scripts/deploy.js --network localhost`

### 6. Start frontend

In a separate terminal execute:
`$ npm run start`# Carify
