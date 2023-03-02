// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

interface ILensNFTContract {
    function defaultProfile(address wallet) external view returns (uint256);

    function getFollowNFT(
        uint256 profileId
    ) external view returns (address _nftContractAddress_);
}
