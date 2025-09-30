import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Layout from './Pages/Layout'
import SignIn from './Pages/SignIn'
import SignUp from './Pages/SignUp'
import ProtectedLayout from './Pages/ProtectedLayout'
import Profile from './Pages/Profile'
import EditAccount from './Pages/EditAccount'
import ResetPass from './Pages/ResetPass'
import UpdatePass from './Pages/updatepass'
import Plans from './Pages/Plans'
import Transactions from './Pages/Transactions'
import UserUsage from './Pages/UserUsage'
import TicketsPage from './Pages/Tickets/TicketsPage'
import CreateTicketForm from './Pages/Tickets/CreateTicketForm'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/reset-password" element={<ResetPass />} />

        {/* Protected Routes */}
        <Route element={<ProtectedLayout />}>
          <Route path="/update-password" element={<UpdatePass />} />
          <Route element={<Layout />}>
            <Route path="/" element={<Profile />} />
            <Route path="/edit-account" element={<EditAccount />} />
            <Route path="/plans" element={<Plans />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/usage" element={<UserUsage />} />
            <Route path="/ticket" element={<TicketsPage />}>
              <Route path=":ticketId" element={<TicketsPage />} />
              <Route path="new" element={<CreateTicketForm onClose={() => { }} />} />
            </Route>
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
