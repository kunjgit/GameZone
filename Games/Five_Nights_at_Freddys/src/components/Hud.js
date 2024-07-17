import React from "react";
import { connect } from "react-redux";

function Hud({ hour, energy }) {
  return (
    <div style={{ zIndex: 10 }}>
      <h1 className="hour">{hour === 0 ? "12AM" : `${hour}AM`}</h1>
      <h2 className="energy">{energy}%</h2>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    hour: state.configReducer.hour,
    energy: state.configReducer.energy,
  };
};

export default connect(mapStateToProps)(Hud);
