import React, { useState, FormEvent } from "react";
import {
  CCard,
  CCardBody,
  CCol,
  CForm,
  CFormInput,
  CFormLabel,
  CRow,
  CContainer,
  CAlert,
} from "@coreui/react-pro";
import "./BankStatement.scss";
import BankStatementApiClient from "../../clients/BankStatementApiClient";

interface BankStatementProps {}

function BankStatement(props: BankStatementProps): React.JSX.Element {
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [errorMessages, setErrorMessages] = useState<string[] | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      
      // Validate file extension
      if (!file.name.toLowerCase().endsWith('.csv')) {
        setError("Please select a CSV file (.csv)");
        setCsvFile(null);
        return;
      }
      
      setCsvFile(file);
      setError(null);
      setErrorMessages(null);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setErrorMessages(null);
    setSuccessMessage(null);
    
    if (!csvFile) {
      setError("Please select a CSV file");
      return;
    }
    
    try {
      setIsSubmitting(true);
      const response = await BankStatementApiClient.uploadBankStatementFile(csvFile);
      
      if (response.success) {
        setSuccessMessage("File processed successfully! ZIP file downloaded.");
        // Reset form after successful submission
        setCsvFile(null);
        
        // Reset file input field
        const fileInput = document.getElementById('csvFileInput') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
      } else {
        // Handle detailed error messages if available
        if (response.errorMessages && Array.isArray(response.errorMessages)) {
          setErrorMessages(response.errorMessages);
        }
        setError(response.error || "An error occurred while processing the file");
      }
    } catch (err) {
      setError("Failed to process file. Please try again.");
      console.error("Upload error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <>
      <CContainer className="bank-statement-container">
        <CRow>
          <CCol>
            <CCard className="mb-4">
              <CCardBody>
                {error && (
                  <CAlert color="danger" dismissible onClose={() => {
                    setError(null);
                    setErrorMessages(null);
                  }}>
                    <h4 className="error-heading">{error}</h4>
                    {errorMessages && errorMessages.length > 0 && (
                      <div className="error-details">
                        <ul>
                          {errorMessages.map((message, index) => (
                            <li key={index}>{message}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </CAlert>
                )}

                {successMessage && (
                  <CAlert color="success" dismissible onClose={() => setSuccessMessage(null)}>
                    {successMessage}
                  </CAlert>
                )}

                <CForm onSubmit={handleSubmit}>
                  <CRow className="mb-3">
                    <CCol md={12}>
                      <CFormLabel htmlFor="csvFileInput">CSV File (.csv)</CFormLabel>
                      <CFormInput
                        type="file"
                        id="csvFileInput"
                        accept=".csv"
                        onChange={handleFileChange}
                      />
                      {csvFile && (
                        <div className="selected-files mt-2">
                          <p className="mb-1">Selected file:</p>
                          <ul className="file-list">
                            <li>{csvFile.name}</li>
                          </ul>
                        </div>
                      )}
                      <div className="mt-2">
                        <small className="text-muted">
                          The file must contain columns: TRAN_DATE, ACCOUNT_NO, ACCOUNT_NAME, CCY, CLOSING_BAL, AMOUNT, TRAN_CODE, NARRATIVE, SERIAL
                        </small>
                      </div>
                    </CCol>
                  </CRow>
                  <CRow className="mt-4">
                    <CCol md={12} className="text-end">
                      <button 
                        type="submit" 
                        className="btn btn-primary" 
                        disabled={isSubmitting || !csvFile}
                      >
                        {isSubmitting ? 'Processing...' : 'Process File'}
                      </button>
                    </CCol>
                  </CRow>
                </CForm>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </>
  );
}

export default BankStatement;

