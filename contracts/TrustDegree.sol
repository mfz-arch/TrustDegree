// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract TrustDegree {
    struct Certificate {
        string studentName;
        string courseName;
        string issueDate;
        bool isValid;
        address issuer;
    }

    // Mapping from unique Certificate ID (e.g. "CERT-001") to Certificate data
    mapping(string => Certificate) public certificates;

    event CertificateIssued(string certId, string studentName, address issuer);

    address public admin;

    constructor() {
        admin = msg.sender;
    }

    // Function to issue a new certificate
    function issueCertificate(
        string memory _certId,
        string memory _studentName,
        string memory _courseName,
        string memory _issueDate
    ) public {
        require(!certificates[_certId].isValid, "Certificate ID already exists");
        
        certificates[_certId] = Certificate({
            studentName: _studentName,
            courseName: _courseName,
            issueDate: _issueDate,
            isValid: true,
            issuer: msg.sender
        });

        emit CertificateIssued(_certId, _studentName, msg.sender);
    }

    // Function to verify a certificate
    function verifyCertificate(string memory _certId) public view returns (
        string memory studentName,
        string memory courseName,
        string memory issueDate,
        bool isValid,
        address issuer
    ) {
        Certificate memory cert = certificates[_certId];
        return (cert.studentName, cert.courseName, cert.issueDate, cert.isValid, cert.issuer);
    }
}
