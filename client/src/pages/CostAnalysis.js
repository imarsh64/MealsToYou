import {React, useEffect, useState} from "react";
import Header from '../components/header.js';
import { useNavigate } from "react-router-dom";



const Home = () => {

    const [miles, setMiles] = useState(0)
    const [fuelCost, setFuelCost] = useState(0)
    const [mpg, setMPG] = useState(0)

    let [totalCost, setTotalCost] = useState(0)

    let navigate = useNavigate();
    const routeHome = () =>{
        //this path leads home
        let path = `/`;
        navigate(path);
    }

    const calcTotalCost = () =>{
        setTotalCost((miles*fuelCost)/mpg);
    }
    const handleLengthChange = (event) =>{
        const value = event.target.value;
        setMiles(value);
        //calcTotalCost();
    }

    const handleFPChange = (event) =>{
        const value = event.target.value;
        setFuelCost(value);
        //calcTotalCost();
    }

    const handleMPGChange = async (event) =>{
        const value = event.target.value;
        setMPG(value);
        //calcTotalCost();
    }

    return (
        <div>
            <h1>This is the cost analysis page :]</h1>
            <label>
                Length of Route(miles): <input type="text" onChange={handleLengthChange} value={miles}/>
            </label>
            <div>
            <label>
                Fuel Price(per gallon): <input type="text" onChange={handleFPChange} value={fuelCost}/>
            </label>
            </div>
            <div>
            <label>
                Miles per Gallon: <input type="text" onChange={handleMPGChange} value={mpg}/>
            </label>
            </div>
            <button onClick={calcTotalCost}> Calculate Total </button>
            <pre>Calculated Cost: {totalCost}</pre>


            <button onClick={routeHome}> Return Home </button>

        </div>
    );
};

export default Home;
