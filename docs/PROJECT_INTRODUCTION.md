# ERC20 Faucet Project Introduction

## What this project is

This project is a local-first Web3 faucet application with two ERC20 tokens and two independent faucet contracts.

Users can:

- connect a wallet
- switch to the local Hardhat network
- claim `Trump Coin` once
- claim `Biden Coin` once
- view their current wallet balance and claim status for each faucet

Each faucet is independent, so one wallet can claim from both faucets, but only once per faucet.

## Project structure

### `hardhat/`

Smart contract workspace.

- Solidity contracts live in `hardhat/contracts`
- Ignition deployment modules live in `hardhat/ignition/modules`
- reusable export helpers live in `hardhat/utils`
- deployment output metadata lives in `hardhat/deployments`

### `generated/`

Shared generated contract output.

- exported addresses
- exported ABIs
- deployment metadata

### `web/`

Next.js frontend.

- App Router page in `web/src/app`
- UI components in `web/src/components`
- Web3 hooks in `web/src/hooks`
- chain and wagmi config in `web/src/lib/web3`
- frontend contract bindings in `web/src/contracts/generated.ts`

### `docs/`

Project documentation, onboarding notes, screenshots, and SOPs.

## Main frontend behavior

The homepage contains:

- a top wallet area with connection state and current network details
- a network warning strip when the wallet is on the wrong chain
- two faucet cards, one for Trump Coin and one for Biden Coin
- claim actions with loading states, toasts, and balance refresh highlights

If a user clicks claim while disconnected, the app asks them to connect first.

If a user is connected to the wrong chain, the app prompts a switch to the Hardhat local chain.

## Contract export flow

After deployment, contract addresses and ABIs are exported from `hardhat` into:

- `generated/contracts.ts`
- `web/src/contracts/generated.ts`

The current export command is:

```bash
cd hardhat
npm run export:generated
```

## Current screenshots

- Desktop: [faucet-homepage-desktop.png](/Users/mac/Desktop/Web/BlockchainDemoProjects/erc20-faucet/docs/faucet-homepage-desktop.png)
- Mobile: [faucet-homepage-mobile.png](/Users/mac/Desktop/Web/BlockchainDemoProjects/erc20-faucet/docs/faucet-homepage-mobile.png)

## Current verification status

The current frontend has been checked with:

- `npm run lint`
- `npm run build`
- runtime page load on the local Next.js dev server
- desktop screenshot capture
- mobile screenshot capture

At this stage, the page structure, visual layout, and build pipeline are working.
