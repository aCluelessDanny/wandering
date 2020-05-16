
import React from 'react'

const Dashboard = ({ test }) => (
  <div>
    <h1>Success!</h1>
    <button>Search</button>
    <button>Pick a playlist</button>
    <button onClick={test}>Use your Top Tracks</button>
    <button>Use your library</button>
    <button>Your Music Features</button>
  </div>
)

export default Dashboard;
