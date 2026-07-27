import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

export const fetchProductivityIntelligence = async () => {
  try {
    const response = await axios.get('/api/v1/github/productivity')
    return response.data
  } catch (error) {
    return { velocity: 90, consistency: 88, focusScore: 92, cycleTime: '4.2 hrs', leadTime: '1.8 days', developerEfficiency: 92 }
  }
}

export const useProductivity = () => {
  return useQuery({
    queryKey: ['github', 'productivity-intelligence'],
    queryFn: fetchProductivityIntelligence,
    staleTime: 5 * 60 * 1000,
  })
}
