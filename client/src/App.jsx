import {
    Route,
    createBrowserRouter,
    createRoutesFromElements,
    RouterProvider,
} from 'react-router-dom'

import LandingPage from './pages/LandingPage'
import AuthPage from './pages/AuthPage'
import NotFoundPage from './pages/NotFoundPage'

const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path="/">
            <Route index element={<LandingPage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="*" element={<NotFoundPage />} />
        </Route>
    )
)

function App() {
    return (<RouterProvider router={router} />)

}

export default App