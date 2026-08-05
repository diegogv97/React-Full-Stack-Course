const Person = ({ person }) => {
  return (
    <p>
      {person.name} {person.number}
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
        <Person key={person.id} person={person} />
      ))}
    </ul>
  );
};

export default People;
