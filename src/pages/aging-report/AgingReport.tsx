import React, { useState, FormEvent, useEffect } from "react";
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
  CInputGroup,
  CInputGroupText,
  CFormText
} from "@coreui/react-pro";
import "./AgingReport.scss";
import AgingReportApiClient from "../../clients/AgingReportApiClient";

interface AgingReportProps {}

function AgingReport(props: AgingReportProps): React.JSX.Element {
  const [dataFiles, setDataFiles] = useState<FileList | null>(null);
  const [mappingFile, setMappingFile] = useState<File | null>(null);
  const [reportDate, setReportDate] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [errorMessages, setErrorMessages] = useState<string[] | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  // Set today's date as default on component mount
  useEffect(() => {
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0]; // Format as YYYY-MM-DD
    setReportDate(formattedDate);
  }, []);

  const handleDataFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setDataFiles(e.target.files);
      setError(null);
      setErrorMessages(null);
    }
  };
  
  const handleMappingFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setMappingFile(e.target.files[0]);
      setError(null);
      setErrorMessages(null);
    }
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setReportDate(e.target.value);
    setError(null);
    setErrorMessages(null);
  };
  
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setErrorMessages(null);
    setSuccessMessage(null);
    
    if (!dataFiles || dataFiles.length === 0) {
      setError("Please select at least one data file");
      return;
    }
    
    if (!mappingFile) {
      setError("Please select a mapping file");
      return;
    }
    
    try {
      setIsSubmitting(true);
      const response = await AgingReportApiClient.uploadAgingReportFiles(
        dataFiles, 
        mappingFile,
        reportDate // Pass the report date to the API
      );
      
      if (response.success) {
        setSuccessMessage("Files uploaded successfully!");
        // Reset form after successful submission
        setDataFiles(null);
        setMappingFile(null);
        
        // Reset file input fields
        const dataFilesInput = document.getElementById('dataFilesInput') as HTMLInputElement;
        const mappingFileInput = document.getElementById('mappingFileInput') as HTMLInputElement;
        if (dataFilesInput) dataFilesInput.value = '';
        if (mappingFileInput) mappingFileInput.value = '';
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
      <CContainer className="aging-report-container">
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
                      <CFormLabel htmlFor="reportDateInput">Report Date</CFormLabel>
                      <CInputGroup>
                        <CInputGroupText>
                          <i className="cil-calendar"></i>
                        </CInputGroupText>
                        <CFormInput
                          type="date"
                          id="reportDateInput"
                          value={reportDate}
                          onChange={handleDateChange}
                        />
                      </CInputGroup>
                      <CFormText>Date to use for calculations (defaults to today if not specified)</CFormText>
                    </CCol>
                  </CRow>
                  <CRow className="mb-3">
                    <CCol md={12}>
                      <CFormLabel htmlFor="dataFilesInput">Multiple Data Files (CSV format)</CFormLabel>
                      <CFormInput
                        type="file"
                        id="dataFilesInput"
                        multiple
                        accept=".csv"
                        onChange={handleDataFileChange}
                      />
                      {dataFiles && (
                        <div className="selected-files mt-2">
                          <p className="mb-1">Selected data files: {dataFiles.length}</p>
                          <ul className="file-list">
                            {Array.from(dataFiles).map((file, index) => (
                              <li key={index}>{file.name}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </CCol>
                  </CRow>
                  <CRow className="mb-3">
                    <CCol md={12}>
                      <CFormLabel htmlFor="mappingFileInput">Mapping File (CSV format)</CFormLabel>
                      <CFormInput
                        type="file"
                        id="mappingFileInput"
                        accept=".csv"
                        onChange={handleMappingFileChange}
                      />
                      {mappingFile && (
                        <div className="selected-files mt-2">
                          <p className="mb-1">Selected mapping file:</p>
                          <ul className="file-list">
                            <li>{mappingFile.name}</li>
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

export default AgingReport;