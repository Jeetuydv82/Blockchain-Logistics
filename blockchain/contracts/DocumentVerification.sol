// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract DocumentVerification {

    // ─── STRUCT ───────────────────────────────────────
    struct Document {
        string  fileHash;        // SHA256 hash of the file
        string  fileName;        // original file name
        string  shipmentId;      // linked shipment tracking number
        address uploadedBy;      // wallet address of uploader
        uint256 uploadedAt;      // timestamp
        bool    exists;          // to check if document exists
    }

    // ─── STORAGE ──────────────────────────────────────
    mapping(string => Document) private documents;  // fileHash => Document

    // ─── EVENTS ───────────────────────────────────────
    event DocumentStored(
        string  indexed fileHash,
        string  fileName,
        string  shipmentId,
        address uploadedBy,
        uint256 uploadedAt
    );

    // ─── STORE DOCUMENT HASH ──────────────────────────
    function storeDocument(
        string memory fileHash,
        string memory fileName,
        string memory shipmentId
    ) public {
        require(bytes(fileHash).length > 0, "Hash cannot be empty");
        require(!documents[fileHash].exists,  "Document already stored");

        documents[fileHash] = Document({
            fileHash   : fileHash,
            fileName   : fileName,
            shipmentId : shipmentId,
            uploadedBy : msg.sender,
            uploadedAt : block.timestamp,
            exists     : true
        });

        emit DocumentStored(fileHash, fileName, shipmentId, msg.sender, block.timestamp);
    }

    // ─── VERIFY DOCUMENT ──────────────────────────────
    function verifyDocument(
        string memory fileHash
    ) public view returns (
        bool    isVerified,
        string  memory fileName,
        string  memory shipmentId,
        address uploadedBy,
        uint256 uploadedAt
    ) {
        Document memory doc = documents[fileHash];

        if (!doc.exists) {
            return (false, "", "", address(0), 0);
        }

        return (
            true,
            doc.fileName,
            doc.shipmentId,
            doc.uploadedBy,
            doc.uploadedAt
        );
    }

    // ─── GET DOCUMENT ─────────────────────────────────
    function getDocument(
        string memory fileHash
    ) public view returns (Document memory) {
        require(documents[fileHash].exists, "Document not found");
        return documents[fileHash];
    }
}