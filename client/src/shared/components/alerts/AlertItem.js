import React from "react";
import "@fortawesome/fontawesome-free/css/all.css";
const AlertItem = ({ alert }) => {
  // Destructure field address inside alert, rename it to location
  const { address: location, duration, radius } = alert;
  // console.log("AlertItem component called");
  // console.log("AlertItem is", alert);
  // console.log(location);

  return (
    <div className="card bg-light">
      <h3 className="text-primary text-left">{`Alert #${id}`}</h3>
      <ul className="list">
        {location && (
          <li>
            <i className="fa-solid fa-location-dot"></i> {" Location: "}
            {location}
          </li>
        )}
        {radius && (
          <li>
            <i className="fa-solid fa-ruler"></i> {" Radius: "} {radius} {" Km"}
          </li>
        )}
        {duration && (
          <li>
            <i className="fa-solid fa-clock"></i> {" Duration: "} {duration}
            {" days"}
          </li>
        )}
      </ul>
    </div>
  );
};

export default AlertItem;
