import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";

// import Button from "@mui/material/Button";
// import jwt_decode from "jwt-decode";

import { BACKEND_URL } from "../constants";

const AddContractForm = () => {
  const [description, setDescription] = useState("");
  const [amountSgd, setAmountSgd] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [noOfPostRequired, setNoOfPostRequired] = useState("");
  const [creatorId, setCreatorId] = useState(1); // set 1 to reflect default value for first dropdown value
  const [creators, setCreators] = useState([]);

  const { getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    // get updated list of creators
    getCreators();
    return;
  }, []);

  const getCreators = async () => {
    const res = await axios.get(`${BACKEND_URL}/creators/nameAndTiktokHandle`);
    setCreators(res.data);
    // console.log(res.data);
  };

  // creator name dropdown list values
  let creatorsDropdownList = creators.map((creator, ind) => {
    return (
      <option
        key={ind}
        value={creator.id}
      >{`${creator.name} (${creator.tiktok_handle})`}</option>
    );
  });

  const handleChange = (event) => {
    switch (event.target.name) {
      case "description":
        setDescription(event.target.value);
        break;
      case "amountSgd":
        setAmountSgd(event.target.value);
        break;
      case "startDate":
        setStartDate(event.target.value);
        break;
      case "endDate":
        setEndDate(event.target.value);
        break;
      case "noOfPostRequired":
        setNoOfPostRequired(event.target.value);
        break;
      case "creators":
        setCreatorId(event.target.value);
        break;
      default:
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Retrieve access token
      const accessToken = await getAccessTokenSilently({
        audience: process.env.REACT_APP_API_AUDIENCE,
        scope: "write:contract",
      });

      // var decoded = jwt_decode(accessToken);
      // console.log(accessToken);
      // console.log(decoded);

      await axios.post(
        `${BACKEND_URL}/contracts`,
        {
          description,
          amountSgd,
          startDate,
          endDate,
          noOfPostRequired,
          creatorId,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
    } catch (e) {
      console.log(e.message);
    }

    setDescription("");
    setAmountSgd("");
    setStartDate("");
    setEndDate("");
    setNoOfPostRequired("");
    setCreatorId("");
  };

  // mindate input
  const currDate = new Date().toLocaleDateString("fr-ca");

  return (
    <div>
      {/* {console.log(currDate)} */}
      Add Contract
      <br />
      <br />
      <form onSubmit={handleSubmit}>
        Description:{" "}
        <input
          type="text"
          name="description"
          value={description}
          onChange={handleChange}
          minLength="8"
          required
        />
        <br />
        {"Amount ($SGD):"}{" "}
        <input
          type="number"
          name="amountSgd"
          value={amountSgd}
          onChange={handleChange}
          min="1"
          step="0.01"
          required
        />
        <br />
        Start Date:{" "}
        <input
          type="date"
          name="startDate"
          value={startDate}
          min={currDate}
          onChange={handleChange}
          required
        />
        <br />
        End Date:{" "}
        <input
          type="date"
          name="endDate"
          value={endDate}
          min={startDate}
          onChange={handleChange}
          required
        />
        <br />
        Number Of Post Required:{" "}
        <input
          type="number"
          name="noOfPostRequired"
          value={noOfPostRequired}
          onChange={handleChange}
          min="1"
          required
        />
        <br />
        Creator:{" "}
        <select name="creators" onChange={handleChange}>
          {creatorsDropdownList}
        </select>
        <br />
        <input type="submit" value="Submit" />
      </form>
    </div>
  );
};

export default AddContractForm;
