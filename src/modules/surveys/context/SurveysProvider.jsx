import { useState } from 'react'
import { SurveysContext } from './SurveysContext'
import { useEffect } from 'react'
import { mockSurveys } from '../../../mocks/surveys'

export function SurveyProvider({ children }) {
  const [surveys, SetSurveys] = useState(null)

  useEffect(() => {
    SetSurveys(mockSurveys)
  }, [])

  return (
    <SurveysContext.Provider
      value={{
        surveys,
        SetSurveys,
      }}
    >
      {children}
    </SurveysContext.Provider>
  )
}
