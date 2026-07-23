import { useEffect, useState } from 'react'

function normalizeResponse(payload) {
  if (Array.isArray(payload)) {
    return { items: payload, count: payload.length, next: null, previous: null }
  }

  const items = payload?.data ?? payload?.results ?? payload?.items ?? []
  const safeItems = Array.isArray(items) ? items : []
  return {
    items: safeItems,
    count: payload?.count ?? safeItems.length,
    next: payload?.next ?? null,
    previous: payload?.previous ?? null,
  }
}

const teamsApiUrl = import.meta.env.VITE_CODESPACE_NAME?.trim()
  ? `https://${import.meta.env.VITE_CODESPACE_NAME}-8000.app.github.dev/api/teams/`
  : 'http://localhost:8000/api/teams/'

export default function Teams() {
  const [state, setState] = useState({ items: [], count: 0, next: null, previous: null })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false

    async function loadTeams() {
      try {
        setLoading(true)
        const response = await fetch(teamsApiUrl)
        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`)
        }

        const payload = await response.json()
        if (!cancelled) {
          setState(normalizeResponse(payload))
          setError('')
        }
      } catch (fetchError) {
        if (!cancelled) {
          setError(fetchError instanceof Error ? fetchError.message : 'Unknown error')
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    loadTeams()
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <section className="card shadow-sm">
      <div className="card-body">
        <h2 className="h4">Teams</h2>
        <p className="text-secondary mb-3">Total teams: {state.count}</p>
        {loading && <p className="mb-0">Loading teams...</p>}
        {!loading && error && <p className="text-danger mb-0">{error}</p>}
        {!loading && !error && (
          <>
            <div className="table-responsive">
              <table className="table table-striped align-middle">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>City</th>
                    <th>Points</th>
                    <th>Captain</th>
                  </tr>
                </thead>
                <tbody>
                  {state.items.map((team) => (
                    <tr key={team._id}>
                      <td>{team.name}</td>
                      <td>{team.city}</td>
                      <td>{team.points}</td>
                      <td>{team.captain?.fullName ?? 'Unknown captain'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="small text-secondary mb-0">
              next: {state.next ? 'available' : 'none'} | previous: {state.previous ? 'available' : 'none'}
            </p>
          </>
        )}
      </div>
    </section>
  )
}
