const Card = ({title}) => {
  return (
    <div className="card">
      <h2>{title}</h2>
    </div>
  )
}

const App = () => {
  return (
    <div className="card-container">
      <Card title="Star Wars" />
      <Card title="The Matrix" />
      <Card title="The Lord of the Rings" />
      <h2>Functional Arrow Component</h2>
    </div>
  )
}

export default App
