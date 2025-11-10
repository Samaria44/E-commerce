import React from "react";
import "./productdetail.css";

export default function Button({ label, onClick }) {
  return (
    <button id="btn" onClick={onClick}>
      {label}
    </button>
  );
}
