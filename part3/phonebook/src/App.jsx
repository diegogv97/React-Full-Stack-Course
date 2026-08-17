import { useState, useEffect } from "react";
import Filter from "./components/Filter";
import PersonForm from "./components/PersonForm";
import People from "./components/People";
import peopleService from "./services/people";
import Notification from "./components/Notification";

const App = () => {
  const [people, setPeople] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [filterByName, setFilterByName] = useState("");
  const [notification, setNotification] = useState(null);

  const displayTempMessage = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 5000);
  };

  useEffect(() => {
    peopleService
      .getAll()
      .then((initialPeople) => {
        setPeople(initialPeople);
      })
      .catch(() => {
        displayTempMessage(`Something went wrong`, "error");
      });
  }, []);

  const updatePerson = (id, newPerson) => {
    peopleService
      .update(id, newPerson)
      .then((updatedPerson) => {
        setPeople(
          people.map((p) => (p.id === updatedPerson.id ? updatedPerson : p)),
        );
        displayTempMessage(
          `Modified ${updatedPerson.name} phone number`,
          "success",
        );
      })
      .catch((error) => {
        displayTempMessage(error, "error");
        setPeople(people.filter((p) => p.id !== id));
      });
  };

  const createPerson = (newPerson) => {
    peopleService
      .create(newPerson)
      .then((createdPerson) => {
        setPeople(people.concat(createdPerson));
        displayTempMessage(`Added ${createdPerson.name}`, "success");
      })
      .catch((error) => {
        displayTempMessage(error, "error");
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
      peopleService
        .deleteOne(id)
        .then(() => {
          setPeople(people.filter((p) => p.id !== id));
          displayTempMessage(`Deleted ${personToDelete.name}`, "success");
        })
        .catch(() => {
          displayTempMessage(
            `Information of ${personToDelete.name} has already been removed from the server`,
            "error",
          );
          setPeople(people.filter((p) => p.id !== personToDelete.id));
        });
    }
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification notification={notification} />

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
