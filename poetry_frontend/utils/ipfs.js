import axios from 'axios'
const Key = '248aa7fcdc13cc32a68a'
const Secret = '4cefbcb2ea94ca8f14afb5edc3cde5b5659eefa2fdf5d836db61a88501e5dab4'

export const month = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
]

export const pinFileToIPFS = async (dataURL, title) => {
  const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`

  //we gather a local file for this example, but any valid readStream source will work here.
  let data = new FormData()

  var blobBin = atob(dataURL.split(',')[1])
  var array = []
  for (var i = 0; i < blobBin.length; i++) {
    array.push(blobBin.charCodeAt(i))
  }
  var file = new Blob([new Uint8Array(array)], { type: 'image/png' })

  data.append('file', file)

  //You'll need to make sure that the metadata is in the form of a JSON object that's been convered to a string
  //metadata is optional
  const metadata = JSON.stringify({
    name: `${title}-picture`,
    keyvalues: {
      Key: 'Value',
    },
  })
  data.append('pinataMetadata', metadata)

  //pinataOptions are optional
  const pinataOptions = JSON.stringify({
    cidVersion: 0,
  })
  data.append('pinataOptions', pinataOptions)

  return axios
    .post(url, data, {
      maxBodyLength: 'Infinity', //this is needed to prevent axios from erroring out with large files
      headers: {
        'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
        pinata_api_key: Key,
        pinata_secret_api_key: Secret,
      },
    })
    .then(function (response) {
      //handle response here
      return {
        success: true,
        pinataUrl: 'https://gold-minor-bandicoot-543.mypinata.cloud/ipfs/' + response.data.IpfsHash,
      }
    })
    .catch(function (error) {
      //handle error here
      console.log(error)
      return {
        success: false,
        message: error.message,
      }
    })
}

export const pinJSONToIPFS = async ({ image, title, words, backgroundImage, creator }) => {
  const url = `https://api.pinata.cloud/pinning/pinJSONToIPFS`
  var config = {
    method: 'post',
    url: url,
    headers: {
      pinata_api_key: Key,
      pinata_secret_api_key: Secret,
    },
    data: {
      pinataOptions: {
        cidVersion: 1,
      },
      pinataMetadata: {
        name: `${title}-json`,
        keyvalues: {
          Key: 'Value',
        },
      },
      pinataContent: {
        createdAt: new Date().getTime(),
        backgroundImage: backgroundImage,
        image: image,
        words: words,
        title: title,
        creator: creator?.address,
      },
    },
  }

  return axios(config)
    .then(function (response) {
      return {
        success: true,
        pinataUrl: 'https://gold-minor-bandicoot-543.mypinata.cloud/ipfs/' + response.data.IpfsHash,
      }
    })
    .catch(function (error) {
      return {
        success: false,
        message: error.message,
      }
    })
}
