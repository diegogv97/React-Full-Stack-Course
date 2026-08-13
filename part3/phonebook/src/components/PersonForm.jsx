const PersonForm = ({
  newName,
  setNewName,
  newNumber,
  setNewNumber,
  handleSaveNewPerson,
}) => {
  return (
    <form>
      <div>
        name:{" "}
        <input
          value={newName}
          onChange={() => setNewName(event.target.value)}
        />
      </div>
      <div>
        number:{" "}
        <input
          value={newNumber}
          onChange={() => setNewNumber(event.target.value)}
        />
      </div>
      <div>
        <button type="submit" onClick={handleSaveNewPerson}>
          add
        </button>
      </div>
    </form>
  );
};

export default PersonForm;
