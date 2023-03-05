// SPDX-License-Identifier: MIT 

// IFunctionsConsumer.sol

import "./dev/functions/FunctionsClient.sol";

pragma solidity ^0.8.0;


interface IFunctionsConsumer {

    function executeRequest(
        string calldata source,
        bytes calldata secrets,
        Functions.Location secretsLocation,
        string[] calldata args,
        uint64 subscriptionId,
        uint32 gasLimit
    ) external returns (bytes32);

    function getLatestReponseAndError() external view returns(bytes memory response, bytes memory err);

    function updateOracleAddress(address oracle) external;
}