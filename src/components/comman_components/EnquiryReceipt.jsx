import React from "react";
const EnquiryReceipt = ({ isOpen, onClose, receiptData }) => {
    return (
      <ReactModal
        isOpen={isOpen}
        onRequestClose={onClose}
        contentLabel="Receipt"
        style={{
          content: {
            width: "300px",
            margin: "auto",
            padding: "20px",
            border: "1px solid #ccc",
          },
        }}
      >
        <h2>School Name</h2>
        {/* <p><strong>Student Name:</strong> {receiptData.name}</p> */}
        {/* <p><strong>Class:</strong> {receiptData.class}</p> */}
        {/* <p><strong>Fee Amount:</strong> {receiptData.fee}</p> */}
        {/* <p><strong>Date:</strong> {receiptData.date}</p> */}
        {/* <button onClick={() => window.print()}>Print Receipt</button> */}
        {/* <button onClick={onClose}>Close</button> */}
      </ReactModal>
    );
  };
export default EnquiryReceipt