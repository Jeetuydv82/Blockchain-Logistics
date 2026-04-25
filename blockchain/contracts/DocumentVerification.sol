// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract DocumentVerification {
    struct Document {
        string fileHash;
        address uploadedBy;
        uint256 uploadedAt;
        bool exists;
    }

    mapping(string => Document) private documents;

    event DocumentVerified(string indexed fileHash, address indexed uploadedBy);

    function uploadDocument(string memory _fileHash) public {
        require(!documents[_fileHash].exists, "Document already exists on blockchain");
        
        documents[_fileHash] = Document({
            fileHash: _fileHash,
            uploadedBy: msg.sender,
            uploadedAt: block.timestamp,
            exists: true
        });

        emit DocumentVerified(_fileHash, msg.sender);
    }

    function verifyDocument(string memory _fileHash) public view returns (bool, address, uint256) {
        Document memory doc = documents[_fileHash];
        if (doc.exists) {
            return (true, doc.uploadedBy, doc.uploadedAt);
        }
        return (false, address(0), 0);
    }
}