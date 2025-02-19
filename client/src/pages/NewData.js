import React, { useState } from "react";
import Header from "../components/header.js";
import Sidebar from "../components/sidebar";
import "../styles/NewData.css"

const NewData = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [addresses, setAddresses] = useState([]);
    const [formData, setFormData] = useState({ street: "", zip: "", state: "", district: "" });

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setAddresses([...addresses, formData]);
        setFormData({ street: "", zip: "", state: "", district: "" });
    };

    return (
        <div>
            <Header onToggleSidebar={toggleSidebar} />
            <Sidebar isOpen={isSidebarOpen} />
            <main className={isSidebarOpen ? "sidebar-open" : ""}>
                <h1>Upload New Data</h1>
                <br />
                <div>
                    <form onSubmit={handleSubmit}>
                        <label htmlFor="street">Street</label>
                        <input type="text" id="street" name="street" value={formData.street} onChange={handleChange} required />
                        <label htmlFor="zip">Zip</label>
                        <input type="text" id="zip" name="zip" value={formData.zip} onChange={handleChange} required />
                        <label htmlFor="state">State</label>
                        <input type="text" id="state" name="state" value={formData.state} onChange={handleChange} required />
                        <label htmlFor="district">District</label>
                        <input type="text" id="district" name="district" value={formData.district} onChange={handleChange} required />
                        <input type="submit" value="Submit" />
                    </form>
                </div>
                <br />
                {addresses.length > 0 && (
                    <table border="1">
                        <thead>
                            <tr>
                                <th>Street</th>
                                <th>Zip</th>
                                <th>State</th>
                                <th>District</th>
                            </tr>
                        </thead>
                        <tbody>
                            {addresses.map((address, index) => (
                                <tr key={index}>
                                    <td>{address.street}</td>
                                    <td>{address.zip}</td>
                                    <td>{address.state}</td>
                                    <td>{address.district}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </main>
        </div>
    );
};

export default NewData;
