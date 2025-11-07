import {
    Route,
    createBrowserRouter,
    createRoutesFromElements,
    RouterProvider,
} from 'react-router-dom'

import LandingPage from './pages/LandingPage'
import AuthPage from './pages/AuthPage'
import NotFoundPage from './pages/NotFoundPage'
import HomePage from './pages/HomePage'
import UploadPage from './pages/UploadPage'

const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path="/">
            <Route index element={<LandingPage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/upload" element={<UploadPage />} />

            <Route path="*" element={<NotFoundPage />} />
        </Route>
    )
)

function App() {
    /*
        FIXME: How to check if the user was already logged in...
            - so the index request directly goes to /home
            - maybe use useEffect(... , [])
            - auth check should be done inside the <LandingPage />
    */
    return (<RouterProvider router={router} />)

}

export default App