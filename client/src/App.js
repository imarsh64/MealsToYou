import React, {useState, useEffect} from 'react';

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
        <div>
            {(typeof data.hi === "undefined") ? (
                <p>Loading...</p>
            ) : (
                data.hi.map((piece, i) =>(
                    <p key={i}>{piece}</p>
                ))
            )}


        </div>
    )
}


export default App