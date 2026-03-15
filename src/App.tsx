import { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'
import Login from "./Login/Login"
import DashBoard from './DashBoard/DashBoard'

function App() {

  const [loggedIn, setLoggedIn] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setLoggedIn(!!session); //Convert session to boolean
    })
  }, []);

  if (loggedIn)
    return <DashBoard setLoggedInProp={setLoggedIn} />
  else
    return <Login setLoggedInProp={setLoggedIn} />
}

export default App
