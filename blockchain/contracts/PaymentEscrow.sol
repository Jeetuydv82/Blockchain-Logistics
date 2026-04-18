// contracts/PaymentEscrow.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract PaymentEscrow is Ownable, ReentrancyGuard {
    using SafeMath for uint256;

    enum PaymentStatus { None, Locked, Released, Refunded }

    struct Payment {
        address buyer;
        address seller;
        uint256 amount;
        PaymentStatus status;
        uint256 timestamp;
    }

    mapping(bytes32 => Payment) public payments;
    mapping(address => uint256) public pendingWithdrawals;

    event PaymentLocked(bytes32 indexed paymentId, address buyer, address seller, uint256 amount);
    event PaymentReleased(bytes32 indexed paymentId, address seller, uint256 amount);
    event PaymentRefunded(bytes32 indexed paymentId, address buyer, uint256 amount);

    modifier onlyValidPayment(bytes32 paymentId) {
        require(payments[paymentId].status != PaymentStatus.None, "Invalid payment");
        _;
    }

    function lockPayment(
        bytes32 paymentId,
        address seller,
        address buyer
    ) external payable nonReentrant {
        require(payments[paymentId].status == PaymentStatus.None, "Payment exists");
        require(msg.value > 0, "Invalid amount");

        payments[paymentId] = Payment({
            buyer: buyer,
            seller: seller,
            amount: msg.value,
            status: PaymentStatus.Locked,
            timestamp: block.timestamp
        });

        emit PaymentLocked(paymentId, buyer, seller, msg.value);
    }

    function releasePayment(bytes32 paymentId) external onlyOwner nonReentrant onlyValidPayment(paymentId) {
        Payment storage payment = payments[paymentId];
        require(payment.status == PaymentStatus.Locked, "Not locked");

        payment.status = PaymentStatus.Released;
        pendingWithdrawals[payment.seller] = pendingWithdrawals[payment.seller].add(payment.amount);

        emit PaymentReleased(paymentId, payment.seller, payment.amount);
    }

    function refundPayment(bytes32 paymentId) external onlyOwner nonReentrant onlyValidPayment(paymentId) {
        Payment storage payment = payments[paymentId];
        require(payment.status == PaymentStatus.Locked, "Not locked");

        payment.status = PaymentStatus.Refunded;
        pendingWithdrawals[payment.buyer] = pendingWithdrawals[payment.buyer].add(payment.amount);

        emit PaymentRefunded(paymentId, payment.buyer, payment.amount);
    }

    function withdraw() external nonReentrant {
        uint256 amount = pendingWithdrawals[msg.sender];
        require(amount > 0, "No pending withdrawals");

        pendingWithdrawals[msg.sender] = 0;
        payable(msg.sender).transfer(amount);
    }

    function getPaymentStatus(bytes32 paymentId) external view returns (PaymentStatus) {
        return payments[paymentId].status;
    }

    function getPaymentDetails(bytes32 paymentId) external view returns (
        address buyer,
        address seller,
        uint256 amount,
        PaymentStatus status,
        uint256 timestamp
    ) {
        Payment memory p = payments[paymentId];
        return (p.buyer, p.seller, p.amount, p.status, p.timestamp);
    }

    receive() external payable {}
}