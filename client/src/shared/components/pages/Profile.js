// CHANGE THIS!!!
import React, { useContext, useEffect } from "react";
import Alerts from "../alerts/Alerts";
import AlertForm from "../alerts/AlertForm";
import AlertFilter from "../alerts/AlertFilter";
import AuthContext from "../../../context/auth/AuthContext";

const Profile = () => {
  const authContext = useContext(AuthContext);

  useEffect(() => {
    console.log("Profile is calling loadUser()");
    authContext.loadUser();
    // eslint-disable-next-line
  }, []);

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
