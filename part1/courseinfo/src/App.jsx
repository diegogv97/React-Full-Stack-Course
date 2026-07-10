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
  return (
    <>
      <p>Total exercises: {props.totalExercises}</p>
    </>
  )
}


const App = () => {
  const course = 'Half Stack application development'
  const part1 = 'Fundamentals of React'
  const exercises1 = 10
  const part2 = 'Using props to pass data'
  const exercises2 = 7
  const part3 = 'State of a component'
  const exercises3 = 14

  const parts = [
    {name: part1, exercises: exercises1},
    {name: part2, exercises: exercises2},
    {name: part3, exercises: exercises3},
  ]

  return (
    <>
    <Header courseName={course} />
    <br />
    <Content parts={parts} />
    <br />
    <Total totalExercises={exercises1 + exercises2 + exercises3} />
  </>
  )
}

export default App