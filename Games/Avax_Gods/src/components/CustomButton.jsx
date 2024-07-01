import React from "react";
import styles from "../styles";
const CustomButton = ({ title, handleClick, restType }) => {
  return (
    <button
      type="button"
      className={`${styles.btn} ${restType}`}
      onClick={handleClick}
    >{title}</button>
  );
};

export default CustomButton;
