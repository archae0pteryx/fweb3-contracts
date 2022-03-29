// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "./lib/Base64.sol";

interface Game {
    function isWinner(address player) external view returns (bool);
}

contract Fweb3TrophyNFT is ERC721 {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    address private _gameAddress;

    constructor(address gameAddress)
        ERC721("Fweb3 2022 Trophy NFT", "FWEB3TROPHYNFT")
    {
        _gameAddress = gameAddress;
    }

    function isWinner(address player) public view returns (bool) {
        Game game = Game(_gameAddress);
        return game.isWinner(player);
    }

    function tokenURI(uint256 tokenId)
        public
        pure
        override
        returns (string memory)
    {
        string memory tier;
        string memory url;

        if (tokenId <= 333) {
            tier = "Gold";
            url = "https://ipfs.io/ipfs/QmYSbJd7ivjrRteXygXiGWck2JHJqPTcAfourK5D6bL7zZ";
        } else if (tokenId <= 3333) {
            tier = "Silver";
            url = "https://ipfs.io/ipfs/QmWf4zTTEayJmWCkKtgHwBK6PmD7yXwDvENKT5gJspLG8C";
        } else {
            tier = "Bronze";
            url = "https://ipfs.io/ipfs/QmQJBa9wFqB5hWWK7iFrReEwBPfubWjGAmH9Vbb9dMTCay";
        }

        string memory json = Base64.encode(
            bytes(
                string(
                    abi.encodePacked(
                        '{"name": "Fweb3 ',
                        tier,
                        ' Trophy NFT", "description": "This NFT represents winning Fweb3 2022.", "image": "',
                        url,
                        '"}'
                    )
                )
            )
        );
        string memory output = string(
            abi.encodePacked("data:application/json;base64,", json)
        );

        return output;
    }

    function mint() public {
        require(balanceOf(msg.sender) == 0, "Already minted trophy");
        require(isWinner(msg.sender), "Not a winner");
        _tokenIds.increment();
        require(_tokenIds.current() <= 10000, "Too many trophies");
        _safeMint(_msgSender(), _tokenIds.current());
    }
}
