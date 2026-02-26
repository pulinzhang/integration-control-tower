import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import Overview from './pages/Overview'
import IntegrationFlows from './pages/IntegrationFlows'
import MessageCenter from './pages/MessageCenter'
import GovernanceRules from './pages/GovernanceRules'
import ErrorControl from './pages/ErrorControl'
import TCCSimulation from './pages/TCCSimulation'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/overview" replace />} />
          <Route path="overview" element={<Overview />} />
          <Route path="integrations" element={<IntegrationFlows />} />
          <Route path="governance" element={<GovernanceRules />} />
          <Route path="messages" element={<MessageCenter />} />
          <Route path="errors" element={<ErrorControl />} />
          <Route path="tcc" element={<TCCSimulation />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
