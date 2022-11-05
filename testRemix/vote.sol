// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
/// @title Voting with delegation.
contract BallotBox {
    // This declares a new complex type which will
    // be used for variables later.
    // It will represent a single voter.
    IERC20 public twitt;
    bool internal locked;

    modifier noReentrant() {
        require(!locked, "No re-entrancy");
        locked = true;
        _;
        locked = false;
    }

    modifier isHolder() {
        require(twitt.balanceOf(msg.sender)>0, "you cant vote bastard");
        _;

    }
    event balncer(uint256 balances);
    function test() public {
        emit balncer(twitt.balanceOf(msg.sender));
    }

    struct Voter {
        bool voted;  // if true, that person already voted
        uint vote;   // index of the voted proposal
        bytes32 hashtag;
    }

    // This is a type for a single proposal.
    struct Proposal {
        bytes32 hashtag;   // short name (up to 32 bytes)
        uint voteCount; // number of accumulated votes
    }


    // This declares a state variable that
    // stores a `Voter` struct for each possible address.
    mapping(address => Voter) public voters;

    // A dynamically-sized array of `Proposal` structs.
    Proposal[] public proposals;

    /// Create a new ballot to choose one of `proposalNames`.
    constructor(address  _twitt) {
        twitt = IERC20(_twitt);
    }

 
  

    /// Give your vote (including votes delegated to you)
    /// to proposal `proposals[proposal].name`.
    function voteExisting(uint proposal) isHolder noReentrant external {

        Voter storage sender = voters[msg.sender];
        require(!sender.voted, "Already voted.");
        sender.voted = true;
        sender.vote = proposal;

        // If `proposal` is out of the range of the array,
        // this will throw automatically and revert all
        // changes.
        proposals[proposal].voteCount += twitt.balanceOf(msg.sender);
    }

    function voteNew(bytes32 _hashtag) isHolder noReentrant external {
        Voter storage sender = voters[msg.sender];
        require(!sender.voted, "Already voted.");
        sender.voted = true;
        proposals.push(Proposal({
                hashtag: _hashtag,
                voteCount: 0
            }));
        uint256 proposal = proposals.length-1;
        sender.vote = proposal;
        // If `proposal` is out of the range of the array,
        // this will throw automatically and revert all
        // changes.
        proposals[proposal].voteCount += twitt.balanceOf(msg.sender);
    }

    /// @dev Computes the winning proposal taking all
    /// previous votes into account.
    function winningProposal() public view
            returns (uint winningProposal_)
    {
        uint winningVoteCount = 0;
        for (uint p = 0; p < proposals.length; p++) {
            if (proposals[p].voteCount > winningVoteCount) {
                winningVoteCount = proposals[p].voteCount;
                winningProposal_ = p;
            }
        }
    }

    // Calls winningProposal() function to get the index
    // of the winner contained in the proposals array and then
    // returns the name of the winner
    function winnerName() external view
            returns (bytes32 winnerName_)
    {
        winnerName_ = proposals[winningProposal()].hashtag;
    }
}