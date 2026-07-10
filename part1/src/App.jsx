const Header = (props) => {
  return (
    <>
    <h1>{props.courseName}</h1>
    </>
  )
}

const Content = (props) => {
  return (
    <>
    <h2>Part: {props.part}</h2>
    <h3>Number of exercises: {props.numExercises}</h3>
    </>
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

  return (
    <>
    <Header courseName={course} />
    <br />
    <Content part={part1} numExercises={exercises1} />
    <br />
    <Content part={part2} numExercises={exercises2} />
    <br />
    <Content part={part3} numExercises={exercises3} />
    <br />
    <Total totalExercises={exercises1 + exercises2 + exercises3} />
  </>
  )
}

export default App