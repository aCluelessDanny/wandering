
import React from 'react'

const Dashboard = ({ setStatus }) => (
  <div>
    <h1>Success!</h1>
    <button onClick={() => setStatus(3)}>Get Top Tracks</button>
  </div>
)

export default Dashboard;
