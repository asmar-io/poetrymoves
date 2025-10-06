import { TransactionBlock } from '@mysten/sui.js/transactions'
import axios from '../utils/axios'
import { PACKAGE, WordsDataObject, getWordsKiosk, words_kiosk_cap_object_id } from '../utils/sui'

export const mintPackCustodial = async (packName, price, wallet) => {
  // special packs
  // if (packName != 'Starter' && packName != 'Jumbo' && packName != 'Colossal') {
  //   if (packName == 'Degen Pack' || packName == 'Test Pack') {
  //     return await CryptoMintPack(packName, price, wallet)
  //   } else {
  //     return await BullSharkMintPack('Sui Pack', 3, wallet)
  //   }
  // }

  // set up transaction block
  const target = PACKAGE + '::words2words::mintPack'
  const txb = new TransactionBlock()
  const fraction = process.env.NEXT_PUBLIC_SUI_NETWORK === 'testnet' ? 1e8 : 1e9
  const coin = txb.splitCoins(txb.gas, [txb.pure(price * fraction)])

  // kiosk
  let kiosk_object
  let kioskOwnerCap_object
  // const kioskId = await getWordsKiosk(wallet)

  let kioskId = undefined
  if (kioskId == undefined || words_kiosk_cap_object_id == undefined) {
    const [kiosk, kioskOwnerCap] = txb.moveCall({ target: '0x2::kiosk::new' })
    kiosk_object = kiosk
    kioskOwnerCap_object = kioskOwnerCap
  }
  // else {
  //   kiosk_object = txb.object(kioskId)
  //   console.log('words_kiosk_cap_object_id', words_kiosk_cap_object_id)
  //   kioskOwnerCap_object = txb.object(words_kiosk_cap_object_id)
  // }
  console.log('kioskId', kioskId)
  console.log('kiosk_object', kiosk_object)

  // set up the mint pack call
  txb.moveCall({
    target: target,
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
    console.log('kiosk_object', kiosk_object)
  }
  txb.setGasBudget(7e8)

  const tx_data = txb.serialize()
  return {
    target: target,
    tx_data: tx_data,
  }
}

export const mintSentenceCustodial = async (
  userId,
  basket,
  imageUrl,
  background,
  title,
  author,
) => {
  if (basket.length == 0) return false
  const txb = new TransactionBlock()
  let objects = basket.map(b => txb.object(b.objectId))
  const target = PACKAGE + '::words2words::make_sentence'
  txb.moveCall({
    target: target,
    arguments: [
      txb.makeMoveVec({ objects: objects.reverse() }),
      txb.pure(imageUrl),
      txb.pure(background),
      txb.pure(title),
      txb.pure(author),
      txb.object('0x6'),
    ],
  })
  const tx_data = txb.serialize()
  const contract_data = {
    userId: userId,
    target: target,
    tx_data: tx_data,
  }
  const { status } = await axios.post('/custodial/make-poem', {
    body: {
      contract_data,
    },
  })
  return status === 200
}

export const sentenceToWordsCustodial = async (userId, sentenceId) => {
  const txb = new TransactionBlock()
  const target = PACKAGE + '::words2words::sentence_to_words'
  txb.moveCall({
    target: target,
    arguments: [txb.object(sentenceId)],
  })
  const tx_data = txb.serialize()
  const contract_data = {
    userId: userId,
    target: target,
    tx_data: tx_data,
  }
  const { status } = await axios.post('/custodial/poem-to-words', {
    body: {
      contract_data,
    },
  })
  return status === 200
}
