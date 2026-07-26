import { useState } from 'react'

const Button = ({handleClick, text}) => {
  return (
    <>
      <button onClick={handleClick}>{text}</button>
    </>
  )
}

const StatisticLine = ({text, value}) => {
  return (
    <>
    <tr>
      <td>{text}</td>
      <td>{value}</td>
    </tr>
    </>
  )
}

const Statistics = ({statistics}) => {
  const {good, neutral, bad} = statistics
  const total = good + neutral + bad;
  
  if(total === 0){
    return (
      <>
        <p>No feedback given</p>
      </>
    )
  }

  const average = ((good * 1) + (neutral * 0) + (bad * -1)) / total
  const positive = total > 0? (good / total) * 100 : 0;

  return (
  <>
    <table>
      <StatisticLine text={'good'} value={good}/>
      <StatisticLine text={'neutral'} value={neutral}/>
      <StatisticLine text={'bad'} value={bad}/>
      <StatisticLine text={'total'} value={total}/>
      <StatisticLine text={'average'} value={average}/>
      <StatisticLine text={'positive'} value={positive+ '%'}/>
    </table>
  </>
  )
}

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  return (
    <>
      <h1>give feedback</h1>
      <Button handleClick={() => setGood(good + 1)} text={'good'}/>
      <Button handleClick={() => setNeutral(neutral + 1)} text={'neutral'}/>
      <Button handleClick={() => setBad(bad + 1)} text={'bad'}/>

      <h1>statistics</h1>
      <Statistics statistics={{good, neutral, bad}}/>
    </>
  )
}

export default App