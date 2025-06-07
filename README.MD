# BlockRegistry

A decentralized naming registry DApp built with **Next.js**, **Tailwind CSS**, **Shadcn UI components**, and **Hardhat** for smart contract development. This project allows users to search for, register, renew, and transfer unique names on the blockchain.

## Table of Contents

- [Features](#features)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Setup & Installation](#setup--installation)
- [Environment Variables](#environment-variables)
- [Running the Project Locally](#running-the-project-locally)
- [Deployment](#deployment)
- [Usage](#usage)
- [License](#license)

## Features

- **Name Search:** Check if a desired name is available for registration.
- **Name Registration:** Register available names on the blockchain.
- **Name Renewal:** Extend ownership of names before expiry.
- **Name Transfer:** Transfer ownership to another wallet.
- **Profile View:** Manage all registered names.
- **Adminless & Trustless:** Powered by smart contracts on Ethereum.

## Project Structure

```
project-root/
├── backend/                  # Hardhat smart contract project
│   ├── contracts/
│   ├── scripts/
│   ├── hardhat.config.js
│   └── .env                  # Environment variables
├── frontend/                 # Next.js frontend
│   ├── abi/
│   ├── app/
│   ├── components/
│   ├── lib/
│   └── public/                    
├── README.md
└── .gitignore
```

## Prerequisites

- Node.js >= 18
- npm or yarn
- MetaMask or any Ethereum-compatible wallet

## Setup & Installation

1. **Clone the repository:**

```bash
git clone https://github.com/kautilyadevaraj/decentralized-name-registry.git
cd decentralized-name-registry
```

2. **Install backend dependencies:**

```bash
cd backend
npm install
```

3. **Install frontend dependencies:**

```bash
cd ../frontend
npm install
```

## Environment Variables

Create a `.env` file in both the `backend/` directory.

### Backend `.env`
```env
SEPOLIA_RPC=https://eth-sepolia.g.alchemy.com/v2/YOUR_ALCHEMY_KEY
PRIVATE_KEY=YOUR_WALLET_PRIVATE_KEY
```

> **Note:** Never commit `.env` files. They are listed in `.gitignore`.

## Running the Project Locally

### 1. Compile and deploy contracts to Sepolia

```bash
cd backend
npx hardhat compile
npx hardhat run scripts/deploy.js --network sepolia
```

### 2. Copy ABI to frontend

```bash
cp backend/artifacts/contracts/NameRegistry.sol/NameRegistry.json frontend/abi/NameRegistry.json
```

### 3. Start the frontend

```bash
cd frontend
npm run dev
```

Open your browser at `http://localhost:3000`

## Deployment

You can deploy the frontend easily using **Vercel**:

Add your environment variables on Vercel's dashboard.

## Usage

- **Register a Name:** `/register`
- **Search a Name:** `/search?name=yourname.dcn`
- **View Name Details:** `/name/yourname.dcn`
- **Renew a Name:** `/renew/yourname.dcn`
- **User Profile:** `/profile`
- **Explore All Names:** `/explore`

## License

MIT © 2025 Kautilya DK
