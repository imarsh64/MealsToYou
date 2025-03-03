
import React, { useState, useEffect } from "react";
import Header from '../components/header.js';
import Sidebar from "../components/sidebar";
import "../styles/addAddress.css";
import { DataGrid , GridColDef } from '@mui/x-data-grid';

const AddAddress = () => {

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [addresses, setAddresses] = useState([])
    const [district, setDistrict] = useState(0);
    const [street, setStreet] = useState("");
    const [city, setCity] = useState("");
    const [zip, setZip] = useState("");
    const [adState, setAdState] = useState("");


    let oldDistr = -1;
    const districts = [1, 2, 3, 4, 5];
    const states = ["TX", "LA", "OK", "NM"];

    const columns: GridColDef<>[] = [

        { field: 'district', headerName: 'District', width: 130 },
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
    ];
    useEffect(() => {
        if(oldDistr !== district) {
            fetchAddr()
            oldDistr = district
        }
    }, [district]);

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
        } catch (error) {
            console.error("Error submitting address:", error);
        }
    }

    async function fetchAddr() {
        try {
            const response = await fetch("/get_addr", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ district })
            });
        
            if (!response.ok) throw new Error("Failed to fetch addresses");
        
            const result = await response.json();
            console.log(result.data);
            formatAddr(result.data);
        } catch (error) {
            console.error("Error fetching addresses:", error);
        }
    }

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    // immediately fetch and display addresses on page load
    useEffect(() => {
        fetchAddr(); 
    }, []);

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
                        <select id="district" value={district} onChange={(e) => setDistrict(Number(e.target.value))} required>
                            <option value="">Select</option>
                            {districts.map((dist, index) => (
                                <option key={index} value={dist}>{dist}</option>
                            ))}
                        </select>
                        
                        <button type="submit">Submit</button>
                    </form>
                </div>

                <h2> Addresses</h2>

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
