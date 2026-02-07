import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Layout from './components/layout/Layout'
import Dashboard from './pages/Dashboard'
import Projects from './pages/Projects'
import Scenarios from './pages/Scenarios'
import Analysis from './pages/Analysis'
import SessionDetail from './pages/SessionDetail'
import Requirements from './pages/Requirements'
import WricefItems from './pages/WricefItems'
import ConfigItems from './pages/ConfigItems'
import TestManagement from './pages/TestManagement'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/scenarios" element={<Scenarios />} />
            <Route path="/analysis" element={<Analysis />} />
            <Route path="/sessions/:id" element={<SessionDetail />} />
            <Route path="/requirements" element={<Requirements />} />
            <Route path="/wricef" element={<WricefItems />} />
            <Route path="/config" element={<ConfigItems />} />
            <Route path="/tests" element={<TestManagement />} />
            <Route path="/tests/:type" element={<TestManagement />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App
