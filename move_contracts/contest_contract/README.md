# Deployment

* sui client publish --gas-budget {gas_amount}

* sui client publish --gas-budget (gas_amount) --with-unpublished-dependencies --skip-dependency-verification


# Contract functions

## Adding and configuring a new pack

### Pack creation

Function name: **add_special_pack**

Function Args:

Pack creation function has 5 args:

* Pack name
* Pack price
* Pack words background color code
* An array of numbers representing the number of words that should be generated for every part of speech respectivaly 
* An array representing the parts of speech
* Words shared object address

#### Example:

`

    txb.moveCall({
      target: PACKAGE+'::words2words::add_special_pack',
      arguments: [
        txb.pure("Degen Pack"),
        txb.pure(10e9),
        txb.pure("eeeeee"),
        txb.pure([14,5,3,8,9,1]),
        txb.pure(["noun","noun ","noun  ","verb","adjective","interjection"]),
        txb.object(WordsDataObject),
      ],
    });

`


