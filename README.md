# 🚀 FundMe Crowdfunding Smart Contract

## 📌 Overview

**FundMe** is a decentralized crowdfunding smart contract developed on Ethereum, enabling users to fund projects with Ether. It employs Chainlink oracles for real-time price feed conversion, ensuring that funding meets a minimum USD value.

## ✨ Features

- **Decentralized Crowdfunding**: Users can fund projects by sending Ether to the contract.
- **Real-time Price Conversion**: Leverages Chainlink's AggregatorV3Interface to convert Ether's value to USD.
- **Withdrawal**: The owner can withdraw all the funds. The funds for each funder will be reset after the withdrawal.
- **View Functions**: Users can query the version of the price feed, get the owner of the contract, retrieve a specific funder's address, view the amount funded by a specific address, and get the price feed interface.

## 🚀 Getting Started

### 📋 Prerequisites

- Node.js
- Yarn
- Ethereum Wallet

### 🛠️ Installation

1. **Clone the repository**

```
git clone [repository_link]
```

2. **Install dependencies**

```
yarn install
```

### 🧪 Running Tests

This project is equipped with unit tests to ensure code integrity and behavior. To run the tests, execute:

```
yarn test
```

### 🚀 Deployment

This project is set up with Hardhat deploy scripts for both local development and other Ethereum networks. Before deploying, ensure you have set up your environment variables and configurations.

To deploy the contract, run:

```
yarn hardhat deploy
```

## 📜 Contract Logic

### 🛡️ Modifiers

- **onlyOwner**: Ensures that only the contract owner can call the function.

### 🎛️ Functions

- **fund()**: Allows a user to send Ether to fund the contract. The amount sent must meet a minimum USD threshold based on the current ETH/USD price feed.
- **getVersion()**: Retrieves the version of the Chainlink price feed.
- **withdraw()**: Allows the owner to withdraw all Ether from the contract.
- **getOwner()**: View function to retrieve the owner's address.
- **getFunders(index)**: View function to fetch a funder's address based on an index.
- **getAddressToAmountFunded(funder)**: View function to fetch the amount funded by a specific address.
- **getPriceFeed()**: View function to get the price feed interface.

## 🖋️ Author

Maxime GOGNIES

## 🤝 Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## 📜 License

MIT
