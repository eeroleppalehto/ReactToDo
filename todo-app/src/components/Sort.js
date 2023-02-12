import React from "react";

// Generates a dropdown list that sorts the saved task by selected option
export default function Sort({sort, setSort, sortOptions}) {
  function handleChange(e) {
    setSort(e.target.value);
  }

  return (
    <div>
      <label className="todo-label">Sort: </label>
      <select value={sort} onChange={handleChange} className="sort">
      {sortOptions.map((option) => (
        <option value={option.value}>{option.label}</option>
      ))}
      </select>
    </div>
  );
}
