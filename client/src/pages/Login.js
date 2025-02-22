
import React, { useState } from "react";
import Header from '../components/header.js';
import "../styles/header.css";
import {useNavigate} from "react-router-dom";

const Login = () => {

    let navigate = useNavigate();
    const [uname, setUsername] = useState("")

    const [pword, setPassword] = useState("")

    const handleNameChange = (event) =>{
        const value = event.target.value;
        setUsername(value);
        //calcTotalCost();
    }
    const handlePWordChange = (event) =>{
        const value = event.target.value;
        setPassword(value);
        //calcTotalCost();
    }
    //
    const routeHome = () =>{
        //this path leads home
        let path = `/`;
        navigate(path);
    }

    function routeLogin() {
        //currntly scuffed fetching from localhost, add environment variables with where to go later
        fetch("/login",
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({username: uname, password: pword})

            }).then(resp  => resp.json())
            .then(result=>{
                //Currently, this api ALWAYS returns true bc it has nothing better to do
                if(result.data === true){
                    /*TODO: make this routeHome use correct user stuff
                    TODO: Can probably get this by setting a local uservalue*/
                    routeHome()
                }
            });
    }
    return (
        <div>

            <main>
                <h1>Please Login (or else)</h1>

            </main>

                <div>
                <label>
                Username: <input type="text" onChange={handleNameChange} value={uname}/>
                </label>
                </div>
                <div>
                <label>
                Password: <input type="text" onChange={handlePWordChange} value={pword}/>
                </label>
                </div>
                {/* this button needs to make a call to the api for login */}
                <button onClick={routeLogin}> Login </button>


        </div>
    );
};

export default Login;
