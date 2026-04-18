'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import type { User } from '@supabase/supabase-js'

import MarketingPage from './marketing/page'
import WhatsOnPage from './whats-on/page'

export default function Index() {
  const enableMarketing = process.env.NEXT_PUBLIC_ENABLE_MARKETING === 'true'
  const [user, setUser] = useState<User | null>(null)
  const [shows, setShows] = useState<any[]>([])

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser()  
      setUser(data.user)
    }

    const getShows = async () => {
      const { data, error } = await supabase
        .from('shows')
        .select('*')

      if (error) {
        console.error(error)
      } else {
        setShows(data)
      }
    }

    getUser()
    getShows()
  }, [])

  return (
    <main>
      <div style={{ padding: '10px', background: '#eee' }}>
        {user ? (
          <p>Connectée : {user.email}</p>
        ) : (
          <p>Pas connectée</p>
        )}
      </div>

      <h2>Shows :</h2>
      <ul>
        {shows.map((show: any) => (
          <li key={show.id}>{show.name || show.id}</li>
        ))}
      </ul>

      {enableMarketing ? <MarketingPage /> : <WhatsOnPage />}
    </main>
  )
}