
module contest::poetry_contest {
  use sui::transfer;
  use sui::object::{Self, UID};
  use sui::tx_context::{Self, TxContext};
  use std::string::{utf8,String};
  use sui::balance::{Self, Balance};
  use sui::table::{Self,Table};
  use sui::coin::{Self,Coin};
  use sui::sui::SUI;
  use sui::dynamic_field as df;
  use sui::clock::{Self, Clock};
  use std::type_name;
  use std::ascii::{string};

  struct Contest<phantom N> has key{
    id: UID,
    name: String,
    submissiom_cost: u64, // 10000000
    submission_start_time: u64, // 1699024854204
    submission_end_time: u64, // 1699026000000
    voting_start_time: u64, // 1699026000000
    voting_end_time: u64, // 1699029600000
    funds: Balance<SUI>,
    manager: address,
    beneficiary: address,
  }

  struct Vote has store{ 
    poemId: address,
    owner_address: address,
    votes: u64,
  }

  public entry fun create_contest<T: key + store>(name: vector<u8>, submissiom_cost: u64, submission_start_time: u64,submission_end_time: u64, voting_start_time: u64, voting_end_time: u64, ctx: &mut TxContext){
    let id = object::new(ctx);
    df::add<String,Table<address,Vote>>(&mut id,utf8(b"votes"),table::new<address,Vote>(ctx));
    df::add<String,Table<address,address>>(&mut id,utf8(b"voted"),table::new<address,address>(ctx));
    transfer::share_object( Contest<T> {
      id: id,
      name: utf8(name),
      submissiom_cost: submissiom_cost,
      submission_start_time: submission_start_time,
      submission_end_time: submission_end_time,
      voting_start_time: voting_start_time,
      voting_end_time: voting_end_time,
      funds: balance::zero<SUI>(),
      manager: tx_context::sender(ctx),
      beneficiary: tx_context::sender(ctx),
    });
    
  }

  public entry fun submit_poem<T: key + store>(poem: &T, coin: Coin<SUI>, contest: &mut Contest<T>, clock: &Clock, ctx: &mut TxContext){
    assert!(contest.submissiom_cost == coin::value(&coin), 0);

    let now : u64 = clock::timestamp_ms(clock);
    assert!( now > contest.submission_start_time && now < contest.submission_end_time, 1);

    let poem_owner_address = tx_context::sender(ctx);
    let poem_address = object::id_address(poem);

    let votes = df::borrow_mut<String,Table<address,Vote>>(&mut contest.id,utf8(b"votes"));
    table::add<address,Vote>(votes,poem_address,Vote {poemId:poem_address,owner_address:poem_owner_address,votes:0});

    coin::put<SUI>(&mut contest.funds, coin);
  }
  
  public entry fun vote<T: key + store, N: key + store>(poemId: address,suifren: &N, contest: &mut Contest<T>,clock: &Clock){
    let now : u64 = clock::timestamp_ms(clock);
    assert!( now > contest.voting_start_time && now < contest.voting_end_time, 2);
    
    let capy_type = string(b"ee496a0cc04d06a345982ba6697c90c619020de9e274408c7819f787ff66e1a1::suifrens::SuiFren<ee496a0cc04d06a345982ba6697c90c619020de9e274408c7819f787ff66e1a1::capy::Capy>");
    let bullshark_type = string(b"ee496a0cc04d06a345982ba6697c90c619020de9e274408c7819f787ff66e1a1::suifrens::SuiFren<8894fa02fc6f36cbc485ae9145d05f247a78e220814fb8419ab261bd81f08f32::bullshark::Bullshark>");

    let token_type = type_name::into_string(type_name::get<N>());
    assert!( token_type == capy_type || token_type == bullshark_type, 9);

    let votes = df::borrow_mut<String,Table<address,Vote>>(&mut contest.id,utf8(b"votes"));
    let vote = table::borrow_mut(votes,poemId);
    vote.votes = vote.votes + 1;

    let suifren_address = object::id_address(suifren);
    let voted = df::borrow_mut<String,Table<address,address>>(&mut contest.id,utf8(b"voted"));
    table::add<address,address>(voted,suifren_address,poemId);
  }

  public entry fun withdraw_proceeds<T: key + store>(contest: &mut Contest<T>,ctx: &mut TxContext){
    assert!(contest.manager == tx_context::sender(ctx), 4);
    let total_proceeds = balance::value<SUI>(&contest.funds);
    let proceeds = coin::take<SUI>(&mut contest.funds,total_proceeds,ctx);
    transfer::public_transfer(proceeds,contest.beneficiary);
  }

  public entry fun mutate_manager<T: key + store>(new_admin: address,contest: &mut Contest<T>,ctx: &mut TxContext){
      assert!(contest.manager == tx_context::sender(ctx) ,5);
      contest.manager = new_admin;
  }

  public entry fun mutate_beneficiary<T: key + store>(new_beneficiary: address,contest: &mut Contest<T>,ctx: &mut TxContext){
      assert!(contest.manager == tx_context::sender(ctx) ,5);
      contest.beneficiary = new_beneficiary;
  }

  public entry fun mutate_submission_start_timestamp<T: key + store>(new_timestamp: u64,contest: &mut Contest<T>,ctx: &mut TxContext){
      assert!(contest.manager == tx_context::sender(ctx) ,5);
      contest.submission_start_time = new_timestamp;
  }

  public entry fun mutate_submission_end_timestamp<T: key + store>(new_timestamp: u64,contest: &mut Contest<T>,ctx: &mut TxContext){
      assert!(contest.manager == tx_context::sender(ctx) ,5);
      contest.submission_end_time = new_timestamp;
  }

  public entry fun mutate_voting_start_timestamp<T: key + store>(new_timestamp: u64,contest: &mut Contest<T>,ctx: &mut TxContext){
      assert!(contest.manager == tx_context::sender(ctx) ,5);
      contest.voting_start_time = new_timestamp;
  }

  public entry fun mutate_voting_end_timestamp<T: key + store>(new_timestamp: u64,contest: &mut Contest<T>,ctx: &mut TxContext){
      assert!(contest.manager == tx_context::sender(ctx) ,5);
      contest.voting_end_time = new_timestamp;
  }
  

}