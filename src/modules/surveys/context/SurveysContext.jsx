import { createContext, useContext } from 'react'

export const SurveysContext = createContext()

export const useSurveys = () => {
  const ctx = useContext(SurveysContext)
  if (!ctx) throw new Error('useSurveys must be used inside Provider')
  return ctx
}
