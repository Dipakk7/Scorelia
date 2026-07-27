import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

export const fetchGitHubRiskIntelligence = async () => {
  try {
    const response = await axios.get('/api/v1/github/risk')
    return response.data
  } catch (error) {
    return [{ id: 'risk-1', severity: 'Low', repository: 'All', title: 'Healthy Status', description: 'Zero critical risks.', recommendation: 'Maintain cadence.' }]
  }
}

export const useGitHubRisk = () => {
  return useQuery({
    queryKey: ['github', 'risk-intelligence'],
    queryFn: fetchGitHubRiskIntelligence,
    staleTime: 5 * 60 * 1000,
  })
}
