
import React, { useState, useEffect } from "react";
import Header from '../components/header.js';
import Sidebar from "../components/sidebar";
import { DataGrid , GridColDef } from '@mui/x-data-grid';

import { IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const RouteEditor = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [routes, setRoutes] = useState([])


    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    const columns: GridColDef<>[] = [

        {
            field: "edit",
            headerName: "Edit",
            width: 80,
            sortable: false,
            renderCell: (params) => (
                <IconButton color="error">
                    <EditIcon />
                </IconButton>
            ),
        },
        { 
            field: 'district', 
            headerName: 'District', 
            width: 130 
        },
        {
            field: 'routeTitle',
            headerName: 'Route Title',
            width: 150,
            editable: true,
        },
        {
            field: 'addressCnt',
            headerName: 'Address Count',
            width: 150,
            editable: true,
        },
        {
            field: "delete",
            headerName: "Delete",
            width: 80,
            sortable: false,
            renderCell: (params) => (
                <IconButton color="error">
                    <DeleteIcon />
                </IconButton>
            ),
        },
    ];

    

    return (
        <div>
            <Header onToggleSidebar={toggleSidebar}/>
            <Sidebar isOpen={isSidebarOpen} />
            <main className={isSidebarOpen ? "sidebar-open" : ""}>
                <h1>Add Routes</h1>
                <h2> Enter Data</h2>


                <div>
                    <DataGrid
                        rows={routes}
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

export default RouteEditor;
