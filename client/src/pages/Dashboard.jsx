
import React from 'react'

const Dashboard = ({ setPage, test }) => (
  <div>
    <h1>Success!</h1>
    <button onClick={() => setPage(1)}>Search</button>
    <button>Pick a playlist</button>
    <button onClick={test}>Use your Top Tracks</button>
    <button>Use your library</button>
    <button onClick={() => setPage(4)}>Your Music Features</button>
  </div>
)

export default Dashboard;
