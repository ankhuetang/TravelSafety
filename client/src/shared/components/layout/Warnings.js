import React, { useContext } from "react";
import WarningContext from "../../../context/warning/WarningContext";

const Warnings = () => {
  const warningContext = useContext(WarningContext);

  return (
    warningContext.warnings.length > 0 &&
    warningContext.warnings.map((warning) => (
      <div key={warning.id} className={`alert alert-${warning.type}`}>
        <i className="fas fa-info-circle"></i> {warning.msg}
      </div>
    ))
  );
};

export default Warnings;
