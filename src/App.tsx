import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Dashboard from './Pages/Dashboard'
import SignIn from './Pages/SignIn'
import SignUp from './Pages/SignUp'
import ProtectedLayout from './Pages/ProtectedLayout'
import Profile from './Pages/Profile'
// import Plans from './Pages/Plans'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />

        {/* Protected Routes */}
        <Route element={<ProtectedLayout />}>
          <Route index path="/" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          {/* <Route path="/plans" element={<Plans />} /> */}
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
