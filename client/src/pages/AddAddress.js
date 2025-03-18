
import React, { useState, useEffect } from "react";
import Header from '../components/header.js';
import Sidebar from "../components/sidebar";
import "../styles/addAddress.css";
import EditAddress from "../components/editAddress.js";
import { DataGrid , GridColDef } from '@mui/x-data-grid';

import { IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import CSVFileUpload from "../components/csvFileUpload.js";

const AddAddress = () => {

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [addresses, setAddresses] = useState([])
    const [district, setDistrict] = useState("");
    const [street, setStreet] = useState("");
    const [city, setCity] = useState("");
    const [zip, setZip] = useState("");
    const [adState, setAdState] = useState("");
    const [file, setFile] = useState("No file chosen");
    const [fileData, setFileData] = useState(null);
    const [formDistrict, setFormDistrict] = useState ("All");

    let oldDistr = -1;


    const districts = ["All", "1", "2", "3", "4"];
    const states = ["TX", "LA", "OK", "NM"];

    const columns: GridColDef<>[] = [

        {
            field: "edit",
            headerName: "Edit",
            width: 80,
            sortable: false,
            renderCell: (params) => (
                <EditAddress address={params.row} onClose={fetchAddr}/>
            ),
        },
        { 
            field: 'district', 
            headerName: 'District', 
            width: 130 
        },
        {
            field: 'street',
            headerName: 'Street',
            width: 150,
            editable: true,
        },
        {
            field: 'city',
            headerName: 'City',
            width: 150,
            editable: true,
        },
        {
            field: 'zip',
            headerName: 'Zip',
            type: 'number',
            width: 110,
            editable: true,
        },
        {
            field: 'adState',
            headerName: 'State',
            //description: 'This column has a value getter and is not sortable.',
            //sortable: false,
            width: 100
        },
        {
            field: "delete",
            headerName: "Delete",
            width: 80,
            sortable: false,
            renderCell: (params) => (
                <IconButton onClick={() => removeAddress(params.row.id)} color="error">
                    <DeleteIcon />
                </IconButton>
            ),
        },
    ];

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
    
    // immediately fetch and display addresses on page load
    useEffect(() => {
        fetchAddr(); 
    }, []);
        
    
    useEffect(() => {
        if( oldDistr !== formDistrict){
            fetchAddr();
            oldDistr = formDistrict;
        }
    }, [formDistrict]);

    function formatAddr(e){
        let newRows = []
        for(let i = 0; i < e.length; i++){
            let row = e[i]
            //TODO: replace distr number with call for distr name
            newRows.push({id: row[0], district: row[1], street: row[2], city: row[3], zip: row[4], adState: row[5]})
        }
        setAddresses(newRows)

    }

    async function submitAddr(event) {
        event.preventDefault(); 

        if (!/^\d{5}$/.test(zip)) {
            alert("Zip code must be exactly 5 digits.");
            return;
        }
    
        try {
            const response = await fetch("/upload_addr", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ district, street, city, zip, state: adState })
            });
    
            if (!response.ok) throw new Error("Failed to upload address");
    
            fetchAddr();
            clearFormValues();
        } catch (error) {
            console.error("Error submitting address:", error);
        }
    }


    async function fetchAddr() {
        const url = formDistrict === "All" || formDistrict === undefined
            ? "/get_all_addr"
            : `/get_addr?district=${formDistrict}`;
    
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error("Failed to fetch addresses");
    
            const result = await response.json();
            console.log(result.data);
            formatAddr(result.data);
        } catch (error) {
            console.error("Error fetching addresses:", error);
        }
    }

    function clearFormValues() {
 
        setDistrict("");
        setStreet("");
        setCity("");
        setZip("");
        setAdState("");
    }
    

    async function editAddress(id) {

        const url = `/edit_addr?id=${id}&district=${district}&street=${street}&zip${zip}&city${city}&state${adState}`;

        try {
            const response = await fetch(url);

            if (!response.ok) throw new Error("Failed to edit address");
    
            fetchAddr();
            clearFormValues();
        } catch (error) {
            console.error("Error editing address:", error);
        }
    }

    async function removeAddress(id) {
        if (!window.confirm("Are you sure you want to delete this address?")) return;
    
        try {
            const response = await fetch("/delete_addr", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id }),
            });
    
            if (!response.ok) throw new Error("Failed to delete address");
    
            // Refresh addresses after deletion
            fetchAddr();
        } catch (error) {
            console.error("Error deleting address:", error);
        }
    }

    const handleFileChange = (event) => {
        //setFile(event.target.files[0]);
        const selectedFile = event.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            const reader = new FileReader();

            reader.onload = (e) => {
                const content = e.target.result;
                setFileData(content); // Store the CSV content
            };
        reader.readAsText(selectedFile);
        }
    };

    /*
    const handleFileSubmit = () => {
        if (!file) {
          console.error("No file selected.");
          return;
        }
        pCSV(file);
    };*/

    /*
    const handleFileSubmit = (event) => {
        event.preventDefault();
        if (fileData) {
          console.log("CSV File Contents:");
          console.log(fileData);
          
        } else {
          console.log("No file uploaded or file is empty.");
        }
    };*/


    const handleFileSubmit = async (event) => {
        event.preventDefault();
        
        if (!fileData) {
            console.log("No file uploaded or file is empty.");
            return;
        }
    
        // Split fileData into rows and remove empty lines
        const rows = fileData.split("\n").map(row => row.split(",").map(item => item.trim())).filter(row => row.length >= 5);
    
        console.log("Parsed CSV Data:", rows);
    
        // Skip the header row and process each address
        for (let i = 1; i < rows.length; i++) {
            const [district, street, city, zip, state] = rows[i];
    
            if (!district || !street || !city || !zip || !state || !/^\d{5}$/.test(zip)) {
                console.warn(`Skipping invalid row at index ${i}:`, rows[i]);
                continue;
            }
    
            try {
                const response = await fetch("/upload_addr", {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 
                        district: Number(district), 
                        street, 
                        city, 
                        zip, 
                        state 
                    })
                });
    
                if (!response.ok) throw new Error(`Failed to upload row ${i}`);
    
                console.log(`Successfully uploaded row ${i}:`, rows[i]);
            } catch (error) {
                console.error(`Error uploading row ${i}:`, error);
            }
        }
    
        // Refresh addresses after upload
        fetchAddr();
    };
    

      
      const pCSV = (file) => {
        const reader = new FileReader();
    
        reader.onload = async ({ target }) => {
            const csvData = target.result;
            const rows = csvData.split("\n").map((row) => row.split(","));
    
            console.log("Raw CSV Rows:", rows); // Display the initial rows array
    
            // Skip the header row (first row)
            for (let i = 1; i < rows.length; i++) {
                const row = rows[i];
    
                // Skip empty rows or rows with missing data
                if (!row || row.length < 5) {
                    console.warn("Skipping row due to missing or incomplete data:", rows[i]);
                    continue;
                }
    
                const [district, street, city, zip, state] = row.map(item => item.trim()); // Trim whitespace
    
                // Display the parsed data for each row
                console.log(`Row ${i}:`);
                console.log(`  District: ${district}`);
                console.log(`  Street: ${street}`);
                console.log(`  City: ${city}`);
                console.log(`  Zip: ${zip}`);
                console.log(`  State: ${state}`);
                console.log("--------------------");
            }
    
            console.log("CSV parsing process completed.");
        };
    
        reader.readAsText(file);
    };




    return (
        <div>
            <Header onToggleSidebar={toggleSidebar}/>
            <Sidebar isOpen={isSidebarOpen} />
            <main className={isSidebarOpen ? "sidebar-open" : ""}>
            <h2> New Data</h2>
                <div>
                    <form onSubmit={submitAddr}>
                        <label htmlFor="street">Street</label>
                        <input type="text" id="street" value={street} onChange={(e) => setStreet(e.target.value)} required />
                        
                        <label htmlFor="city">City</label>
                        <input type="text" id="city" value={city} onChange={(e) => setCity(e.target.value)} required />

                        <label htmlFor="zip">Zip</label>
                        <input type="text" id="zip" value={zip} onChange={(e) => setZip(e.target.value)} required />

                        <label htmlFor="state">State</label>
                        <select id="state" value={adState} onChange={(e) => setAdState(e.target.value)} required>
                            <option value="">Select</option>
                            {states.map((state, index) => (
                                <option key={index} value={state}>{state}</option>
                            ))}
                        </select>

                        <label htmlFor="district">District</label>
                        <select id="district" value={district} onChange={(e) => setDistrict(e.target.value)} required>
                            <option value="">Select</option>
                            {districts.filter(dist => dist !== "All").map((dist, index) => (
                                <option key={index} value={dist}>{dist}</option>
                            ))}
                        </select>
                        
                        <button type="submit">Submit</button>
                    </form>
                </div>

                <div>
                    <CSVFileUpload onUpload={fetchAddr}/>
                </div>

                <h2> Addresses</h2>

                <label htmlFor="formDistrict">District</label>
                        <select id="formDistrict" value={formDistrict} onChange={(e) => setFormDistrict(e.target.value)}>                            
                            {districts.map((dist, index) => (
                                <option key={index} value={dist}>{dist}</option>
                            ))}
                </select>

                <div>
                <DataGrid
                        rows={addresses}
                        columns={columns}
                        initialState={{
                          pagination: {
                            paginationModel: {
                              pageSize: 5,
                            },
                          },
                        }}
                        pageSizeOptions={[5,10]}
                        checkboxSelection
                        disableRowSelectionOnClick
                      />
                </div>
            </main>
        </div>
    );
};

export default AddAddress;
