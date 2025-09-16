// En tu archivo principal de rutas (ej: App.jsx o routes/AppRoutes.jsx)
import { SurveysPage } from '../modules/surveys'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { NavBar } from '../shared/components/NavBar'
import { SurveysContext } from '../modules/surveys/context/SurveysContext'
import { SurveyProvider } from '../modules/surveys/context/SurveysProvider'
import SurveyInfo from '../modules/surveys/pages/SurveyInfo'
import MqttPage from '../modules/sensores/pages/MqttPage'
export function AppRoutes() {
  return (
    // 1. Envuelve todo en BrowserRouter
    <BrowserRouter>
      {/* 2. Coloca el Navbar aquí para que sea visible en todas las páginas */}
      <NavBar />

      {/* 3. Define tus rutas dentro de Routes */}
      <Routes>
        <Route
          path="/"
          element={
            <SurveyProvider>
              <SurveysPage />
            </SurveyProvider>
          }
        />
        <Route
          path="/surveys/:surveyId"
          element={
            <SurveyProvider>
              <SurveyInfo />
            </SurveyProvider>
          }
        />
        <Route
          path="/sensores"
          element={
            <SurveyProvider>
              <MqttPage />
            </SurveyProvider>
          }
        />
        {/* Agrega más rutas aquí */}
      </Routes>
    </BrowserRouter>
  )
}

export default AppRoutes
