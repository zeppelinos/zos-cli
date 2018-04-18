pragma solidity ^0.4.21;

import "./App_v0.sol";

contract AppUpdate is App {

  function sayHi() public pure returns (string) {
    return "Hi.";
  }
}
