import { useState, useEffect } from "react";
import Filter from "./components/Filter";
import PersonForm from "./components/PersonForm";
import People from "./components/People";
import peopleService from "./services/people";

const App = () => {
  const [people, setPeople] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [filterByName, setFilterByName] = useState("");

  useEffect(() => {
    peopleService.getAll().then((initialPeople) => {
      setPeople(initialPeople);
    });
  }, []);

  const updatePerson = (id, newPerson) => {
    peopleService.update(id, newPerson).then((updatedPerson) => {
      setPeople(
        people.map((p) => (p.id === updatedPerson.id ? updatedPerson : p)),
      );
    });
  };

  const createPerson = (newPerson) => {
    peopleService.create(newPerson).then((createdPerson) => {
      setPeople(people.concat(createdPerson));
    });
  };

  const handleSaveNewPerson = (event) => {
    event.preventDefault();

    const newPerson = {
      name: newName,
      number: newNumber,
    };

    const existingPerson = people.find((p) => p.name === newName);

    if (!existingPerson) {
      createPerson(newPerson);
      return;
    }

    const shouldOverwrite = window.confirm(
      `${newName} is already added to phonebook, replace the old number with the new one?`,
    );

    if (!shouldOverwrite) {
      return;
    }

    updatePerson(existingPerson.id, newPerson);
  };

  const handleDeletePerson = (id) => {
    const personToDelete = people.find((p) => p.id === id);
    const shouldDelete = window.confirm(`Delete ${personToDelete.name}?`);

    if (shouldDelete) {
      peopleService.deleteOne(id).then((deletedPerson) => {
        setPeople(people.filter((p) => p.id !== deletedPerson.id));
      });
    }
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

      <People
        people={people}
        filterByName={filterByName}
        deletePerson={handleDeletePerson}
      />
    </div>
  );
};

export default App;
