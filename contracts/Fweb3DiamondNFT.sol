// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

import "./lib/Base64.sol";

contract Fweb3DiamondNFT is ERC721, Ownable {
    constructor() ERC721("Fweb3 Diamond NFT", "FWEB3DIAMONDNFT") {}

    function random(string memory input) internal pure returns (uint256) {
        return uint256(keccak256(abi.encodePacked(input)));
    }

    function getHue(uint256 tokenId) internal pure returns (string memory) {
        uint256 rand = random(
            string(abi.encodePacked(Strings.toString(tokenId)))
        );
        uint256 hue = rand % 360;
        return Strings.toString(hue);
    }

    function getSaturation(uint256 tokenId)
        internal
        pure
        returns (string memory)
    {
        uint256 rand = random(
            string(abi.encodePacked(Strings.toString(tokenId)))
        );
        uint256 saturation = rand % 100;
        return Strings.toString(saturation);
    }

    function getBackgroundColor(uint256 tokenId)
        internal
        pure
        returns (string memory)
    {
        uint256 rand = random(
            string(abi.encodePacked(Strings.toString(tokenId)))
        );
        bytes32 val = bytes32(rand);
        bytes memory hx = "0123456789ABCDEF";
        bytes memory str = new bytes(6);

        for (uint256 i = 0; i < 6; i++) {
            str[i] = hx[uint8(val[i]) & 0x0f];
        }
        return string(str);
    }

    function tokenURI(uint256 tokenId)
        public
        pure
        override
        returns (string memory)
    {
        string[17] memory parts;
        string memory hueAndSaturation = string(
            abi.encodePacked(getHue(tokenId), ",", getSaturation(tokenId))
        );
        string memory backgroundColor = getBackgroundColor(tokenId);

        parts[
            0
        ] = '<svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMinYMin meet" viewBox="0 0 512 512"><rect width="100%" height="100%" fill="#';
        parts[1] = backgroundColor;
        parts[
            2
        ] = '"/><path d="M256 372.057L378 203.686L331.4 140H180.6L134 203.686L256 372.057Z" fill="hsl(';
        parts[3] = hueAndSaturation;
        parts[
            4
        ] = '%,79%)"/><path d="M180.601 140L215.332 203.689H134L180.601 140Z" fill="hsl(';
        parts[5] = hueAndSaturation;
        parts[
            6
        ] = '%,82%)"/><path d="M331.4 140L296.664 203.689L255.998 140H331.4Z" fill="hsl(';
        parts[7] = hueAndSaturation;
        parts[
            8
        ] = '%,82%)"/><path d="M296.664 203.689L255.998 372.056L215.332 203.689H296.664Z" fill="hsl(';
        parts[9] = hueAndSaturation;
        parts[
            10
        ] = '%,82%)"/><path d="M331.4 140L377.995 203.689H296.664L331.4 140Z" fill="hsl(';
        parts[11] = hueAndSaturation;
        parts[
            12
        ] = '%,94%)"/><path d="M255.998 140L296.664 203.689H215.332L255.998 140Z" fill="hsl(';
        parts[13] = hueAndSaturation;
        parts[
            14
        ] = '%,94%)"/><path d="M215.332 203.689L255.998 372.056L134 203.689H215.332Z" fill="hsl(';
        parts[15] = hueAndSaturation;
        parts[16] = '%,94%)"/></svg>';

        string memory output = string(
            abi.encodePacked(
                parts[0],
                parts[1],
                parts[2],
                parts[3],
                parts[4],
                parts[5],
                parts[6],
                parts[7],
                parts[8]
            )
        );
        output = string(
            abi.encodePacked(
                output,
                parts[9],
                parts[10],
                parts[11],
                parts[12],
                parts[13],
                parts[14],
                parts[15],
                parts[16]
            )
        );

        string memory json = Base64.encode(
            bytes(
                string(
                    abi.encodePacked(
                        '{"name": "Fweb3 Diamond NFT", "description": "This NFT represents participation in Fweb3 2022.", "image": "data:image/svg+xml;base64,',
                        Base64.encode(bytes(output)),
                        '"}'
                    )
                )
            )
        );
        output = string(
            abi.encodePacked("data:application/json;base64,", json)
        );

        return output;
    }

    function mint(uint256 tokenId) public {
        _safeMint(_msgSender(), tokenId);
    }
}
