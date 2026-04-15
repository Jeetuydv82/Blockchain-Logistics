// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract ShipmentTracking {

    // ─── EVENTS ────────────────────────────────────────
    event ShipmentCreated(
        string  indexed trackingNumber,
        address indexed createdBy,
        uint256         timestamp
    );

    event StatusUpdated(
        string  indexed trackingNumber,
        string          newStatus,
        address indexed updatedBy,
        uint256         timestamp
    );

    // ─── DATA STRUCTURES ───────────────────────────────
    struct StatusRecord {
        string  status;
        string  note;
        address updatedBy;
        uint256 timestamp;
    }

    struct Shipment {
        string        trackingNumber;
        address       createdBy;
        uint256       createdAt;
        bool          exists;
        StatusRecord[] history;
    }

    // ─── STATE VARIABLES ───────────────────────────────
    mapping(string => Shipment) private shipments;
    string[] public allTrackingNumbers;
    address  public owner;

    // ─── CONSTRUCTOR ───────────────────────────────────
    constructor() {
        owner = msg.sender;
    }

    // ─── CREATE SHIPMENT ───────────────────────────────
    function createShipment(
        string memory trackingNumber,
        string memory initialStatus
    ) public {
        require(!shipments[trackingNumber].exists, "Shipment already exists");
        require(bytes(trackingNumber).length > 0,  "Tracking number required");

        Shipment storage s = shipments[trackingNumber];
        s.trackingNumber   = trackingNumber;
        s.createdBy        = msg.sender;
        s.createdAt        = block.timestamp;
        s.exists           = true;

        // Add initial status to history
        s.history.push(StatusRecord({
            status    : initialStatus,
            note      : "Shipment created on blockchain",
            updatedBy : msg.sender,
            timestamp : block.timestamp
        }));

        allTrackingNumbers.push(trackingNumber);

        emit ShipmentCreated(trackingNumber, msg.sender, block.timestamp);
    }

    // ─── UPDATE STATUS ─────────────────────────────────
    function updateStatus(
        string memory trackingNumber,
        string memory newStatus,
        string memory note
    ) public {
        require(shipments[trackingNumber].exists, "Shipment not found");

        shipments[trackingNumber].history.push(StatusRecord({
            status    : newStatus,
            note      : note,
            updatedBy : msg.sender,
            timestamp : block.timestamp
        }));

        emit StatusUpdated(trackingNumber, newStatus, msg.sender, block.timestamp);
    }

    // ─── GET SHIPMENT INFO ─────────────────────────────
    function getShipment(string memory trackingNumber)
        public view
        returns (
            address createdBy,
            uint256 createdAt,
            uint256 historyCount
        )
    {
        require(shipments[trackingNumber].exists, "Shipment not found");
        Shipment storage s = shipments[trackingNumber];
        return (s.createdBy, s.createdAt, s.history.length);
    }

    // ─── GET STATUS HISTORY ITEM ───────────────────────
    function getStatusAt(string memory trackingNumber, uint256 index)
        public view
        returns (
            string  memory status,
            string  memory note,
            address        updatedBy,
            uint256        timestamp
        )
    {
        require(shipments[trackingNumber].exists, "Shipment not found");
        StatusRecord storage r = shipments[trackingNumber].history[index];
        return (r.status, r.note, r.updatedBy, r.timestamp);
    }

    // ─── CHECK IF SHIPMENT EXISTS ──────────────────────
    function shipmentExists(string memory trackingNumber)
        public view returns (bool)
    {
        return shipments[trackingNumber].exists;
    }

    // ─── GET TOTAL SHIPMENTS ───────────────────────────
    function getTotalShipments() public view returns (uint256) {
        return allTrackingNumbers.length;
    }
}