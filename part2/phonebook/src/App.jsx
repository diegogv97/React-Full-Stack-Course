import { useState } from "react";

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

const Person = ({ person }) => {
  return (
    <p>
      {person.name} {person.phoneNumber}
    </p>
  );
};

const People = ({ people, filterByName }) => {
  const peopleToShow = people.filter((person) =>
    person.name.includes(filterByName),
  );

  return (
    <ul>
      {peopleToShow.map((person) => (
        <Person key={person.name} person={person} />
      ))}
    </ul>
  );
};

const App = () => {
  const [people, setPeople] = useState([{ name: "", phoneNumber: "" }]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [filterByName, setFilterByName] = useState("");

  const handleSaveNewPerson = (event) => {
    event.preventDefault();

    if (people.find((p) => p.name === newName)) {
      alert(`${newName} is alread added to phonebook`);
      return;
    }

    const newPeople = people.concat({ name: newName, phoneNumber: newNumber });
    setPeople(newPeople);
  };

  return (
    <div>
      <h2>Phonebook</h2>

      <Filter filterByName={filterByName} setFilterByName={setFilterByName} />

      <h2>add a new</h2>

      <PersonForm
        newName={newName}
        setNewName={setNewName}
        newNumber={newNumber}
        setNewNumber={setNewNumber}
        handleSaveNewPerson={handleSaveNewPerson}
      />

      <h2>Numbers</h2>

      <People people={people} filterByName={filterByName} />
    </div>
  );
};

export default App;
