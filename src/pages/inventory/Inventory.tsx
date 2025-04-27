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
} from "@coreui/react";
import "./Inventory.scss";
import ApiClient from "../../clients/ApiClient";

interface InventoryProps {}

function Inventory(props: InventoryProps): React.JSX.Element {
  const [primaryFiles, setPrimaryFiles] = useState<FileList | null>(null);
  const [secondaryFiles, setSecondaryFiles] = useState<FileList | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  const handlePrimaryFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setPrimaryFiles(e.target.files);
      setError(null);
    }
  };
  
  const handleSecondaryFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSecondaryFiles(e.target.files);
      setError(null);
    }
  };
  
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    
    if (!primaryFiles || primaryFiles.length === 0) {
      setError("Please select at least one primary document");
      return;
    }
    
    // Create FormData to process files
    const formData = new FormData();
    
    if (primaryFiles) {
      for (let i = 0; i < primaryFiles.length; i++) {
        formData.append('primaryFiles', primaryFiles[i]);
      }
    }
    
    if (secondaryFiles) {
      for (let i = 0; i < secondaryFiles.length; i++) {
        formData.append('secondaryFiles', secondaryFiles[i]);
      }
    }
    
    try {
      setIsSubmitting(true);
      const response = await ApiClient.sendFiles(formData);
      
      if (response.success) {
        setSuccessMessage("Files uploaded successfully!");
        // Reset form after successful submission
        setPrimaryFiles(null);
        setSecondaryFiles(null);
        
        // Reset file input fields
        const primaryInput = document.getElementById('primaryFileInput') as HTMLInputElement;
        const secondaryInput = document.getElementById('secondaryFileInput') as HTMLInputElement;
        if (primaryInput) primaryInput.value = '';
        if (secondaryInput) secondaryInput.value = '';
      } else {
        setError(response.error || "An error occurred while uploading files");
      }
    } catch (err) {
      setError("Failed to upload files. Please try again.");
      console.error("Upload error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // @ts-ignore
  // @ts-ignore
  return (
    <>
      <CContainer className="inventory-container">
        <CRow>
          <CCol>
            <CCard className="mb-4">
              <CCardBody>
                {error && (
                    <CAlert color="danger" dismissible onClose={() => setError(null)}>
                      {error}
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
                      <CFormLabel htmlFor="primaryFileInput">Primary Documents</CFormLabel>
                      <CFormInput
                          type="file"
                          id="primaryFileInput"
                          multiple
                          onChange={handlePrimaryFileChange}
                      />
                      {primaryFiles && (
                          <div className="selected-files mt-2">
                            <p className="mb-1">Selected files: {primaryFiles.length}</p>
                            <ul className="file-list">
                              {Array.from(primaryFiles).map((file, index) => (
                                  <li key={index}>{file.name}</li>
                              ))}
                            </ul>
                          </div>
                      )}
                    </CCol>
                  </CRow>
                  <CRow className="mb-3">
                    <CCol md={12}>
                      <CFormLabel htmlFor="secondaryFileInput">Secondary Documents</CFormLabel>
                      <CFormInput
                          type="file"
                          id="secondaryFileInput"
                          multiple
                          onChange={handleSecondaryFileChange}
                      />
                      {secondaryFiles && (
                          <div className="selected-files mt-2">
                            <p className="mb-1">Selected files: {secondaryFiles.length}</p>
                            <ul className="file-list">
                              {Array.from(secondaryFiles).map((file, index) => (
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