
module words::words2words{
  use sui::object::{Self,UID};
  use std::string::{String,utf8,append};
  use std::vector;
  use sui::tx_context::{Self,TxContext};
  use sui::transfer::{public_transfer,share_object};
  use std::debug::{print};
  use sui::package;
  use sui::display;
  use words::pseudorandom;
  use sui::vec_map::{Self,VecMap};
  use sui::dynamic_field as df;
  use sui::sui::SUI;
  use sui::balance::{Self,Balance};
  use sui::coin;
  use sui::clock::{Self,Clock};

  // Parts of speech are 25 groups containing the words used for poeam construction
  const PARTS_OF_SPEECH : vector<vector<u8>> = vector[b"nouns_3_4_letters",b"nouns_5_6_letters",b"nouns_7_9_letters",b"verbs_action",b"verbs_past_tense_irregular",b"verbs_linking",b"verbs_helping",b"adjectives_3_4_letters",b"adjectives_5_6_letters",b"adjectives_7_8_letters",b"adverbs_2_5_letters",b"adverbs_6_7_letters",b"adverbs_8_9_letters",b"conjunctions_coordinating",b"conjunctions_subordinating",b"pronouns_group_1",b"pronouns_group_2",b"pronouns_group_3",b"prepositions_group_1",b"prepositions_group_2",b"prepositions_group_3",b"interjections",b"suffixes",b"articles",];

  struct WordsData has key, store {
    id : UID,
    funds: Balance<SUI>,
    admin: address
  }

  struct Pack has store{
    parts_of_speech: VecMap<String,u64>,
    name: String,
    price: u64,
  }

  struct Word has key, store {
    id : UID,
    word: String,
    part_of_speech: String
  }

  struct Sentence has key, store {
    id : UID,
    sentence: String,
    sentence_test: String,
    background: String,
    title: String,
    author: String,
    image_url: String,
    created_at: u64,
    words: vector<String>,
    parts_of_speech: vector<String>
  }

  struct WORDS2WORDS has drop {}

  fun init(otw: WORDS2WORDS,ctx: &mut TxContext){
    let publisher = package::claim(otw, ctx);
    let keys = vector[
            utf8(b"name"),
            utf8(b"word"),
            utf8(b"image_url"),
            utf8(b"description"),
    ];
    let values = vector[
            utf8(b"{word}"),
            utf8(b"{word}"),
            utf8(b"https://ui-avatars.com/api/?name={word}&length=20&size=512&font-size=0.1&bold=true&rounded=true"),
            utf8(b"Word NFT"),
    ];
    
    let display = display::new_with_fields<Word>(&publisher, keys, values, ctx);
    display::update_version(&mut display);
    public_transfer(display, tx_context::sender(ctx));

    let keys = vector[
            utf8(b"name"),
            utf8(b"poem"),
            utf8(b"image_url"),
            utf8(b"title"),
            utf8(b"author"),
            utf8(b"background"),
            utf8(b"description"),
    ];
    let values = vector[
            utf8(b"{sentence}"),
            utf8(b"{sentence}"),
            utf8(b"{image_url}"),
            utf8(b"{title}"),
            utf8(b"{author}"),
            utf8(b"{background}"),
            utf8(b"Poem NFT"),
    ];
    let display = display::new_with_fields<Sentence>(&publisher, keys, values, ctx);
    display::update_version(&mut display);
    public_transfer(display, tx_context::sender(ctx));

    public_transfer(publisher, tx_context::sender(ctx));

    let wordsdata = WordsData{
    id: object::new(ctx),
    funds: balance::zero(),
    admin: tx_context::sender(ctx)
    };

    share_object(wordsdata);
  }

  public entry fun make_sentence(words: vector<Word>,image_url: vector<u8>,background: vector<u8>,title: vector<u8>,author: vector<u8>,clock: &Clock,ctx: &mut TxContext){
    let sentence : String = utf8(b"");
    let sentence_test : String = utf8(b"");
    let sentence_words = vector::empty<String>();
    let parts_of_speech = vector::empty<String>();
    //vector::reverse<Word>(&mut words);
    
    while(!vector::is_empty(&words)){
      let Word { id, word, part_of_speech} =  vector::pop_back<Word>(&mut words);
      vector::push_back(&mut sentence_words,word);
      vector::push_back(&mut parts_of_speech,part_of_speech);
      append(&mut sentence,word);  
      append(&mut sentence,utf8(b" "));  

      append(&mut sentence_test,word);  
      append(&mut sentence_test,utf8(b"~"));
      object::delete(id);
    };
    print(&sentence);
    //print(&sentence_test);
    let created_at = clock::timestamp_ms(clock);
    let sender = tx_context::sender(ctx);
    public_transfer(Sentence {id: object::new(ctx), sentence: sentence,sentence_test:sentence_test,background:utf8(background),title:utf8(title),author:utf8(author),image_url:utf8(image_url),created_at:created_at, words: sentence_words,parts_of_speech: parts_of_speech},sender);
    vector::destroy_empty(words);
  }

  public entry fun sentence_to_words(sentence: Sentence,ctx: &mut TxContext) {
    let sender = tx_context::sender(ctx);
    let Sentence {id, sentence: _,sentence_test: _,background:_,title:_,author:_,image_url:_,created_at:_, words,parts_of_speech} = sentence;
    while(!vector::is_empty<String>(&words)){
      let part_of_speech = vector::pop_back<String>(&mut parts_of_speech);
      let word = vector::pop_back<String>(&mut words);
      public_transfer(Word {id: object::new(ctx), word: word, part_of_speech: part_of_speech},sender);
    };
    object::delete(id);
  }

  public entry fun mintPack(pack_name: vector<u8>,wordsdata: &WordsData,ctx: &mut TxContext){
    let sender = tx_context::sender(ctx);
    internal_mint_pack_and_transfer_words(sender,pack_name,wordsdata,ctx);
  }

  // Admin functionalities
  public entry fun fiat_payment_mintPack(mintTo: address,pack_name: vector<u8>,wordsdata: &WordsData,ctx: &mut TxContext){
    assert!( wordsdata.admin == tx_context::sender(ctx),0);
    internal_mint_pack_and_transfer_words(mintTo,pack_name,wordsdata,ctx);
  }

  public entry fun add_pack(pack_name: vector<u8>,price: u64, pack_pos_quantity: vector<u64>,wordsdata: &mut WordsData){
    let parts_of_speech = vec_map::empty();
    let i = 0;
    while(i < vector::length(&PARTS_OF_SPEECH)){
      let part_of_speech = vector::borrow(&PARTS_OF_SPEECH,i);
      let part_of_speech_quantity = vector::borrow(&pack_pos_quantity,i);
      vec_map::insert(&mut parts_of_speech,utf8(*part_of_speech),*part_of_speech_quantity);
      //print(&utf8(*part_of_speech));
      i = i + 1;
    };
    df::add(&mut wordsdata.id,utf8(pack_name),Pack{ parts_of_speech: parts_of_speech, name:utf8(pack_name),price: price });
  }

  public entry fun add_part_of_speech_words(part_of_speech: vector<u8>,wordsdata: &mut WordsData, words: vector<vector<u8>>){
    let strings_vector : vector<String> = vector::empty();
    while (!vector::is_empty(&words)){
          vector::push_back(&mut strings_vector,utf8(vector::pop_back(&mut words)));
    };
    df::add(&mut wordsdata.id,utf8(part_of_speech),strings_vector);
  }

  public entry fun release_funds(wordsdata: &mut WordsData,ctx: &mut TxContext){
    assert!(wordsdata.admin == tx_context::sender(ctx),0);
    let total = balance::value<SUI>(&wordsdata.funds);
    let take = coin::take<SUI>(&mut wordsdata.funds,total,ctx);
    public_transfer(take,wordsdata.admin);
  }

  public entry fun  mutate_admin(new_admin: address,wordsdata: &mut WordsData,ctx: &mut TxContext){
      assert!(wordsdata.admin == tx_context::sender(ctx) || @0x0 == tx_context::sender(ctx) ,0);
      wordsdata.admin = new_admin;
  }

  // Internal functionalities
  fun internal_mint_and_transfer_word(mintTo: address,word: String,part_of_speech: String,ctx: &mut TxContext){
    public_transfer(Word {id: object::new(ctx), word: word, part_of_speech: part_of_speech},mintTo);
  }

  fun internal_mint_pack_and_transfer_words(mintTo: address,pack_name: vector<u8>,wordsdata: &WordsData,ctx: &mut TxContext){
    let pack_config = df::borrow<String,Pack>(&wordsdata.id,utf8(pack_name));
    let i = 0;
    while(i < vector::length(&PARTS_OF_SPEECH)){
      let part_of_speech = *vector::borrow(&PARTS_OF_SPEECH,i);
      let part_of_speech_count = vec_map::get(&pack_config.parts_of_speech,&utf8(part_of_speech));

      if(df::exists_<String>(&wordsdata.id,utf8(part_of_speech))){

      let part_of_speech_words = *df::borrow<String,vector<String>>(&wordsdata.id,utf8(part_of_speech)); 
      let j = 0;
      while(j < *part_of_speech_count){
           let length = vector::length<String>(&part_of_speech_words);
           let index = random_index(length,ctx);
           let word = *vector::borrow<String>(&part_of_speech_words,index);
           print(&word);
           internal_mint_and_transfer_word(mintTo,word,utf8(part_of_speech),ctx);
           vector::remove<String>(&mut part_of_speech_words,index);
           j = j +1;
       };

      };
      i = i + 1;
    };
  }

  fun random_index(length: u64,ctx: &mut TxContext): u64{
     let rand_idx = pseudorandom::select_u64(
                length, &pseudorandom::rand_with_ctx(ctx),
            );
     rand_idx
  }

  #[test_only]
  public fun init_test(ctx: &mut TxContext){
   init(WORDS2WORDS{},ctx);
  }

}

#[test_only]
  module sui::words_test {
    use sui::test_scenario as ts;
    use sui::clock;
    // use std::vector;
    //use std::debug::{print};
    use words::words2words::{Self,make_sentence,sentence_to_words,Word,Sentence,WordsData};
    #[test]
    fun mint_words() {
        let addr1 = @0xA;
        //let addr2 = @0xB;
        //let addr3 = @0xC;
        let scenario = ts::begin(addr1);
        {
            words2words::init_test(ts::ctx(&mut scenario)); 
        };

        ts::next_tx(&mut scenario, addr1);
        {
           let wordsdata = ts::take_shared<WordsData>(&mut scenario);
           words2words::add_part_of_speech_words(b"nouns_3_4_letters",&mut wordsdata, vector[b"air",b"ant",b"arm",b"art",b"bag",b"bar",b"bed",b"box",b"boy",b"bus",b"car",b"cat",b"dad",b"day",b"dog",b"ear",b"egg",b"fan",b"fee",b"fix",b"fly",b"gas",b"guy",b"hat",b"hen",b"hit",b"ice",b"jam",b"job",b"key",b"kid",b"kit",b"lab",b"law",b"leg",b"lip",b"log",b"low",b"man",b"map",b"oil",b"one",b"pan",b"pet",b"pin",b"raw",b"red",b"sea",b"sex",b"sin",b"sky",b"sun",b"tap",b"tax",b"tea",b"ten",b"tie",b"tip",b"toe",b"top",b"toy",b"try",b"tug",b"use",b"war",b"way",b"web",b"win",b"zoo",b"area",b"baby",b"back",b"ball",b"band",b"bank",b"base",b"beer",b"bike",b"bird",b"boat",b"body",b"book",b"bulb",b"cake",b"card",b"care",b"case",b"cave",b"cell",b"chin",b"city",b"club",b"coat",b"code",b"coin",b"cold",b"cook",b"copy",b"cork",b"data",b"date",b"debt",b"deep",b"deer",b"desk",b"diet",b"dirt",b"dish",b"disk",b"door",b"draw",b"drop",b"drug",b"drum",b"duck",b"ease",b"east",b"edge",b"exam",b"exit",b"face",b"fact",b"farm",b"fear",b"feed",b"feel",b"file",b"film",b"fire",b"fish",b"flag",b"fold",b"food",b"foot",b"form",b"fuel",b"gain",b"game",b"gate",b"gear",b"gene",b"gift",b"girl",b"goal",b"gold",b"golf",b"gray",b"hair",b"half",b"hall",b"hand",b"harm",b"hate",b"head",b"heat",b"hell",b"help",b"herb",b"hero",b"hide",b"high",b"hill",b"hold",b"hole",b"home",b"hope",b"host",b"hour",b"idea",b"iron",b"item",b"jail",b"join",b"joke",b"kick",b"kind",b"king",b"kiss",b"knee",b"lack",b"lady",b"lake",b"land",b"lead",b"leaf",b"life",b"lift",b"line",b"link",b"list",b"load",b"loan",b"lock",b"long",b"look",b"loss",b"love",b"luck",b"lung",b"mail",b"main",b"make",b"male",b"mall",b"mark",b"math",b"meal",b"meat",b"moon",b"name",b"navy",b"neck",b"need",b"nest",b"news",b"none",b"nose",b"note",b"oven",b"pace",b"pack",b"page",b"pain",b"pair",b"park",b"part",b"past",b"path",b"peak",b"pile",b"plan",b"quit",b"race",b"rail",b"rain",b"rate",b"read",b"rent",b"rest",b"rice",b"rich",b"ride",b"ring",b"risk",b"road",b"rock",b"role",b"room",b"rope",b"sale",b"salt",b"sand",b"seat",b"self",b"sell",b"ship",b"shoe",b"shop",b"shot",b"show",b"side",b"sign",b"sink",b"site",b"size",b"skin",b"slip",b"slow",b"snow",b"soil",b"soup",b"star",b"tail",b"take",b"talk",b"tank",b"task",b"taxi",b"team",b"tear",b"teen",b"tent",b"term",b"test",b"text",b"tide",b"time",b"tire",b"tone",b"tool",b"town",b"trap",b"tree",b"trip",b"tune",b"turn",b"unit",b"user",b"view",b"vote",b"wage",b"wait",b"wake",b"walk",b"wall",b"wash",b"wave",b"wear",b"week",b"west",b"wife",b"will",b"wind",b"wine",b"wing",b"wire",b"wish",b"wood",b"word",b"work",b"wrap",b"yard",b"year",b"zeal",b"zone",b"zoom"]);
           words2words::add_part_of_speech_words(b"nouns_5_6_letters",&mut wordsdata, vector[b"adage",b"apple",b"beach",b"blood",b"brain",b"brass",b"bread",b"break",b"brick",b"cause",b"chair",b"chalk",b"check",b"child",b"class",b"clerk",b"clock",b"cloud",b"coach",b"coast",b"color",b"dance",b"death",b"delay",b"depth",b"doubt",b"drama",b"dream",b"dress",b"drink",b"drive",b"earth",b"error",b"essay",b"event",b"fable",b"field",b"fight",b"final",b"flame",b"flood",b"floor",b"fluid",b"focus",b"force",b"frame",b"front",b"fruit",b"glass",b"glove",b"grade",b"grass",b"great",b"green",b"group",b"guard",b"guess",b"guest",b"guide",b"habit",b"heart",b"honey",b"honor",b"horse",b"hotel",b"house",b"human",b"humor",b"image",b"index",b"irony",b"issue",b"jewel",b"joint",b"judge",b"juice",b"knife",b"label",b"laugh",b"layer",b"leave",b"level",b"light",b"limit",b"local",b"logic",b"lunch",b"major",b"match",b"maxim",b"media",b"money",b"movie",b"music",b"nerve",b"night",b"noise",b"north",b"novel",b"nurse",b"ocean",b"order",b"owner",b"panel",b"paper",b"party",b"peace",b"phase",b"phone",b"photo",b"piano",b"piece",b"place",b"plane",b"plant",b"plate",b"queen",b"quiet",b"quote",b"radio",b"range",b"ratio",b"reach",b"right",b"river",b"rough",b"round",b"scale",b"scene",b"score",b"sense",b"shade",b"shake",b"shame",b"shape",b"share",b"sheep",b"sheet",b"shelf",b"shirt",b"shock",b"shoot",b"shore",b"short",b"sight",b"skill",b"skirt",b"sleep",b"slice",b"slide",b"slope",b"small",b"smell",b"smile",b"smoke",b"snail",b"table",b"taste",b"theme",b"thing",b"thumb",b"tiger",b"title",b"toast",b"today",b"tooth",b"topic",b"total",b"touch",b"towel",b"tower",b"track",b"trade",b"trail",b"train",b"trash",b"trend",b"trial",b"tribe",b"trick",b"truck",b"trust",b"truth",b"uncle",b"union",b"upper",b"value",b"video",b"visit",b"voice",b"waste",b"watch",b"water",b"wheel",b"white",b"whole",b"woman",b"world",b"worry",b"worth",b"wound",b"yield",b"youth",b"zebra",b"action",b"advice",b"animal",b"answer",b"basket",b"belief",b"bottle",b"branch",b"breast",b"breath",b"bridge",b"button",b"camera",b"carpet",b"center",b"chance",b"change",b"charge",b"cheese",b"choice",b"church",b"cliche",b"coffee",b"damage",b"danger",b"debate",b"degree",b"demand",b"design",b"desire",b"detail",b"device",b"dinner",b"divide",b"doctor",b"driver",b"effect",b"effort",b"energy",b"engine",b"enigma",b"escape",b"estate",b"expert",b"fabric",b"factor",b"family",b"farmer",b"father",b"female",b"figure",b"finger",b"flavor",b"flight",b"flower",b"formal",b"format",b"friend",b"future",b"garden",b"genius",b"ground",b"growth",b"guitar",b"hammer",b"handle",b"health",b"height",b"impact",b"income",b"injury",b"insect",b"inside",b"island",b"jacket",b"kitten",b"lawyer",b"leader",b"league",b"length",b"lesson",b"letter",b"listen",b"manner",b"margin",b"market",b"master",b"matter",b"memory",b"mitten",b"mother",b"nation",b"nature",b"notice",b"notion",b"number",b"object",b"office",b"option",b"orange",b"origin",b"palace",b"parent",b"people",b"period",b"person",b"phrase",b"pizzas",b"planet",b"player",b"police",b"potato",b"rabbit",b"reader",b"reason",b"recall",b"recipe",b"record",b"reform",b"region",b"regret",b"relief",b"remark",b"repair",b"repeat",b"report",b"result",b"resume",b"retail",b"return",b"reveal",b"review",b"reward",b"rhythm",b"safety",b"sample",b"satire",b"scheme",b"school",b"screen",b"script",b"search",b"season",b"second",b"secret",b"sector",b"senate",b"senior",b"series",b"shadow",b"shower",b"signal",b"silver",b"simile",b"simple",b"singer",b"single",b"sister",b"sports",b"tactic",b"target",b"terror",b"thanks",b"theory",b"threat",b"throat",b"ticket",b"tongue",b"trains",b"travel",b"trophy",b"turkey",b"valley",b"vendor",b"vision",b"volume",b"wealth",b"weapon",b"weight",b"window",b"winner",b"winter",b"wisdom",b"wonder",b"worker",b"writer",b"yellow"]);
           words2words::add_part_of_speech_words(b"nouns_7_9_letters",&mut wordsdata, vector[b"airport",b"alcohol",b"brother",b"channel",b"chapter",b"clothes",b"college",b"comfort",b"company",b"control",b"country",b"dilemma",b"disease",b"element",b"emotion",b"epigram",b"evening",b"example",b"factory",b"failure",b"fashion",b"feature",b"finance",b"fitness",b"formula",b"fortune",b"freedom",b"funeral",b"general",b"gesture",b"gravity",b"grocery",b"highway",b"history",b"holiday",b"horizon",b"husband",b"kitchen",b"leather",b"lecture",b"library",b"license",b"lizards",b"machine",b"manager",b"maximum",b"meaning",b"network",b"nothing",b"officer",b"opening",b"opinion",b"outcome",b"outside",b"package",b"parable",b"paradox",b"parking",b"partner",b"passion",b"patient",b"pattern",b"payment",b"penalty",b"physics",b"picture",b"plastic",b"problem",b"product",b"proverb",b"quality",b"quarter",b"reading",b"reality",b"receipt",b"regular",b"release",b"request",b"respect",b"revenue",b"savings",b"science",b"scratch",b"section",b"service",b"session",b"setting",b"silence",b"society",b"stomach",b"student",b"teacher",b"tension",b"terrain",b"texture",b"theater",b"therapy",b"thought",b"tonight",b"tourist",b"traffic",b"tragedy",b"trouble",b"variety",b"vehicle",b"venture",b"version",b"village",b"visitor",b"warning",b"weather",b"wedding",b"witness",b"writing",b"accident",b"activity",b"allegory",b"anecdote",b"aphorism",b"baseball",b"bathroom",b"birthday",b"building",b"business",b"computer",b"customer",b"daughter",b"decision",b"disaster",b"distance",b"district",b"document",b"election",b"electric",b"elevator",b"emphasis",b"employee",b"employer",b"engineer",b"entrance",b"estimate",b"euphoria",b"evidence",b"exchange",b"exercise",b"feedback",b"festival",b"function",b"guidance",b"hardware",b"hospital",b"identity",b"incident",b"increase",b"industry",b"instance",b"interest",b"internet",b"interval",b"invasion",b"judgment",b"language",b"learning",b"location",b"magazine",b"majority",b"marriage",b"material",b"medicine",b"metaphor",b"occasion",b"official",b"painting",b"paradigm",b"physical",b"platform",b"pleasure",b"quandary",b"quantity",b"question",b"reaction",b"recovery",b"register",b"relation",b"religion",b"reminder",b"research",b"resident",b"resource",b"schedule",b"security",b"sentence",b"sequence",b"shopping",b"shoulder",b"software",b"solution",b"teaching",b"training",b"transfer",b"universe",b"vacation",b"violence",b"wardrobe",b"weakness",b"archetype",b"beginning",b"breakfast",b"catharsis",b"character",b"committee",b"condition",b"conundrum",b"democracy",b"dichotomy",b"dimension",b"direction",b"discovery",b"education",b"emergency",b"equipment",b"evolution",b"frequency",b"guarantee",b"highlight",b"hyperbole",b"infection",b"inflation",b"influence",b"inspector",b"insurance",b"intention",b"interview",b"knowledge",b"landscape",b"liability",b"passenger",b"platitude",b"prototype",b"radiation",b"rebellion",b"reception",b"recording",b"reduction",b"reference",b"relevance",b"remainder",b"secretary",b"selection",b"signature",b"situation",b"technique",b"telephone",b"temporary",b"tradition",b"variation",b"vegetable",b"yesterday"]);

           words2words::add_part_of_speech_words(b"verbs_action",&mut wordsdata, vector[b"abandon",b"act",b"adapt",b"add",b"adventure",b"advise",b"answer",b"arrange",b"assist",b"attain",b"bake",b"believe",b"bike",b"blast",b"boil",b"bump",b"buy",b"camp",b"catch",b"challenge",b"change",b"classify",b"clean",b"coach",b"collide",b"comfort",b"contribute",b"cook",b"count",b"create",b"creep",b"cry",b"dance",b"decorate",b"design",b"detect",b"develop",b"devise",b"dig",b"discover",b"do",b"doubt",b"drain",b"draw",b"dream",b"dress",b"eat",b"edit",b"elevate",b"encourage",b"enter",b"evade",b"execute",b"exercise",b"exit",b"explore",b"fade",b"fear",b"feel",b"fish",b"fix",b"flap",b"fling",b"flush",b"fry",b"gain",b"grab",b"grill",b"grow",b"guide",b"hate",b"help",b"hike",b"hoist",b"hope",b"hunt",b"imagine",b"imitate",b"improve",b"inject",b"innovate",b"inspire",b"invent",b"invest",b"jam",b"jingle",b"kick",b"laugh",b"leap",b"learn",b"lift",b"listen",b"love",b"make",b"manage",b"market",b"meditate",b"mentor",b"mimic",b"motivate",b"move",b"nick",b"offer",b"order",b"organize",b"paddle",b"paint",b"park",b"pass",b"perform",b"plan",b"play",b"prepare",b"print",b"promote",b"provide",b"publish",b"question",b"quit",b"rattle",b"read",b"receive",b"recoup",b"reduce",b"relate",b"relax",b"repair",b"respond",b"reveal",b"ride",b"roast",b"run",b"saute",b"save",b"scale",b"scoop",b"scoot",b"scrub",b"sculpt",b"seize",b"sell",b"serve",b"shake",b"shift",b"sigh",b"sing",b"sketch",b"slash",b"smile",b"snoop",b"spend",b"steam",b"stick",b"stretch",b"strike",b"support",b"sway",b"swim",b"talk",b"target",b"teach",b"think",b"tie",b"trap",b"travel",b"trust",b"twist",b"understand",b"unwind",b"vault",b"volunteer",b"walk",b"watch",b"wedge",b"wiggle",b"write",b"yell",b"zap"]);
           words2words::add_part_of_speech_words(b"verbs_past_tense_irregular",&mut wordsdata, vector[b"ate",b"began",b"bought",b"broke",b"brought",b"built",b"came",b"caught",b"chose",b"cried",b"did",b"drank",b"drew",b"drove",b"dug",b"fell",b"felt",b"flew",b"flung",b"forgot",b"found",b"fried",b"gave",b"got",b"grew",b"had",b"heard",b"held",b"hid",b"hit",b"kept",b"knew",b"leapt",b"left",b"lost",b"made",b"meant",b"met",b"paid",b"put",b"ran",b"rang",b"rode",b"rose",b"said",b"sang",b"sat",b"saw",b"sent",b"slept",b"sold",b"spoke",b"swam",b"taught",b"understood",b"went",b"wrote"]);
           words2words::add_part_of_speech_words(b"verbs_linking",&mut wordsdata, vector[b"am",b"appear",b"are",b"be",b"feel",b"grow",b"is",b"look",b"prove",b"remain",b"smell",b"sound",b"taste",b"turn",b"was",b"were"]);
           words2words::add_part_of_speech_words(b"verbs_helping",&mut wordsdata, vector[b"have",b"has",b"does",b"shall",b"will",b"should",b"would",b"may",b"might",b"must",b"can",b"could"]);

           words2words::add_part_of_speech_words(b"adjectives_3_4_letters",&mut wordsdata, vector[b"bad",b"big",b"dry",b"far",b"fat",b"few",b"hot",b"icy",b"ill",b"low",b"new",b"odd",b"old",b"raw",b"red",b"sad",b"shy",b"tan",b"wet",b"able",b"aged",b"back",b"bare",b"best",b"blue",b"bold",b"bony",b"busy",b"calm",b"cold",b"cool",b"cozy",b"cute",b"damp",b"dark",b"dead",b"dear",b"deep",b"down",b"dull",b"easy",b"fair",b"fake",b"fast",b"fine",b"firm",b"flat",b"free",b"full",b"glad",b"good",b"half",b"hard",b"high",b"holy",b"huge",b"hurt",b"idle",b"keen",b"kind",b"last",b"late",b"lazy",b"lean",b"left",b"less",b"long",b"loud",b"male",b"many",b"mean",b"meek",b"mild",b"more",b"most",b"near",b"neat",b"next",b"nice",b"nosy",b"numb",b"open",b"oval",b"pale",b"past",b"pink",b"poor",b"pure",b"rare",b"real",b"rich",b"ripe",b"rude",b"safe",b"same",b"sick",b"slim",b"slow",b"soft",b"sore",b"sour",b"tall",b"tame",b"tart",b"taut",b"thin",b"tidy",b"tiny",b"trim",b"ugly",b"used",b"vast",b"warm",b"wary",b"wavy",b"weak",b"well",b"wide",b"wild",b"wise",b"worn",b"zany"]);
           words2words::add_part_of_speech_words(b"adjectives_5_6_letters",&mut wordsdata, vector[b"alert",b"alike",b"alive",b"ample",b"angry",b"awful",b"basic",b"black",b"bland",b"blank",b"brave",b"brief",b"broad",b"brown",b"cheap",b"clean",b"clear",b"close",b"crazy",b"cruel",b"daily",b"dense",b"dirty",b"dizzy",b"dusty",b"eager",b"early",b"empty",b"equal",b"extra",b"fancy",b"first",b"fresh",b"funny",b"giant",b"great",b"hairy",b"happy",b"harsh",b"hasty",b"heavy",b"human",b"ideal",b"jolly",b"juicy",b"large",b"legal",b"level",b"light",b"loose",b"loyal",b"lucky",b"major",b"merry",b"messy",b"minor",b"mixed",b"moist",b"moral",b"muddy",b"noble",b"noisy",b"north",b"novel",b"obese",b"other",b"petty",b"plain",b"plump",b"prime",b"proud",b"quick",b"quiet",b"rainy",b"rapid",b"raspy",b"ready",b"rigid",b"risky",b"round",b"royal",b"runny",b"rusty",b"salty",b"scary",b"sharp",b"shiny",b"short",b"silky",b"silly",b"small",b"smart",b"solid",b"sorry",b"spare",b"spicy",b"stale",b"steep",b"stiff",b"still",b"swift",b"tasty",b"tense",b"tepid",b"thick",b"tight",b"tired",b"tough",b"toxic",b"unfit",b"upper",b"upset",b"urban",b"utter",b"vague",b"valid",b"vital",b"vivid",b"vocal",b"weary",b"weird",b"white",b"whole",b"windy",b"witty",b"worst",b"wrong",b"young",b"zesty",b"absent",b"active",b"actual",b"afraid",b"annual",b"better",b"bitter",b"boring",b"bright",b"broken",b"casual",b"chilly",b"clever",b"closed",b"cloudy",b"clumsy",b"common",b"costly",b"creepy",b"double",b"famous",b"fierce",b"fluffy",b"formal",b"future",b"gentle",b"glossy",b"hidden",b"hollow",b"honest",b"humble",b"hungry",b"insane",b"joyful",b"junior",b"latter",b"likely",b"linear",b"liquid",b"little",b"lively",b"lonely",b"lovely",b"manual",b"mature",b"mellow",b"mental",b"middle",b"minute",b"modern",b"modest",b"narrow",b"normal",b"orange",b"ornate",b"polite",b"pretty",b"proper",b"public",b"purple",b"quaint",b"quirky",b"recent",b"remote",b"scarce",b"secret",b"secure",b"sedate",b"silent",b"silver",b"simple",b"single",b"skinny",b"sleepy",b"smooth",b"sneaky",b"sparse",b"speedy",b"spooky",b"square",b"stable",b"steady",b"sticky",b"stormy",b"tender",b"tested",b"tricky",b"unable",b"uneven",b"unique",b"united",b"unripe",b"unruly",b"untidy",b"upbeat",b"urgent",b"useful",b"vacant",b"varied",b"verbal",b"violet",b"watery",b"wooden",b"woolen",b"worthy",b"yellow",b"zigzag"]);
           words2words::add_part_of_speech_words(b"adjectives_7_8_letters",&mut wordsdata, vector[b"ancient",b"annoyed",b"anxious",b"ashamed",b"average",b"capable",b"careful",b"complex",b"content",b"correct",b"curious",b"distant",b"diverse",b"elderly",b"elegant",b"excited",b"fearful",b"foolish",b"fragile",b"furious",b"general",b"healthy",b"helpful",b"illegal",b"immense",b"intense",b"jealous",b"lengthy",b"limited",b"logical",b"massive",b"minimal",b"mundane",b"natural",b"naughty",b"nervous",b"nightly",b"nonstop",b"obscure",b"offbeat",b"opulent",b"orderly",b"organic",b"painful",b"panicky",b"parched",b"partial",b"patient",b"perfect",b"plastic",b"playful",b"popular",b"present",b"primary",b"private",b"pungent",b"puzzled",b"radiant",b"regular",b"scrawny",b"selfish",b"serious",b"shallow",b"sincere",b"special",b"tedious",b"teeming",b"thirsty",b"trivial",b"typical",b"unhappy",b"uniform",b"unkempt",b"unknown",b"unlined",b"unlucky",b"unusual",b"upright",b"useless",b"vibrant",b"vicious",b"violent",b"visible",b"wealthy",b"weighty",b"welcome",b"willing",b"worried",b"zealous",b"abundant",b"accurate",b"adorable",b"animated",b"apparent",b"artistic",b"blissful",b"cautious",b"charming",b"cheerful",b"colorful",b"colossal",b"complete",b"confused",b"constant",b"creative",b"critical",b"diligent",b"distinct",b"dramatic",b"economic",b"enormous",b"faithful",b"familiar",b"flexible",b"frequent",b"friendly",b"gorgeous",b"handsome",b"helpless",b"ignorant",b"impolite",b"improved",b"indirect",b"infinite",b"informal",b"innocent",b"insecure",b"internal",b"intimate",b"involved",b"likeable",b"magnetic",b"menacing",b"metallic",b"multiple",b"negative",b"numerous",b"obedient",b"obsolete",b"official",b"ordinary",b"original",b"outgoing",b"parallel",b"peaceful",b"peculiar",b"periodic",b"personal",b"physical",b"pleasant",b"positive",b"possible",b"powerful",b"precious",b"previous",b"probable",b"profound",b"reliable",b"relieved",b"restless",b"separate",b"slippery",b"spacious",b"specific",b"splendid",b"standard",b"talented",b"tangible",b"tattered",b"terrible",b"terrific",b"thankful",b"timeless",b"tranquil",b"troubled",b"truthful",b"ultimate",b"uncommon",b"ungainly",b"unlawful",b"valuable",b"vengeful",b"venomous",b"vertical",b"vigilant",b"vigorous",b"virtuous",b"volatile",b"wasteful",b"wrathful",b"yielding",b"youthful"]);
           
           words2words::add_part_of_speech_words(b"adverbs_2_5_letters",&mut wordsdata, vector[b"so",b"far",b"now",b"too",b"yet",b"away",b"down",b"ever",b"fast",b"home",b"just",b"less",b"long",b"next",b"only",b"soon",b"then",b"thus",b"very",b"well",b"about",b"above",b"apart",b"aside",b"badly",b"below",b"daily",b"dimly",b"early",b"fully",b"hence",b"later",b"madly",b"never",b"north",b"oddly",b"often",b"quite",b"sadly",b"shyly",b"since",b"still",b"there",b"today",b"truly"]);
           words2words::add_part_of_speech_words(b"adverbs_6_7_letters",&mut wordsdata, vector[b"aboard",b"abroad",b"acidly",b"almost",b"always",b"around",b"barely",b"before",b"behind",b"beside",b"better",b"boldly",b"busily",b"calmly",b"coolly",b"deeply",b"easily",b"fairly",b"flatly",b"fondly",b"gently",b"gladly",b"hardly",b"highly",b"hourly",b"indeed",b"inside",b"justly",b"keenly",b"kindly",b"lately",b"likely",b"loudly",b"mainly",b"merely",b"mildly",b"mostly",b"nearly",b"nicely",b"openly",b"please",b"poorly",b"rarely",b"really",b"rudely",b"safely",b"seldom",b"simply",b"slowly",b"softly",b"solely",b"upbeat",b"upward",b"vastly",b"verily",b"warmly",b"weakly",b"weekly",b"wildly",b"within",b"yearly",b"already",b"angrily",b"bleakly",b"blindly",b"bravely",b"briefly",b"briskly",b"broadly",b"clearly",b"closely",b"eagerly",b"equally",b"exactly",b"finally",b"firstly",b"frankly",b"greatly",b"hastily",b"heavily",b"however",b"locally",b"loftily",b"monthly",b"nastily",b"needily",b"neither",b"nightly",b"noisily",b"notably",b"nowhere",b"plainly",b"proudly",b"quickly",b"quietly",b"readily",b"rigidly",b"roughly",b"sharply",b"shortly",b"solidly",b"steeply",b"sternly",b"sweetly",b"swiftly",b"tensely",b"tightly",b"totally",b"usually",b"utterly",b"vaguely",b"validly",b"visibly",b"wearily",b"without",b"wrongly",b"zestily"]);
           words2words::add_part_of_speech_words(b"adverbs_8_9_letters",&mut wordsdata, vector[b"abruptly",b"actively",b"actually",b"annually",b"bitterly",b"brightly",b"cleverly",b"commonly",b"daringly",b"directly",b"dreamily",b"entirely",b"heartily",b"honestly",b"hungrily",b"intently",b"jokingly",b"joyfully",b"joyously",b"lovingly",b"mightily",b"moreover",b"narrowly",b"normally",b"politely",b"probably",b"promptly",b"properly",b"quirkily",b"randomly",b"recently",b"scarcely",b"secretly",b"severely",b"silently",b"slightly",b"smoothly",b"somewhat",b"speedily",b"squarely",b"steadily",b"stingily",b"straight",b"strictly",b"strongly",b"suddenly",b"tenderly",b"together",b"tomorrow",b"unfairly",b"uniquely",b"unjustly",b"unkindly",b"unwisely",b"urgently",b"usefully",b"vacantly",b"valuably",b"verbally",b"visually",b"westward",b"woefully",b"worthily",b"adamantly",b"amazingly",b"anxiously",b"assuredly",b"awkwardly",b"carefully",b"certainly",b"correctly",b"curiously",b"defiantly",b"elsewhere",b"excitedly",b"extremely",b"fearfully",b"fervently",b"furiously",b"generally",b"genuinely",b"helpfully",b"hopefully",b"intensely",b"invisibly",b"irritably",b"knowingly",b"literally",b"meanwhile",b"naturally",b"otherwise",b"outwardly",b"painfully",b"partially",b"patiently",b"playfully",b"precisely",b"presently",b"primarily",b"purposely",b"regularly",b"restfully",b"routinely",b"seemingly",b"selfishly",b"seriously",b"similarly",b"sincerely",b"sometimes",b"strangely",b"tactfully",b"typically",b"unhappily",b"uniformly",b"unluckily",b"unusually",b"uselessly",b"valiantly",b"variously",b"vibrantly",b"viciously",b"violently",b"virtually",b"willingly",b"wistfully",b"worriedly",b"yesterday",b"zealously",b"zestfully"]);

           words2words::add_part_of_speech_words(b"conjunctions_coordinating",&mut wordsdata, vector[b"for",b"and",b"nor",b"but",b"or",b"yet",b"so"]);
           words2words::add_part_of_speech_words(b"conjunctions_subordinating",&mut wordsdata, vector[b"after",b"although",b"as",b"as if",b"as long as",b"as much as",b"as soon as",b"as though",b"because",b"before",b"even if",b"even though",b"if",b"in case",b"lest",b"once",b"only if",b"provided that",b"since",b"so that",b"though",b"unless",b"until",b"when",b"whenever",b"where",b"wherever",b"while"]);

           words2words::add_part_of_speech_words(b"pronouns_group_1",&mut wordsdata, vector[b"anyone",b"he",b"hers",b"him",b"his",b"I",b"it",b"its",b"me",b"mine",b"ours",b"she",b"theirs",b"they",b"this",b"those",b"us",b"we",b"what",b"who",b"you"]);
           words2words::add_part_of_speech_words(b"pronouns_group_2",&mut wordsdata, vector[b"all",b"any",b"both",b"each",b"either",b"everyone",b"few",b"little",b"many",b"more",b"most",b"much",b"no one",b"nobody",b"none",b"nothing",b"some",b"someone",b"that",b"them",b"these",b"which",b"whom",b"whose",b"yours"]);
           words2words::add_part_of_speech_words(b"pronouns_group_3",&mut wordsdata, vector[b"another",b"anybody",b"anything",b"each other",b"everybody",b"everything",b"herself",b"himself",b"itself",b"myself",b"no one",b"one another",b"ourselves",b"several",b"somebody",b"something",b"themselves",b"whatever",b"whichever",b"whoever",b"whomever",b"yours",b"yourself"]);

           words2words::add_part_of_speech_words(b"prepositions_group_1",&mut wordsdata, vector[b"above",b"across",b"among",b"around",b"as",b"at",b"behind",b"below",b"by",b"for",b"in",b"inside",b"into",b"of",b"off",b"on",b"out",b"over",b"to",b"toward",b"under",b"up",b"upon",b"with",b"like"]);
           words2words::add_part_of_speech_words(b"prepositions_group_2",&mut wordsdata, vector[b"about",b"after",b"against",b"along",b"before",b"beneath",b"beside",b"between",b"beyond",b"but",b"down",b"during",b"except",b"from",b"near",b"outside",b"past",b"since",b"through",b"throughout",b"underneath",b"until",b"unto",b"within",b"without"]);
           words2words::add_part_of_speech_words(b"prepositions_group_3",&mut wordsdata, vector[b"according to",b"in addition to",b"next to",b"along with",b"apart from",b"aside from",b"as of",b"because of",b"by means of",b"in front of",b"in place of",b"in spite of",b"instead of",b"on account of",b"out of"]);

           words2words::add_part_of_speech_words(b"interjections",&mut wordsdata, vector[b"aha",b"ahem",b"ahhh",b"ahoy",b"alas",b"aw",b"bam",b"blah",b"boo",b"bravo",b"brrr",b"congrats",b"darn",b"drat",b"duh",b"eeek",b"eh",b"eureka",b"fiddlesticks",b"gee",b"golly",b"goodbye",b"gosh",b"ha-ha",b"hello",b"hey",b"hmm",b"holy cow",b"humph",b"hooray",b"oh",b"oops",b"ouch",b"phew",b"phooey",b"shh",b"shoo",b"there",b"ugh",b"uh-oh",b"wahoo",b"whoa",b"whoops",b"wow",b"yeah",b"yes",b"yikes",b"yippee",b"yo",b"yuck"]);
           
           words2words::add_part_of_speech_words(b"suffixes",&mut wordsdata, vector[b"ed",b"es",b"s",b"ly",b"ing",b"er",b"est",b"y",b"d"]);
           words2words::add_part_of_speech_words(b"articles",&mut wordsdata, vector[b"the",b"a",b"an",b"the",b"a",b"an"]);
           
           words2words::add_pack(b"BASIC",1_000_000_000,vector[1,2,1,3,1,1,1,2,3,2,1,2,1,1,0,1,1,0,1,1,0,1,3,3],&mut wordsdata);
           words2words::add_pack(b"BLACK TURTLENECK",2_000_000_000,vector[3,4,2,5,2,2,2,4,5,5,2,3,2,2,2,3,2,1,2,1,1,2,5,4],&mut wordsdata);
           words2words::add_pack(b"OPEN MIC NIGHT",3_000_000_000,vector[5,6,3,6,3,3,3,6,7,6,3,5,4,4,3,5,3,2,3,2,1,3,7,6],&mut wordsdata);

           ts::return_shared(wordsdata);
        };

        ts::next_tx(&mut scenario, addr1);
        {  
           let wordsdata = ts::take_shared<WordsData>(&mut scenario);
           words2words::mintPack(b"OPEN MIC NIGHT",&wordsdata,ts::ctx(&mut scenario));
           ts::return_shared(wordsdata);
        };

        ts::next_tx(&mut scenario, addr1);
        {
            let word = ts::take_from_sender<Word>(&mut scenario);
            let word2 = ts::take_from_sender<Word>(&mut scenario);
            let word3 = ts::take_from_sender<Word>(&mut scenario);
            let word4 = ts::take_from_sender<Word>(&mut scenario);
            let clock = clock::create_for_testing(ts::ctx(&mut scenario));
            clock::increment_for_testing(&mut clock,0);
            make_sentence(vector[word,word2,word3,word4],b"ipfs:://{cid}",b"refrigerator",b"My First Poeam NFT",b"Bob",&clock,ts::ctx(&mut scenario));
            clock::destroy_for_testing(clock);
        };

        ts::next_tx(&mut scenario, addr1);
        {
            let sentence = ts::take_from_sender<Sentence>(&mut scenario);
            sentence_to_words(sentence,ts::ctx(&mut scenario));
        };

        ts::next_tx(&mut scenario, addr1);
        {
            let word = ts::take_from_sender<Word>(&mut scenario);
            ts::return_to_sender(&mut scenario,word);
        };

        ts::end(scenario);
  }

}