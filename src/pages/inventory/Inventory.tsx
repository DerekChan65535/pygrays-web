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
  CAlert
} from "@coreui/react-pro";
import "./Inventory.scss";
import InventoryApiClient from "../../clients/InventoryApiClient";

interface InventoryProps {}

function Inventory(props: InventoryProps): React.JSX.Element {
  const [txtFiles, setTxtFiles] = useState<FileList | null>(null);
  const [csvFiles, setCsvFiles] = useState<FileList | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [errorMessages, setErrorMessages] = useState<string[] | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  const handleTxtFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setTxtFiles(e.target.files);
      setError(null);
      setErrorMessages(null);
    }
  };
  
  const handleCsvFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      // Validate SOH filename pattern
      const invalidFiles = [];
      for (let i = 0; i < e.target.files.length; i++) {
        const file = e.target.files[i];
        const nameWithoutExt = file.name.replace(/\.[^/.]+$/, "");
        if (nameWithoutExt.length < 6 || !/\d{6}$/.test(nameWithoutExt)) {
          invalidFiles.push(file.name);
        }
      }
      
      if (invalidFiles.length > 0) {
        setError(`Invalid SOH filename(s) - must end with DDMMYY pattern: ${invalidFiles.join(', ')}`);
        return;
      }
      
      setCsvFiles(e.target.files);
      setError(null);
      setErrorMessages(null);
    }
  };
  
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setErrorMessages(null);
    setSuccessMessage(null);
    
    if (!txtFiles || txtFiles.length === 0) {
      setError("Please select at least one TXT file");
      return;
    }
    
    if (!csvFiles || csvFiles.length === 0) {
      setError("Please select at least one SOH CSV file");
      return;
    }
    
    try {
      setIsSubmitting(true);
      const response = await InventoryApiClient.uploadInventoryFiles(txtFiles, csvFiles);
      
      if (response.success) {
        setSuccessMessage("Files uploaded successfully!");
        // Reset form after successful submission
        setTxtFiles(null);
        setCsvFiles(null);
        
        // Reset file input fields
        const txtFilesInput = document.getElementById('txtFilesInput') as HTMLInputElement;
        const csvFileInput = document.getElementById('csvFileInput') as HTMLInputElement;
        if (txtFilesInput) txtFilesInput.value = '';
        if (csvFileInput) csvFileInput.value = '';
      } else {
        // Handle detailed error messages if available
        if (response.errorMessages && Array.isArray(response.errorMessages)) {
          setErrorMessages(response.errorMessages);
        }
        setError(response.error || "An error occurred while uploading files");
      }
    } catch (err) {
      setError("Failed to upload files. Please try again.");
      console.error("Upload error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <>
      <CContainer className="inventory-container">
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
                      <CFormLabel htmlFor="txtFilesInput">Multiple TXT Files</CFormLabel>
                      <CFormInput
                        type="file"
                        id="txtFilesInput"
                        multiple
                        accept=".txt"
                        onChange={handleTxtFileChange}
                      />
                      {txtFiles && (
                        <div className="selected-files mt-2">
                          <p className="mb-1">Selected TXT files: {txtFiles.length}</p>
                          <ul className="file-list">
                            {Array.from(txtFiles).map((file, index) => (
                              <li key={index}>{file.name}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </CCol>
                  </CRow>
                  <CRow className="mb-3">
                    <CCol md={12}>
                      <CFormLabel htmlFor="csvFileInput">SOH Files (CSV format, filenames must end with DDMMYY)</CFormLabel>
                      <CFormInput
                        type="file"
                        id="csvFileInput"
                        multiple
                        accept=".csv"
                        onChange={handleCsvFileChange}
                      />
                      {csvFiles && (
                        <div className="selected-files mt-2">
                          <p className="mb-1">Selected SOH files: {csvFiles.length}</p>
                          <ul className="file-list">
                            {Array.from(csvFiles).map((file, index) => (
                              <li key={index}>{file.name}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </CCol>
                  </CRow>
                  <CRow className="mt-4">
                    <CCol md={12} className="text-end">
                      <button 
                        type="submit" 
                        className="btn btn-primary" 
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? 'Uploading...' : 'Upload Files'}
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

export default Inventory;