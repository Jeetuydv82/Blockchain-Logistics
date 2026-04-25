// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract ShipmentTracking {
    struct StatusUpdate {
        string status;
        address updatedBy;
        uint256 timestamp;
        string location;
    }

    struct Shipment {
        string trackingId;
        address createdBy;
        address assignedTransporter;
        StatusUpdate[] statusHistory;
        bool exists;
    }

    mapping(string => Shipment) private shipments;
    mapping(string => bool) private usedTrackingIds;
    
    event ShipmentCreated(string indexed trackingId, address indexed createdBy);
    event TransporterAssigned(string indexed trackingId, address indexed transporter);
    event StatusUpdated(string indexed trackingId, string status, address indexed updatedBy, string location);

    function createShipment(string memory _trackingId) public {
        require(!usedTrackingIds[_trackingId], "Tracking ID already exists");
        
        Shipment storage newShipment = shipments[_trackingId];
        newShipment.trackingId = _trackingId;
        newShipment.createdBy = msg.sender;
        newShipment.exists = true;
        
        newShipment.statusHistory.push(StatusUpdate({
            status: "pending",
            updatedBy: msg.sender,
            timestamp: block.timestamp,
            location: "Origin"
        }));

        usedTrackingIds[_trackingId] = true;
        emit ShipmentCreated(_trackingId, msg.sender);
    }

    function assignTransporter(string memory _trackingId, address _transporter) public {
        require(shipments[_trackingId].exists, "Shipment does not exist");
        
        shipments[_trackingId].assignedTransporter = _transporter;
        
        shipments[_trackingId].statusHistory.push(StatusUpdate({
            status: "assigned",
            updatedBy: msg.sender,
            timestamp: block.timestamp,
            location: ""
        }));

        emit TransporterAssigned(_trackingId, _transporter);
        emit StatusUpdated(_trackingId, "assigned", msg.sender, "");
    }

    function updateStatus(string memory _trackingId, string memory _status, string memory _location) public {
        require(shipments[_trackingId].exists, "Shipment does not exist");
        // We aren't doing strict access control here for simplicity, relying on backend.
        // In prod, require(msg.sender == shipments[_trackingId].assignedTransporter || msg.sender == admin);
        
        shipments[_trackingId].statusHistory.push(StatusUpdate({
            status: _status,
            updatedBy: msg.sender,
            timestamp: block.timestamp,
            location: _location
        }));

        emit StatusUpdated(_trackingId, _status, msg.sender, _location);
    }

    function getShipmentHistory(string memory _trackingId) public view returns (StatusUpdate[] memory) {
        require(shipments[_trackingId].exists, "Shipment does not exist");
        return shipments[_trackingId].statusHistory;
    }
}