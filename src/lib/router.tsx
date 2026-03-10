import { createBrowserRouter } from 'react-router-dom'
import AppLayout from '@/components/AppLayout'
import DashboardPage from '@/pages/DashboardPage'
import LeanCanvasPage from '@/pages/LeanCanvasPage'
import GoldenCirclePage from '@/pages/GoldenCirclePage'
import PersonasPage from '@/pages/PersonasPage'
import PersonaDetailPage from '@/pages/PersonaDetailPage'
import ValuePropPage from '@/pages/ValuePropPage'
import PitchDeckPage from '@/pages/PitchDeckPage'
import ExportPage from '@/pages/ExportPage'
import NotFoundPage from '@/pages/NotFoundPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'lean-canvas', element: <LeanCanvasPage /> },
      { path: 'golden-circle', element: <GoldenCirclePage /> },
      { path: 'personas', element: <PersonasPage /> },
      { path: 'personas/:id', element: <PersonaDetailPage /> },
      { path: 'value-proposition', element: <ValuePropPage /> },
      { path: 'pitch-deck', element: <PitchDeckPage /> },
      { path: 'export', element: <ExportPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])
