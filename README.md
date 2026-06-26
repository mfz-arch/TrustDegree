# 🎓 TrustDegree - Verifiable Credentials on Avalanche

TrustDegree is a decentralized anti-fraud infrastructure built on the Avalanche blockchain for the **Avalanche Student Hackathon (Track 2: Education & Credentials)**.

## 🌟 The Problem
Employers and educational institutions in Africa face a massive crisis of fake degrees and fraudulent credentials. Verifying a candidate's background often requires slow, manual background checks that can take weeks and cost significant money. Honest students suffer because their hard-earned degrees are constantly questioned.

## 💡 The Solution
TrustDegree empowers universities to issue tamper-proof academic certificates directly to the Avalanche blockchain. When a student applies for a job, the employer simply enters the unique Certificate ID into our Verification Portal. Within milliseconds, they receive cryptographic proof of the degree's authenticity.

## 🏗️ Architecture & Tech Stack
- **Smart Contracts:** Solidity (Deployed on Avalanche Fuji Testnet)
- **Frontend UI:** Next.js, TailwindCSS, Framer Motion (Premium Dark/Gold Theme)
- **Blockchain Interaction:** Ethers.js
- **Global Indexing / Cache:** Firebase (For instant global feed without excessive RPC calls)

### Smart Contract Information
- **Network:** Avalanche Fuji Testnet
- **Contract Address:** `0xD51d285B7739B89B7c509DDE9d3102f726D4Cb48`

## 🚀 How it Works

### For Institutions (Issuing)
1. The University connects their Web3 Wallet (MetaMask / Core) to the platform.
2. Navigates to the **Institution Portal**.
3. Enters the student's details (Name, Course, Date) and a unique Certificate ID.
4. Clicks "Issue Certificate" and signs the transaction. The data is immutably recorded on Avalanche.

### For Employers (Verifying)
1. The Employer visits the **Verify Certificate** tab.
2. Enters the unique Certificate ID provided by the candidate.
3. The platform queries the Avalanche Smart Contract directly.
4. Instantly displays a cryptographic proof of authenticity (Green Success Card) or a failure notice if the ID is fake.

## 💻 Running Locally

First, install the dependencies:
```bash
npm install
```

Then, run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
