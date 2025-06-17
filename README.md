# [Poetry in motion](https://poetrymoves.us Sui Move Contract

This project implements a Sui Move smart contract for minting, composing, and managing word and poem NFTs. Users can mint packs of words, create poems (sentences) from word NFTs, and decompose poems back into words. The contract supports customizable packs, special packs, and booster packs, with flexible configuration for parts of speech and word lists.

---

## Features

- **Mint Packs:** Mint packs of word NFTs with customizable parts of speech and word counts.
- **Special Packs:** Create special packs with custom word lists and configurations.
- **Booster Packs:** Mint all words in a special pack at once (one per address).
- **Poem Creation:** Compose a poem NFT by combining word NFTs (words are burned).
- **Poem Decomposition:** Burn a poem NFT to mint back the original word NFTs.
- **Admin Controls:** Add/remove packs, add words, release funds, change admin/beneficiary.

---

## Project Structure

- `sources/words.move`: Main contract logic for words, packs, and sentences.
- `sources/random.move`: Pseudorandom number utilities for random word selection.
- `Move.toml`: Move package manifest.

---

## Deployment

To publish the contract to the Sui blockchain, run:

```sh
sui client publish --gas-budget <gas_amount>
```

If you need to include unpublished dependencies:

```sh
sui client publish --gas-budget <gas_amount> --with-unpublished-dependencies --skip-dependency-verification
```

---

## Main Functions

### Add a Special Pack

Creates a new special pack with custom parts of speech and word counts.

```move
words2words::add_special_pack(
    pack_name: vector<u8>,
    price: u64,
    background_image: vector<u8>,
    pack_pos_quantity: vector<u64>,
    pack_parts: vector<vector<u8>>,
    wordsdata: &mut WordsData,
    ctx: &mut TxContext
)
```

### Add Words to a Part of Speech

Adds a list of words to a specific part of speech.

```move
words2words::add_part_of_speech_words(
    part_of_speech: vector<u8>,
    wordsdata: &mut WordsData,
    words: vector<vector<u8>>,
    ctx: &mut TxContext
)
```

### Mint a Pack

Mints a pack of word NFTs to a kiosk.

```move
words2words::mintPack(
    pack_name: vector<u8>,
    kiosk: &mut Kiosk,
    cap: &KioskOwnerCap,
    wordsdata: &mut WordsData,
    coin: Coin<SUI>,
    ctx: &mut TxContext
)
```

### Make a Sentence (Poem)

Creates a poem NFT from a set of word NFTs (burns the word NFTs).

```move
words2words::make_sentence(
    words: vector<Word>,
    image_url: vector<u8>,
    background: vector<u8>,
    title: vector<u8>,
    author: vector<u8>,
    clock: &Clock,
    ctx: &mut TxContext
)
```

### Decompose Poem Back to Words

Burns a poem NFT and mints back the original word NFTs.

```move
words2words::sentence_to_words(
    sentence: Sentence,
    kiosk: &mut Kiosk,
    cap: &KioskOwnerCap,
    ctx: &mut TxContext
)
```

---

## Example: Add a Special Pack

```js
txb.moveCall({
  target: PACKAGE+'::words2words::add_special_pack',
  arguments: [
    txb.pure("Degen Pack"),
    txb.pure(10e9),
    txb.pure("eeeeee"),
    txb.pure([14,5,3,8,9,1]),
    txb.pure(["noun", "verb", "adjective", "interjection"]),
    txb.object(WordsDataObject),
  ],
});
```

---

## License

MIT