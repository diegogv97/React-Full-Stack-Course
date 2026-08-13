const Filter = ({ filterByName, setFilterByName }) => {
  return (
    <div>
      fillter shown with:{" "}
      <input
        value={filterByName}
        onChange={() => setFilterByName(event.target.value)}
      />
    </div>
  );
};

export default Filter;
