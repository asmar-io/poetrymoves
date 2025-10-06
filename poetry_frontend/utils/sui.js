import { KioskClient, KioskTransaction, Network } from '@mysten/kiosk'
import { SuiClient } from '@mysten/sui.js/client'
import { TransactionBlock } from '@mysten/sui.js/transactions'

const ankrConnection =
  'https://rpc.ankr.com/sui/9e543248eeb29d8c51d2dab93eb7504f6f0409855a23377ca39674a8bbd7a4ec'

const ankrConnection_testnet = 'https://rpc.ankr.com/sui_testnet'

//const provider = new SuiClient({ url: getFullnodeUrl(process.env.NEXT_PUBLIC_SUI_NETWORK) });

const provider = new SuiClient({
  url: process.env.NEXT_PUBLIC_SUI_NETWORK == 'mainnet' ? ankrConnection : ankrConnection_testnet,
})

const kioskClient = new KioskClient({
  client: provider,
  network: process.env.NEXT_PUBLIC_SUI_NETWORK == 'mainnet' ? Network.MAINNET : Network.TESTNET,
})

export const PACKAGE = process.env.NEXT_PUBLIC_POETRY_CONTRACT
export const WordsDataObject = process.env.NEXT_PUBLIC_POETRY_DATA_OBJECT

const CONTEST_PACKAGE = '0x693e809dea351a451917e67c015ea9cb241ec9cb77f9fdb5beedd50c0604bbb3'
const CONTEST_ADDRESS = '0x71c45675f2e63633f4e6347ed2a48536cc9b735d751d5df958a11f6c0d8af300'

export let words_kiosk_object_id
export let words_kiosk_cap_object_id

let poems_kiosk_object_id
let poems_kiosk_cap_object_id

export const sleep = ms => new Promise(r => setTimeout(r, ms))

export const getAllSentences = async wallet => {
  try {
    const { kioskOwnerCaps, kioskIds } = await kioskClient.getOwnedKiosks({
      address: wallet?.address,
    })
    let kiosk_id = ''
    let objects_sentences = await Promise.all(
      kioskOwnerCaps?.map(async kiosk_cap => {
        let kiosk_objects = await kioskClient.getKiosk({
          id: kiosk_cap.kioskId,
          options: {
            withKioskFields: true,
            withListingPrices: false,
            withObjects: true,
            objectOptions: { showContent: true, showDisplay: true },
          },
        })
        kiosk_objects.items = kiosk_objects?.items?.filter(
          item =>
            item?.type == PACKAGE + '::words2words::Word' ||
            item?.type == PACKAGE + '::words2words::Sentence',
        )
        if (kiosk_objects?.items[0]?.type == PACKAGE + '::words2words::Word') {
          words_kiosk_object_id = kiosk_cap.kioskId
          words_kiosk_cap_object_id = kiosk_cap.objectId
        } else if (kiosk_objects?.items[0]?.type == PACKAGE + '::words2words::Sentence') {
          kiosk_id = kiosk_cap.kioskId
          let poems = kiosk_objects.items
          poems_kiosk_object_id = kiosk_id
          poems_kiosk_cap_object_id = kiosk_cap.objectId
          return poems
        }
      }),
    )
    console.log(objects_sentences)
    objects_sentences = objects_sentences.filter(item => item)
    console.log(objects_sentences)
    let objects_sentences_not_in_kiosk = await provider.getOwnedObjects({
      owner: wallet?.address,
      options: { showDisplay: true, showContent: true, showOwner: true },
      filter: { StructType: PACKAGE + '::words2words::Sentence' },
    })
    if (objects_sentences[0] == undefined) objects_sentences[0] = []
    objects_sentences[0] = objects_sentences[0].concat(objects_sentences_not_in_kiosk.data)
    console.log(objects_sentences[0])
    return [...objects_sentences[0]]
  } catch (e) {
    console.log(e)
    return []
  }
}

const getAllObjects = async (wallet, cursor) => {
  try {
    const { kioskOwnerCaps, kioskIds } = await kioskClient.getOwnedKiosks({
      address: wallet?.address,
    })
    console.log(kioskOwnerCaps)
    let kiosk_id = ''
    let objectsWords = await Promise.all(
      kioskOwnerCaps?.map(async kiosk_cap => {
        let kiosk_objects = await kioskClient.getKiosk({
          id: kiosk_cap.kioskId,
          options: {
            withKioskFields: true,
            withListingPrices: true,
            withObjects: true,
            objectOptions: { showContent: true },
          },
        })
        kiosk_objects.items = kiosk_objects?.items?.filter(
          item =>
            item?.type == PACKAGE + '::words2words::Word' ||
            item?.type == PACKAGE + '::words2words::Sentence',
        )
        if (kiosk_objects?.items[0]?.type == PACKAGE + '::words2words::Word') {
          kiosk_id = kiosk_cap.kioskId
          let words = kiosk_objects.items
          words_kiosk_object_id = kiosk_id
          words_kiosk_cap_object_id = kiosk_cap.objectId
          return words
        } else if (kiosk_objects?.items[0]?.type == PACKAGE + '::words2words::Sentence') {
          kiosk_id = kiosk_cap.kioskId
          poems_kiosk_object_id = kiosk_id
          poems_kiosk_cap_object_id = kiosk_cap.objectId
        }
      }),
    )
    objectsWords = objectsWords.filter(item => item)
    const objectsWords_not_in_kiosk = await provider.getOwnedObjects({
      owner: wallet?.address,
      cursor: cursor === '' ? null : cursor,
      options: { showDisplay: true, showContent: true, showOwner: true },
      filter: { StructType: PACKAGE + '::words2words::Word' },
    })
    if (objectsWords[0] == undefined) objectsWords[0] = []
    objectsWords[0] = objectsWords[0].concat(objectsWords_not_in_kiosk.data)
    return [...objectsWords[0]]
  } catch (e) {
    console.log(e)
    return []
  }
}

export const getWordsKiosk = async wallet => {
  try {
    const { kioskOwnerCaps, kioskIds } = await kioskClient.getOwnedKiosks({
      address: wallet?.address,
    })
    let kiosk_id
    let objectsWords = await Promise.all(
      kioskOwnerCaps?.map(async kiosk_cap => {
        let kiosk_objects = await kioskClient.getKiosk({
          id: kiosk_cap.kioskId,
          options: {
            withKioskFields: true,
            withListingPrices: true,
            withObjects: true,
          },
        })
        kiosk_objects.items = kiosk_objects?.items?.filter(
          item =>
            item?.type == PACKAGE + '::words2words::Word' ||
            item?.type == PACKAGE + '::words2words::Sentence',
        )
        if (kiosk_objects?.items[0]?.type == PACKAGE + '::words2words::Word') {
          console.log(kiosk_objects?.items[0])
          kiosk_id = kiosk_cap.kioskId
          words_kiosk_object_id = kiosk_id
          words_kiosk_cap_object_id = kiosk_cap.objectId
          return kiosk_id
        }
      }),
    )
    objectsWords = objectsWords.filter(item => item)
    console.log(objectsWords)
    return objectsWords[0]
  } catch (e) {
    console.log(e)
    return []
  }
}

const getWordsKiosk2 = async wallet => {
  try {
    const { kioskOwnerCaps, kioskIds } = await kioskClient.getOwnedKiosks({
      address: wallet?.address,
    })
    let kiosk_id
    let objectsWords = await Promise.all(
      kioskOwnerCaps?.map(async kiosk_cap => {
        let kiosk_objects = await kioskClient.getKiosk({
          id: kiosk_cap.kioskId,
          options: {
            withKioskFields: true,
            withListingPrices: true,
            withObjects: true,
          },
        })
        kiosk_objects.items = kiosk_objects?.items?.filter(
          item =>
            item?.type == PACKAGE + '::words2words::Word' ||
            item?.type == PACKAGE + '::words2words::Sentence',
        )
        if (kiosk_objects?.items[0]?.type == PACKAGE + '::words2words::Word') {
          console.log(kiosk_objects?.items[0])
          kiosk_id = kiosk_cap.kioskId
          words_kiosk_object_id = kiosk_id
          words_kiosk_cap_object_id = kiosk_cap.objectId
          return kiosk_cap
        }
      }),
    )
    objectsWords = objectsWords.filter(item => item)
    console.log(objectsWords)
    return objectsWords[0]
  } catch (e) {
    console.log(e)
    return []
  }
}

const getPoemsKiosk = async wallet => {
  try {
    const { kioskOwnerCaps, kioskIds } = await kioskClient.getOwnedKiosks({
      address: wallet?.address,
    })
    let objectsWords = await Promise.all(
      kioskOwnerCaps?.map(async kiosk_cap => {
        let kiosk_objects = await kioskClient.getKiosk({
          id: kiosk_cap.kioskId,
          options: {
            withKioskFields: true,
            withListingPrices: true,
            withObjects: true,
          },
        })
        kiosk_objects.items = kiosk_objects?.items?.filter(
          item =>
            item?.type == PACKAGE + '::words2words::Word' ||
            item?.type == PACKAGE + '::words2words::Sentence',
        )
        if (kiosk_objects?.items[0]?.type == PACKAGE + '::words2words::Sentence') {
          return kiosk_cap
        }
      }),
    )
    objectsWords = objectsWords.filter(item => item)
    console.log(objectsWords[0])
    return objectsWords[0]
  } catch (e) {
    console.log(e)
    return []
  }
}

const getSuifrenKiosk = async wallet => {
  try {
    let capy_type =
      '0xee496a0cc04d06a345982ba6697c90c619020de9e274408c7819f787ff66e1a1::suifrens::SuiFren<0xee496a0cc04d06a345982ba6697c90c619020de9e274408c7819f787ff66e1a1::capy::Capy>'
    let bullshark_type =
      '0xee496a0cc04d06a345982ba6697c90c619020de9e274408c7819f787ff66e1a1::suifrens::SuiFren<0x8894fa02fc6f36cbc485ae9145d05f247a78e220814fb8419ab261bd81f08f32::bullshark::Bullshark>'
    const { kioskOwnerCaps, kioskIds } = await kioskClient.getOwnedKiosks({
      address: wallet?.address,
    })
    let objectsWords = await Promise.all(
      kioskOwnerCaps?.map(async kiosk_cap => {
        let kiosk_objects = await kioskClient.getKiosk({
          id: kiosk_cap.kioskId,
          options: {
            withKioskFields: true,
            withListingPrices: true,
            withObjects: true,
          },
        })
        kiosk_objects.items = kiosk_objects?.items?.filter(
          item => item?.type == capy_type || item?.type == bullshark_type,
        )
        for (let index = 0; index < kiosk_objects.items.length; index++) {
          const element = kiosk_objects.items[index]
          if (element?.type == capy_type || element?.type == bullshark_type) {
            let voted = await checkIfSuifrenVoted(element.objectId)
            if (!voted) {
              kiosk_cap.suifren_id = element.objectId
              kiosk_cap.type = element.type
              return kiosk_cap
            }
          }
        }
      }),
    )
    objectsWords = objectsWords.filter(item => item)
    //console.log(objectsWords[0]);
    return objectsWords[0]
  } catch (e) {
    console.log(e)
    return
  }
}

export const getPoem = async poem_id => {
  try {
    let poem_object = await provider.getObject({
      id: poem_id,
      options: { showContent: true, showDisplay: true },
    })
    console.log(poem_object)
    return poem_object?.data
  } catch (error) {
    return undefined
  }
}

export const getPoems = async () => {
  try {
    let poem_event_objects = await provider.queryEvents({
      query: { MoveEventType: PACKAGE + '::words2words::SentenceCreated' },
    })
    let poem_objects = await provider.multiGetObjects({
      ids: poem_event_objects?.data?.map(item => item.parsedJson.sentence_id),
      options: { showContent: true, showDisplay: true },
    })
    poem_objects = poem_objects.filter(item => item?.data)
    console.log(poem_objects)
    return poem_objects
  } catch (error) {
    return undefined
  }
}

export const getContestPoems = async () => {
  try {
    const res = await provider.getDynamicFieldObject({
      parentId: CONTEST_ADDRESS,
      name: { type: '0x1::string::String', value: 'votes' },
    })
    let all_poems_in_contest = []
    let hasNext = true
    let nextCursor = null
    while (hasNext) {
      let ress = await provider.getDynamicFields({
        parentId: res?.data?.content?.fields?.value?.fields?.id?.id,
        cursor: nextCursor,
        limit: 50,
      })
      hasNext = ress.hasNextPage
      nextCursor = ress.nextCursor
      let votes_objects = await provider.multiGetObjects({
        ids: ress?.data?.map(item => item.objectId),
        options: { showContent: true },
      })
      let poem_objects = await provider.multiGetObjects({
        ids: votes_objects?.map(item => item.data.content.fields.value.fields.poemId),
        options: { showContent: true, showDisplay: true },
      })
      poem_objects = poem_objects
        .filter(item => item?.data)
        .map((item, index) => {
          item.data.content.fields.votes =
            votes_objects[index]?.data.content.fields.value.fields.votes
          return item
        })
      all_poems_in_contest = all_poems_in_contest.concat(poem_objects)
    }
    return all_poems_in_contest
  } catch (error) {
    return undefined
  }
}

const getChangedObjects = async object => {
  const objectIds =
    object[0].reference !== null
      ? object.map(item => item.reference.objectId)
      : object.map(item => item.objectId)
  try {
    if (objectIds.length > 50) {
      const firstObj = objectIds.slice(0, 50)
      const sndObj = objectIds.slice(50, objectIds.length)
      const firstObjectsWords = await provider.multiGetObjects({
        ids: firstObj,
        options: {
          showDisplay: true,
        },
      })
      const sndObjectsWords = await provider.multiGetObjects({
        ids: sndObj,
        options: {
          showDisplay: true,
        },
      })
      return [...firstObjectsWords, ...sndObjectsWords]
    } else {
      const objectsWords = await provider.multiGetObjects({
        ids: objectIds,
        options: {
          showDisplay: true,
        },
      })
      return objectsWords
    }
  } catch (e) {
    console.log(e)
    return []
  }
}

export const load = async (wallet, cursor = '') => {
  const words = await getAllObjects(wallet, cursor)
  return words
}

export const CryptoMintPack = async (packName, price, wallet) => {
  const txb = new TransactionBlock()
  const coin = txb.splitCoins(txb.gas, [txb.pure(price * 1e9)]) //! the price is hardcoded, should be dynamic
  let kiosk_object
  let kioskOwnerCap_object
  const kioskId = await getWordsKiosk(wallet)
  if (kioskId == undefined || words_kiosk_cap_object_id == undefined) {
    const [kiosk, kioskOwnerCap] = txb.moveCall({ target: '0x2::kiosk::new' })
    kiosk_object = kiosk
    kioskOwnerCap_object = kioskOwnerCap
  } else {
    kiosk_object = txb.object(kioskId)
    kioskOwnerCap_object = txb.object(words_kiosk_cap_object_id)
  }
  txb.moveCall({
    target: PACKAGE + '::words2words::mintSpecialPack',
    arguments: [
      txb.pure(packName),
      kiosk_object,
      kioskOwnerCap_object,
      txb.object(WordsDataObject),
      coin,
    ],
  })
  if (kioskId == undefined || words_kiosk_cap_object_id == undefined) {
    txb.transferObjects([kioskOwnerCap_object], txb.pure(wallet.address, 'address'))
    txb.moveCall({
      target: '0x2::transfer::public_share_object',
      arguments: [kiosk_object],
      typeArguments: ['0x2::kiosk::Kiosk'],
    })
  }
  txb.setGasBudget(4e8)
  try {
    let signedTransaction = await wallet.signTransactionBlock({
      transactionBlock: txb,
    })
    let resData = await provider.executeTransactionBlock({
      transactionBlock: signedTransaction.transactionBlockBytes,
      signature: signedTransaction.signature,
      options: { showEffects: true },
    })
    await sleep(3000)
    const newWords = await getChangedObjects(wallet, resData.effects.created)
    return newWords
  } catch (e) {
    console.log(e)
    return []
  }
}

export const BullSharkMintPack = async (packName, price, wallet) => {
  const txb = new TransactionBlock()
  const coin = txb.splitCoins(txb.gas, [txb.pure(price * 1e9)]) //! the price is hardcoded, should be dynamic
  let kiosk_object
  let kioskOwnerCap_object
  const kioskId = await getWordsKiosk(wallet)
  if (kioskId == undefined || words_kiosk_cap_object_id == undefined) {
    const [kiosk, kioskOwnerCap] = txb.moveCall({ target: '0x2::kiosk::new' })
    kiosk_object = kiosk
    kioskOwnerCap_object = kioskOwnerCap
  } else {
    kiosk_object = txb.object(kioskId)
    kioskOwnerCap_object = txb.object(words_kiosk_cap_object_id)
  }
  txb.moveCall({
    target: PACKAGE + '::words2words::mintSpecialPack',
    arguments: [
      txb.pure(packName),
      kiosk_object,
      kioskOwnerCap_object,
      txb.object(WordsDataObject),
      coin,
    ],
  })
  if (kioskId == undefined || words_kiosk_cap_object_id == undefined) {
    txb.transferObjects([kioskOwnerCap_object], txb.pure(wallet.address, 'address'))
    txb.moveCall({
      target: '0x2::transfer::public_share_object',
      arguments: [kiosk_object],
      typeArguments: ['0x2::kiosk::Kiosk'],
    })
  }
  txb.setGasBudget(4e8)
  try {
    let signedTransaction = await wallet.signTransactionBlock({
      transactionBlock: txb,
    })
    let resData = await provider.executeTransactionBlock({
      transactionBlock: signedTransaction.transactionBlockBytes,
      signature: signedTransaction.signature,
      options: { showEffects: true },
    })
    await sleep(3000)
    const newWords = await getChangedObjects(wallet, resData.effects.created)
    return newWords
  } catch (e) {
    console.log(e)
    return []
  }
}

export const mintPack = async (packName, price, wallet) => {
  if (packName != 'Starter' && packName != 'Jumbo' && packName != 'Colossal') {
    if (packName == 'Degen Pack' || packName == 'Test Pack') {
      return await CryptoMintPack(packName, price, wallet)
    } else {
      return await BullSharkMintPack('Sui Pack', 3, wallet)
    }
  }
  const txb = new TransactionBlock()
  const fraction = process.env.NEXT_PUBLIC_SUI_NETWORK === 'testnet' ? 1e8 : 1e9
  const coin = txb.splitCoins(txb.gas, [txb.pure(price * fraction)])
  let kiosk_object
  let kioskOwnerCap_object
  const kioskId = await getWordsKiosk(wallet)
  if (kioskId == undefined || words_kiosk_cap_object_id == undefined) {
    const [kiosk, kioskOwnerCap] = txb.moveCall({ target: '0x2::kiosk::new' })
    kiosk_object = kiosk
    kioskOwnerCap_object = kioskOwnerCap
  } else {
    kiosk_object = txb.object(kioskId)
    kioskOwnerCap_object = txb.object(words_kiosk_cap_object_id)
  }
  txb.moveCall({
    target: PACKAGE + '::words2words::mintPack',
    arguments: [
      txb.pure(packName),
      kiosk_object,
      kioskOwnerCap_object,
      txb.object(WordsDataObject),
      coin,
    ],
  })
  if (kioskId == undefined || words_kiosk_cap_object_id == undefined) {
    txb.transferObjects([kioskOwnerCap_object], txb.pure(wallet.address, 'address'))
    txb.moveCall({
      target: '0x2::transfer::public_share_object',
      arguments: [kiosk_object],
      typeArguments: ['0x2::kiosk::Kiosk'],
    })
  }
  txb.setGasBudget(7e8)
  try {
    let signedTransaction = await wallet.signTransactionBlock({
      transactionBlock: txb,
    })
    let resData = await provider.executeTransactionBlock({
      transactionBlock: signedTransaction.transactionBlockBytes,
      signature: signedTransaction.signature,
      options: { showEffects: true },
    })
    await sleep(3000)
    const newWords = await getChangedObjects(wallet, resData.effects.created)
    return newWords
    /*
    const resData = await wallet.signAndExecuteTransactionBlock( {
      transactionBlock: txb,
      options: {
        showEffects: true,
      }
    } );
    await sleep( 3000 );
    const newWords = await getChangedObjects( wallet, resData.effects.created );
    return newWords;
    */
  } catch (e) {
    console.log(e)
    return []
  }
}

export const mintSentence = async (wallet, basket, imageUrl, background, title, author) => {
  if (!wallet.connected || basket.length == 0) return false
  const txb = new TransactionBlock()
  const wordkioskId = await getWordsKiosk2(wallet)
  const poemKioskId = await getPoemsKiosk(wallet)

  const poemkioskTx = new KioskTransaction({
    transactionBlock: txb,
    kioskClient,
  })
  const wordkioskTx = new KioskTransaction({
    transactionBlock: txb,
    kioskClient,
  })

  if (poemKioskId == undefined) {
    poemkioskTx.create()
  } else {
    poemkioskTx.setCap(poemKioskId)
  }

  if (wordkioskId == undefined) {
    wordkioskTx.create()
  } else {
    wordkioskTx.setCap(wordkioskId)
  }

  let objects = basket.map(b => ({ object: b.objectId, owner: b.owner }))

  let words = []
  objects.map(ob => {
    let word = ob.object
    console.log(ob.owner != wallet.address, ob.owner, ob.object)
    if (ob.owner != wallet.address) {
      word = wordkioskTx.take({
        itemType: PACKAGE + '::words2words::Word',
        itemId: ob.object,
      })
    }
    words.push(word)
  })

  let sentence = txb.moveCall({
    target: PACKAGE + '::words2words::make_sentence',
    arguments: [
      txb.makeMoveVec({ objects: words.reverse() }),
      txb.pure(imageUrl),
      txb.pure(background),
      txb.pure(title),
      txb.pure(author),
      txb.object('0x6'),
    ],
  })

  txb.moveCall({
    target: '0x2::kiosk::place',
    arguments: [poemkioskTx.getKiosk(), poemkioskTx.getKioskCap(), sentence],
    typeArguments: [PACKAGE + '::words2words::Sentence'],
  })

  if (poemKioskId == undefined) {
    poemkioskTx.shareAndTransferCap(wallet.address)
  }

  poemkioskTx.finalize()
  try {
    // execute the programmable transaction
    let signedTransaction = await wallet.signTransactionBlock({
      transactionBlock: txb,
    })
    let resData = await provider.executeTransactionBlock({
      transactionBlock: signedTransaction.transactionBlockBytes,
      signature: signedTransaction.signature,
    })
    console.log('sentance minted successfully!', resData)
    return true
  } catch (e) {
    console.error('nft mint failed', e)
    return false
  }
}

export const sentanceToWords = async (wallet, sentanceId, owner) => {
  if (!wallet.connected) return
  const txb = new TransactionBlock()
  const kioskId = await getWordsKiosk2(wallet)
  const poemKioskId = await getPoemsKiosk(wallet)
  const poemkioskTx = new KioskTransaction({
    transactionBlock: txb,
    kioskClient,
    cap: poemKioskId,
  })
  const kioskTx = new KioskTransaction({ transactionBlock: txb, kioskClient })
  if (kioskId == undefined || words_kiosk_cap_object_id == undefined) {
    kioskTx.create()
  } else {
    kioskTx.setCap(kioskId)
  }

  let sentence =
    owner === wallet.address
      ? txb.object(sentanceId)
      : poemkioskTx.take({
          itemType: PACKAGE + '::words2words::Sentence',
          itemId: sentanceId,
        })

  txb.moveCall({
    target: PACKAGE + '::words2words::sentence_to_words',
    arguments: [sentence, kioskTx.getKiosk(), kioskTx.getKioskCap()],
  })
  if (kioskId == undefined || words_kiosk_cap_object_id == undefined) {
    kioskTx.shareAndTransferCap(wallet?.address)
  }
  kioskTx.finalize()
  try {
    // execute the programmable transaction
    let signedTransaction = await wallet.signTransactionBlock({
      transactionBlock: txb,
    })
    let resData = await provider.executeTransactionBlock({
      transactionBlock: signedTransaction.transactionBlockBytes,
      signature: signedTransaction.signature,
    })
    console.log('words minted successfully!', resData)
    return true
    //load();
  } catch (e) {
    console.error('nft mint failed', e)
    return false
  }
}

export const checkIfMinted = async wallet => {
  if (!wallet.connected) return
  const res = await provider.getDynamicFieldObject({
    parentId: WordsDataObject,
    name: { type: '0x1::string::String', value: 'minted' },
  })
  const ress = await provider.getDynamicFieldObject({
    parentId: res?.data?.content?.fields?.value?.fields?.id?.id,
    name: { type: 'address', value: wallet.address },
  })
  return ress?.data?.content?.fields?.value == 1
}

export const checkIfSuifrenVoted = async suifren_id => {
  const res = await provider.getDynamicFieldObject({
    parentId: CONTEST_ADDRESS,
    name: { type: '0x1::string::String', value: 'voted' },
  })
  const ress = await provider.getDynamicFieldObject({
    parentId: res?.data?.content?.fields?.value?.fields?.id?.id,
    name: { type: 'address', value: suifren_id },
  })
  return ress?.data?.content?.fields?.name == suifren_id
}

export const checkIfPoemSubmitted = async poem_id => {
  const res = await provider.getDynamicFieldObject({
    parentId: CONTEST_ADDRESS,
    name: { type: '0x1::string::String', value: 'votes' },
  })
  const ress = await provider.getDynamicFieldObject({
    parentId: res?.data?.content?.fields?.value?.fields?.id?.id,
    name: { type: 'address', value: poem_id },
  })
  return ress?.data != undefined
}

export const getAllSubmittedPoems = async poems_ids => {
  const res = await provider.getDynamicFieldObject({
    parentId: CONTEST_ADDRESS,
    name: { type: '0x1::string::String', value: 'votes' },
  })
  let used_poems_id = await Promise.all(
    poems_ids.map(async id => {
      const ress = await provider.getDynamicFieldObject({
        parentId: res?.data?.content?.fields?.value?.fields?.id?.id,
        name: { type: 'address', value: id },
      })
      if (ress?.data != undefined) return id
    }),
  )
  return used_poems_id.filter(item => item)
}

export const submitPoemContest = async (wallet, sentanceId, owner) => {
  if (!wallet.connected) return
  let contest = await getContestInfo()
  const now = new Date().getTime()
  if (contest?.content?.fields?.submission_end_time <= now) return 2
  const txb = new TransactionBlock()
  const poemKioskId = await getPoemsKiosk(wallet)
  const poemkioskTx = new KioskTransaction({
    transactionBlock: txb,
    kioskClient,
    cap: poemKioskId,
  })
  const coin = txb.splitCoins(txb.gas, [txb.pure(1 * 1e9)])

  if (owner === wallet.address) {
    sentence = txb.object(sentanceId)
    txb.moveCall({
      target: CONTEST_PACKAGE + '::poetry_contest::submit_poem',
      typeArguments: [PACKAGE + '::words2words::Sentence'],
      arguments: [txb.object(sentanceId), coin, txb.object(CONTEST_ADDRESS), txb.object('0x6')],
    })
  } else {
    let [item, promise] = poemkioskTx.borrow({
      itemType: PACKAGE + '::words2words::Sentence',
      itemId: sentanceId,
    })
    txb.moveCall({
      target: CONTEST_PACKAGE + '::poetry_contest::submit_poem',
      typeArguments: [PACKAGE + '::words2words::Sentence'],
      arguments: [item, coin, txb.object(CONTEST_ADDRESS), txb.object('0x6')],
    })
    poemkioskTx.return({ itemType: PACKAGE + '::words2words::Sentence', item, promise }).finalize()
  }

  try {
    // execute the programmable transaction
    let signedTransaction = await wallet.signTransactionBlock({
      transactionBlock: txb,
    })
    let resData = await provider.executeTransactionBlock({
      transactionBlock: signedTransaction.transactionBlockBytes,
      signature: signedTransaction.signature,
    })
    console.log('words minted successfully!', resData)
    return 1
    //load();
  } catch (e) {
    console.error('nft mint failed', e)
    return 3
  }
}

export const voteContest = async (wallet, sentanceId) => {
  if (!wallet.connected) return
  let contest = await getContestInfo()
  const now = new Date().getTime()
  if (contest?.content?.fields?.voting_end_time <= now) return 2
  const txb = new TransactionBlock()
  const suifrenKioskId = await getSuifrenKiosk(wallet)
  if (suifrenKioskId == undefined || suifrenKioskId == []) return 1
  console.log(suifrenKioskId)
  const suifrenKioskTx = new KioskTransaction({
    transactionBlock: txb,
    kioskClient,
    cap: suifrenKioskId,
  })
  let [item, promise] = suifrenKioskTx.borrow({
    itemType: suifrenKioskId.type,
    itemId: suifrenKioskId.suifren_id,
  })
  txb.moveCall({
    target: CONTEST_PACKAGE + '::poetry_contest::vote',
    typeArguments: [PACKAGE + '::words2words::Sentence', suifrenKioskId.type],
    arguments: [txb.pure.address(sentanceId), item, txb.object(CONTEST_ADDRESS), txb.object('0x6')],
  })
  suifrenKioskTx.return({ itemType: suifrenKioskId.type, item, promise }).finalize()
  try {
    // execute the programmable transaction
    let signedTransaction = await wallet.signTransactionBlock({
      transactionBlock: txb,
    })
    let resData = await provider.executeTransactionBlock({
      transactionBlock: signedTransaction.transactionBlockBytes,
      signature: signedTransaction.signature,
    })
    console.log('words minted successfully!', resData)
    return 3
    //load();
  } catch (e) {
    console.error('nft mint failed', e)
    return false
  }
}

export const getContestInfo = async () => {
  try {
    let contest_object = await provider.getObject({
      id: CONTEST_ADDRESS,
      options: { showContent: true },
    })
    return contest_object?.data
  } catch (error) {
    return undefined
  }
}

export const formatSuiAddress = address => {
  return address?.substring(0, 8) + '...' + address?.substring(address?.length - 8, address?.length)
}
