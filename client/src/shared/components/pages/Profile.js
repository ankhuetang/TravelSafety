import React from "react";
import Alerts from "../alerts/Alerts";
import AlertForm from "../alerts/AlertForm";
import AlertFilter from "../alerts/AlertFilter";

const Profile = () => {
  return (
    <div className="grid-2">
      <div>
        <AlertForm />
      </div>
      <div>
        <AlertFilter />
        <Alerts />
      </div>
    </div>
  );
};

export default Profile;
