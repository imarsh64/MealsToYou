import { IconButton } from "@mui/material";
import React, { useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";

const EditAddress = ({ address , onClose}) => {
  const [street, setStreet] = useState(address.street);
  const [city, setCity] = useState(address.city);
  const [zip, setZip] = useState(address.zip);
  const [adState, setAdState] = useState(address.adState);
  const [district, setDistrict] = useState(address.district);

  const states = ["TX", "LA", "OK", "NM"];
  const districts = [1, 2, 3, 4];

  const handleSubmit = async (event, close) => {
    event.preventDefault();
    const updatedData = { district, street, city, zip, adState };
  
    try {
      await editAddress(address.id, updatedData); 
  
      if (onClose) {
        onClose();  // Call fetchAddr from the main page
      }
      
      close(); 
    } catch (error) {
      console.error("Failed to edit address:", error);
    }
  };

  async function editAddress(id, updatedData) {
    const url = `/edit_addr?id=${id}&district=${updatedData.district}&street=${updatedData.street}&zip=${updatedData.zip}&city=${updatedData.city}&state=${updatedData.adState}`;

    try {
        const response = await fetch(url, { method: "PATCH" });
        if (!response.ok) throw new Error("Failed to edit address");
        
    } catch (error) {
        console.error("Error editing address:", error);
    }
}

  return (
    <Popup trigger={<IconButton><EditIcon /></IconButton>} modal nested>
      {(close) => (
        <div className="modal">
          <div className="content">
            <h3>Edit Address ID: {address.id}</h3>
            <form onSubmit={(event) => handleSubmit(event, close)}>
              <label htmlFor="street">Street</label>
              <input type="text" id="street" value={street} onChange={(e) => setStreet(e.target.value)} required />

              <label htmlFor="city">City</label>
              <input type="text" id="city" value={city} onChange={(e) => setCity(e.target.value)} required />

              <label htmlFor="zip">Zip</label>
              <input type="text" id="zip" value={zip} onChange={(e) => setZip(e.target.value)} required />

              <label htmlFor="state">State</label>
              <select id="state" value={adState} onChange={(e) => setAdState(e.target.value)} required>
                {states.map((state, index) => (
                  <option key={index} value={state}>{state}</option>
                ))}
              </select>

              <label htmlFor="district">District</label>
              <select id="district" value={district} onChange={(e) => setDistrict(Number(e.target.value))} required>
                {districts.map((dist, index) => (
                  <option key={index} value={dist}>{dist}</option>
                ))}
              </select>

              <button type="submit">Submit</button>
              <button type="button" onClick={close}>Cancel</button>
            </form>
          </div>
        </div>
      )}
    </Popup>
  );
};

export default EditAddress;
