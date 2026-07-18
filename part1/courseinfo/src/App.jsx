const Header = (props) => {
  return (
    <>
      <h1>{props.courseName}</h1>
    </>
  )
}

const Part = (props) => {
  return (
    <>
      <h2>Part: {props.part.name}</h2>
      <h3>Number of exercises: {props.part.exercises}</h3>
    </>
  )
}

const Content = (props) => {
  return (
    <div>
      <Part part={props.parts[0]}/>
      <br />
      <Part part={props.parts[1]}/>
      <br />
      <Part part={props.parts[2]}/>
    </div>
  )
}

const Total = (props) => {
  const totalExercises = props.parts.reduce((prevValue, currentPart)=> prevValue+ currentPart.exercises, 0);

  return (
    <>
      <p>Total exercises: {totalExercises}</p>
    </>
  )
}


const App = () => {
  const course = {
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10
      },
      {
        name: 'Using props to pass data',
        exercises: 7
      },
      {
        name: 'State of a component',
        exercises: 14
      }
    ]
  }


  return (
    <>
    <Header courseName={course.name} />
    <br />
    <Content parts={course.parts} />
    <br />
    <Total parts={course.parts} />
  </>
  )
}

export default App