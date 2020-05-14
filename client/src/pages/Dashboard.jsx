
import React from 'react'

const Dashboard = ({ setStatus }) => (
  <div>
    <h1>Success!</h1>
    <button onClick={() => setStatus(true)}>Get Top Tracks</button>
  </div>
)

export default Dashboard;
