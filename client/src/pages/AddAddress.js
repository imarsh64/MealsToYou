
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

    return (
        <div>
            <Header onToggleSidebar={toggleSidebar}/>
            <Sidebar isOpen={isSidebarOpen} />
            <main className={isSidebarOpen ? "sidebar-open" : ""}>
            <h1>Add Addresses</h1>
            <h2> Enter Data</h2>
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
                    <h2> Upload data from .csv file</h2>
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
