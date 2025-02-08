import React, { useState } from "react";
import Header from '../components/header.js';
import Sidebar from "../components/sidebar";

const Home = () => {

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    return (
        <div>
            <Header onToggleSidebar={toggleSidebar}/>
            <Sidebar isOpen={isSidebarOpen} />
            <main>
                <h1>This is the homepage</h1>
            </main>
        </div>
    );
};

export default Home;
