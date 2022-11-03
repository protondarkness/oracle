// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;
contract Verify {

   address public importantAddress;
    bytes32 public messg;

   constructor (address _importantAddress) {
       importantAddress = _importantAddress;
   }

   function isValidData( string memory _word, bytes memory sig) public view returns(bool){
       bytes32 message = keccak256(abi.encodePacked( _word));
       return (recoverSigner(message, sig) == importantAddress);
   }

function isValidData2( bytes32  _word, bytes memory sig) public view returns(bool){
       //bytes32 message = keccak256(abi.encodePacked( _word));
       return (recoverSigner(_word, sig) == importantAddress);
   }
    function msgR(string memory _w)public returns(bytes32){
         messg = keccak256(abi.encodePacked( _w));
        return messg;
    }

   function recoverSigner(bytes32 message, bytes memory sig)
       public
       pure
       returns (address)
     {
       uint8 v;
       bytes32 r;
       bytes32 s;
       (v, r, s) = splitSignature(sig);
       return ecrecover(message, v, r, s);
   }

   function splitSignature(bytes memory sig)
       public
       pure
       returns (uint8, bytes32, bytes32)
     {
       require(sig.length == 65);

       bytes32 r;
       bytes32 s;
       uint8 v;

       assembly {
           // first 32 bytes, after the length prefix
           r := mload(add(sig, 32))
           // second 32 bytes
           s := mload(add(sig, 64))
           // final byte (first byte of the next 32 bytes)
           v := byte(0, mload(add(sig, 96)))
       }

       return (v, r, s);
   }
}