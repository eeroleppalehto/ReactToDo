import React, { useState } from "react";

export default function Sort({sort, setSort}) {
  function handleChange(e) {
    // console.log(e.target.value);
    setSort(e.target.value);
  }

  const options = [
    { label: "A-Z", value: "az" },
    { label: "Z-A", value: "za" },
    { label: "Oldest", value: "oldest"},
    { label: "Newest", value: "newest"}
  ];

  return (
    <>
      <label>Sort:</label>
      <select value={sort} onChange={handleChange}>
      {options.map((option) => (
        <option value={option.value}>{option.label}</option>
      ))}
      </select>
    </>
  );
}
