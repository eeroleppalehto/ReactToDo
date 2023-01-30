import React from "react";

// Generates a dropdown list that sorts the saved task by selected option
export default function Sort({sort, setSort}) {
  function handleChange(e) {
    setSort(e.target.value);
  }

  const options = [
    { label: "A-Z", value: "az" },
    { label: "Z-A", value: "za" },
    { label: "Oldest", value: "oldest"},
    { label: "Newest", value: "newest"}
  ];

  return (
    <div>
      <label className="todo-label">Sort: </label>
      <select value={sort} onChange={handleChange} class="sort">
      {options.map((option) => (
        <option value={option.value}>{option.label}</option>
      ))}
      </select>
    </div>
  );
}
