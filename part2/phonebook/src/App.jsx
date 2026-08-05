import { useState, useEffect } from "react";
import Filter from "./components/Filter";
import PersonForm from "./components/PersonForm";
import People from "./components/People";
import axios from "axios";

const App = () => {
  const [people, setPeople] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [filterByName, setFilterByName] = useState("");

  useEffect(() => {
    axios.get("http://localhost:3001/persons").then((response) => {
      setPeople(response.data);
    });
  }, []);

  const handleSaveNewPerson = (event) => {
    event.preventDefault();

    if (people.find((p) => p.name === newName)) {
      alert(`${newName} is alread added to phonebook`);
      return;
    }

    const newPeople = people.concat({
      name: newName,
      number: newNumber,
      id: people.length + 1,
    });
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
