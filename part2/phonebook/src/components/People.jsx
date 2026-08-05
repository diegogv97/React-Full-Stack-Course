const Person = ({ person, deletePerson }) => {
  return (
    <li>
      {person.name} {person.number}
      <button onClick={() => deletePerson(person.id)}>delete</button>
    </li>
  );
};

const People = ({ people, filterByName, deletePerson }) => {
  const peopleToShow = people.filter((person) =>
    person.name.includes(filterByName),
  );

  return (
    <ul>
      {peopleToShow.map((person) => (
        <Person key={person.id} person={person} deletePerson={deletePerson} />
      ))}
    </ul>
  );
};

export default People;
