import React, { useState } from "react";

const CSVFileUpload = ({ onUpload }) => {
  const [file, setFile] = useState(null);
  const [fileContent, setFileContent] = useState(""); // Store file data

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile && selectedFile.type === "text/csv") {
      setFile(selectedFile);
      
      // Read file content
      const reader = new FileReader();
      reader.onload = (e) => setFileContent(e.target.result);
      reader.readAsText(selectedFile);
    } else {
      alert("Please upload a valid CSV file.");
      setFile(null);
      setFileContent("");
    }
  };

  const handleFileSubmit = async (event) => {
    event.preventDefault();
    
    if (!fileContent) {
      console.log("No file uploaded or file is empty.");
      return;
    }

    // Process CSV content
    /*
    const rows = fileContent
      .split("\n")
      //.map(row => row.split("\t").map(item => item.trim().replace(/^"|"$/g, "")))  // Remove leading and trailing quotes
      .map(row => row.split("\t").map(item => item.trim()))  // Remove leading and trailing quotes
      .filter(row => row.length >= 5);*/

      // Check for tab-separated values (\t) instead of commas
    const delimiter = fileContent.includes("\t") ? "\t" : ",";
  
    const rows = fileContent
        .trim()
        .split("\n")
        .map(row => row.split(delimiter).map(item => item.trim().replace(/^"|"$/g, "")));


    console.log("Parsed CSV Data:", rows);

    for (let i = 1; i < rows.length; i++) {
      const [district, street, city, zip, adState] = rows[i];

      if (!district || !street || !city || !zip || !adState || !/^\d{5}$/.test(zip)) {
        console.warn(`Skipping invalid row at index ${i}:`, rows[i]);
        continue;
      }

      try {

        const response = await fetch("/upload_addr", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ district, street, city, zip, state: adState })
        });

        if (!response.ok) throw new Error(`Failed to upload row ${i}`);

        console.log(`Successfully uploaded row ${i}:`, rows[i]);
      } catch (error) {
        console.error(`Error uploading row ${i}:`, error);
      }
    }
    
    if (onUpload) onUpload();
  };

  return (
    <div>
      <form id="upload-form" onSubmit={handleFileSubmit}>
        <input type="file" accept=".csv" onChange={handleFileChange} />
        <button type="submit" disabled={!file}>Upload CSV</button>
      </form>
    </div>
  );
};

export default CSVFileUpload;
