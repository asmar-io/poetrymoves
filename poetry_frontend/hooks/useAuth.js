import axios from '../utils/axios'
import { useQuery, useQueryClient } from 'react-query'
import { getAuth } from 'firebase/auth'
import { useAuthState } from 'react-firebase-hooks/auth'
import firebase_app from '../firebase/config'

export const auth = getAuth(firebase_app)

export const useCurrentUser = () => {
  const queryClient = useQueryClient()
  const [user, loading, error] = useAuthState(auth)

  console.log(`get user uid from firebase ${user}`)

  return useQuery('user', async () => {
    // if no userId, don't fetch
    if (!user) return

    // get data from queryClient cache
    const data = queryClient.getQueryData('user')
    console.log(`get data from queryClient cache ${data}`)
    if (data) return data

    // fetch user
    const response = await axios.get(`/user/${user.uid}`, { timeout: 5000 })
    console.log(`get data from axios ${response.data}`)
    return response.data
  })
}
