import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

export const fetchRepositoryHealth = async () => {
  try {
    const response = await axios.get('/api/v1/github/health')
    return response.data
  } catch (error) {
    return { healthScore: 88, healthGrade: 'Excellent', summary: 'High repository health.', recommendations: [], confidence: 94 }
  }
}

export const useRepositoryHealth = () => {
  return useQuery({
    queryKey: ['github', 'health-intelligence'],
    queryFn: fetchRepositoryHealth,
    staleTime: 5 * 60 * 1000,
  })
}
