import React from "react";
import "../../styles/loader.css";

function Loader({ loading, style }) {
  if (!loading) {
    return;
  }
  return <div style={{ ...style }} className="loader"></div>;
}

export default Loader;
