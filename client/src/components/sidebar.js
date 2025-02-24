import React from "react";
import "../styles/sidebar.css";

function Sidebar({isOpen}) {
    return (
        <nav className={`sidebar ${isOpen ? "open" : ""}`}>
            <ul>
                <li><a href="/">Home</a></li>
                <li><a href="/Profile">Profile</a></li>
                <li><a href="/Settings">Settings</a></li>
                <li><a href="/Login">Logout</a></li>
                <li><a href="/Address">Add Addresses</a></li>
            </ul>
        </nav>
    );
}
export default Sidebar;
