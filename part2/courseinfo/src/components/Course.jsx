const Header = (props) => <h1>{props.course}</h1>;

const Part = (props) => (
  <p>
    {props.part.name} {props.part.exercises}
  </p>
);

const Content = ({ parts }) => (
  <div>
    {parts.map((part) => (
      <Part key={part.id} part={part} />
    ))}
  </div>
);

const Total = (props) => <p>total of {props.total} excersises</p>;

const Course = ({ course }) => {
  return (
    <>
      <Header course={course.name} />
      <Content parts={course.parts} />
      <Total
        total={course.parts.reduce((acc, part) => acc + part.exercises, 0)}
      />
    </>
  );
};
export default Course;
