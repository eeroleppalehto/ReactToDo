import React, { useState } from "react";

export default function Sort({setSort}) {
  function handleChange(e) {
    console.log(e.target.value);
    setSort(e.target.value);
  }

  const options = [
    { label: "A-Z", value: "a-z" },
    { label: "Z-A", value: "z-a" },
  ];

  return (
    <>
      <label for="cars">Sort:</label>
      <select value={""} onChange={handleChange}>
      {options.map((option) => (
        <option value={option.value}>{option.label}</option>
      ))}
      </select>
    </>
  );
}
