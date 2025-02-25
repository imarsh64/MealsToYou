
import React, { useState } from "react";
import Header from '../components/header.js';
import Sidebar from "../components/sidebar";
import { DataGrid , GridColDef } from '@mui/x-data-grid';

const AddAddress = () => {

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [addresses, setAddresses] = useState([])
    const [district, setDistrict] = useState(1);
    const [street, setStreet] = useState("hi");
    const [city, setCity] = useState("e");
    const [zip, setZip] = useState("e");
    const [adState, setAdState] = useState("e");

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


    function formatAddr(e){
        let newRows = []
        for(let i = 0; i < e.length; i++){
            let row = e[i]
            //TODO: replace distr number with call for distr name
            newRows.push({id: row[0], district: row[1], street: row[2], city: row[3], zip: row[4], adState: row[5]})
        }
        setAddresses(newRows)

    }
    function submitAddr(){
        fetch("/upload_addr",
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({district: district, street: street, city: city, zip: zip, state: adState})
            }).then(fetchAddr);
    }

    function fetchAddr() {
        //currently scuffed fetching from localhost, add environment variables with where to go later
        fetch("/get_addr",
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({district: district})

            }).then(resp  => resp.json())
            .then(result=>{
                console.log(result.data)
                formatAddr(result.data)
            });
    }

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    return (
        <div>
            <Header onToggleSidebar={toggleSidebar}/>
            <Sidebar isOpen={isSidebarOpen} />
            <main className={isSidebarOpen ? "sidebar-open" : ""}>
                <div>
                    <button onClick={fetchAddr}> Test </button>
                    <button onClick={submitAddr}> Enter </button>
                </div>
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
                        pageSizeOptions={[5]}
                        checkboxSelection
                        disableRowSelectionOnClick
                      />
                </div>
            </main>
        </div>
    );
};

export default AddAddress;
