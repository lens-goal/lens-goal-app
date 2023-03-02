// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./IERC20.sol";
import "./IERC721.sol";
import "./ILensNFTContract.sol";

contract LensGoalHelpers {
    ILensNFTContract LNFTC =
        ILensNFTContract(0xDb46d1Dc155634FbC732f92E853b10B288AD5a1d);

    // Get address list of all holders of NFT
    function getAddressesOfLensFrens(
        address _nftAddress
    ) public view returns (address[] memory) {
        // create address list
        address[] memory followerAddresses;

        // initialize nft object
        IERC721 NFT = IERC721(_nftAddress);

        // get total supply of nfts (used for iteration)
        uint256 totalNftSupply = NFT.totalSupply();

        // iterate from 0 to totalNftSupply-1
        for (uint256 i; i < totalNftSupply; i++) {
            if (
                NFT.ownerOf(i) != 0x0000000000000000000000000000000000000000 &&
                NFT.ownerOf(i) != 0x000000000000000000000000000000000000dEaD
            ) {
                followerAddresses[i] = (NFT.ownerOf(i));
            }
        }

        return followerAddresses;
    }

    // Get Follower NFT of address using Lenster NFT Contract
    function getFollowerNFTAddress(address user) public view returns (address) {
        uint256 profileId = LNFTC.defaultProfile(user);
        return LNFTC.getFollowNFT(profileId);
    }

    function getLensFrensWithUserAddress(
        address user
    ) public view returns (address[] memory lensfrens) {
        return getAddressesOfLensFrens(getFollowerNFTAddress(user));
    }

    function evaluateVotes(
        bool[] memory voteList
    ) public pure returns (bool answer) {
        // define counts
        uint256 trueCount;
        uint256 falseCount;

        // if no one voted, stake is automatically sent back to user
        if (voteList.length == 0) {
            return true;
        }

        // for every item in voteList check value and increase respective count
        for (uint256 i; i < voteList.length; i++) {
            if (voteList[i]) {
                trueCount += 1;
            } else {
                falseCount += 1;
            }
        }
        // if there are more true answers than false answers, answer is true
        if (trueCount > falseCount) {
            return true;
            // if there are more false answers than true answers, answer is false
        } else if (falseCount > trueCount) {
            return false;
            // if there are an even amount of true and false answers, answer is true (may change in the future)
        } else if (trueCount == falseCount) {
            return true;
        }
    }
}
