# PoetryMoves

PoetryMoves is the first web3 poetry collectible card game (CCG) experience built on Sui, with a modern Next.js frontend. Users can participate in poetry contests, purchase word packs, and create poems using blockchain technology.

---

## Table of Contents

- [Project Structure](#project-structure)
- [Features](#features)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Backend (Move Contracts)](#backend-move-contracts)
  - [Frontend (Next.js)](#frontend-nextjs)
- [Smart Contracts](#smart-contracts)
- [Frontend](#frontend)
- [Environment Variables](#environment-variables)
- [Testing & Linting](#testing--linting)
- [Assets](#assets)
- [Contributing](#contributing)
- [License](#license)

---

## Project Structure

```
poetrymoves/
├── move_contracts/      # Move smart contracts for contests and poetry
│   ├── contest_contract/
│   │   ├── sources/     # contest.move: contest logic
│   ├── poetry_contract/
│   │   ├── sources/     # random.move, words.move: word pack logic
├── poetry_frontend/     # Next.js frontend
│   ├── components/      # React UI components
│   ├── hooks/           # Custom React hooks
│   ├── pages/           # Next.js pages
│   ├── utils/           # Utility functions
│   ├── assets/          # Fonts & images
│   ├── styles/          # CSS files
│   ├── firebase/        # Firebase config
│   ├── .husky/          # Git hooks
│   ├── .trunk/          # Linting configs
│   ├── .vscode/         # Editor settings
│   ├── public/          # Static assets
│   ├── ...              # Config files
├── README.md            # Project documentation
└── .gitignore           # Git ignore rules
```

---

## Features

- **Decentralized Poetry Contests:** Submit poems, vote, and win prizes.
- **Word Pack Marketplace:** Buy themed word packs to use in poems.
- **Blockchain Integration:** All contest and poem data stored on-chain.
- **Modern UI:** Responsive, animated frontend with typewriter effects.
- **User Authentication:** Secure login/signup via Firebase.
- **IPFS Support:** Store and retrieve poems/images in a decentralized way.

---

## Getting Started

### Prerequisites

- Node.js (>=18.x)
- Yarn or npm
- Move CLI (for smart contracts)
- Sui blockchain devnet/testnet access
- Firebase project (for authentication)

### Backend (Move Contracts)

1. **Install Move CLI:**  
   [Move CLI Installation Guide](https://move-language.github.io/move/)
2. **Compile Contracts:**  
   ```sh
   cd move_contracts/contest_contract
   move build
   cd ../poetry_contract
   move build
   ```
3. **Deploy to Sui:**  
   Follow Sui documentation to deploy the compiled modules.

### Frontend (Next.js)

1. **Install dependencies:**  
   ```sh
   cd poetry_frontend
   yarn install
   ```
2. **Configure environment variables:**  
   Copy `.env.sample` to `.env.local` and fill in required values (see [Environment Variables](#environment-variables)).
3. **Run the development server:**  
   ```sh
   yarn dev
   ```
   The app will be available at `http://localhost:3000`.

---

## Smart Contracts

- **contest.move:** Handles contest creation, poem submission, voting, and rewards.
- **words.move & random.move:** Manage word packs, random word selection, and purchases.

See `move_contracts/contest_contract/sources/contest.move` and `move_contracts/poetry_contract/sources/words.move` for details.

---

## Frontend

- Built with [Next.js](https://nextjs.org/) and [Tailwind CSS](https://tailwindcss.com/).
- Components for poem cards, modals, contest pages, word pack purchase, and more.
- Firebase authentication (`poetry_frontend/firebase/config.js`).
- Sui blockchain interaction (`poetry_frontend/utils/sui.js`).
- IPFS integration (`poetry_frontend/utils/ipfs.js`).

---

## Environment Variables

Configure the following in `.env.local`:

```
NEXT_PUBLIC_SUI_NETWORK=...
NEXT_PUBLIC_CONTRACT_ADDRESS=...
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_IPFS_GATEWAY=...
```

See `.env.sample` for all required variables.

---

## Testing & Linting

- **Lint:**  
  ```sh
  yarn lint
  ```
- **Prettier:**  
  ```sh
  yarn format
  ```
- **Pre-commit hooks:**  
  Managed via Husky (`.husky/`).

---

## Assets

- Fonts: `assets/font/`
- Images: `assets/images/`
- Static files: `public/`

---

## Contributing

1. Fork the repo and clone locally.
2. Create a new branch for your feature/fix.
3. Commit your changes with clear messages.
4. Submit a pull request.

---

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.

---

## Contact

For questions or support, open an issue or contact the maintainers.
