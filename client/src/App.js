import React, {useState, useEffect} from 'react';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home.js";
import Cost from "./pages/CostAnalysis.js"
import Login from "./pages/Login.js"
import AddAddress from "./pages/AddAddress";
function App(){

    const [data, setData] = useState([{}])
    useEffect(() => {
        fetch("/hi").then(
        res => res.json()
    ).then(
        data  => {
            console.log("egg")
            setData(data)
            console.log(data)
        })
    }, [])
    return(
        <Router>
            <Routes>
                {/* Cot Analysis Route*/}
                <Route path="/Cost" element={<Cost />} />

                {/* Login page route */}
                <Route path="/Login" element={<Login />} />

                {/* Add Addrs page route */}
                <Route path="/Address" element={<AddAddress />} />

                {/* Home Page Route */}
                <Route path="/" element={<Home />} />

                {/* Profile Page Route */}
                <Route path="/Profile" element={<Home />} />

                {/* Settings Page Route */}
                <Route path="/Settings" element={<Home />} />

                {/* Data Fetching Page */}
                <Route
                    path="/data"
                    element={
                        <div>
                            {typeof data.hi === "undefined" ? (
                                <p>Loading...</p>
                            ) : (
                                data.hi.map((piece, i) => <p key={i}>{piece}</p>)
                            )}
                        </div>
                    }
                />
            </Routes>
        </Router>
    )
}


export default App