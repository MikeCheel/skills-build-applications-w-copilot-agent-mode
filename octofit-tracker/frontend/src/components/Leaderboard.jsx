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

function getApiEndpoint(resourceName) {
  const codespaceName = import.meta.env.VITE_CODESPACE_NAME?.trim()
  const baseUrl = codespaceName
    ? `https://${codespaceName}-8000.app.github.dev/api`
    : 'http://localhost:8000/api'
  return `${baseUrl}/${resourceName}/`
}

export default function Leaderboard() {
  const [state, setState] = useState({ items: [], count: 0, next: null, previous: null })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false

    async function loadLeaderboard() {
      try {
        setLoading(true)
        const response = await fetch(getApiEndpoint('leaderboard'))
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

    loadLeaderboard()
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <section className="card shadow-sm">
      <div className="card-body">
        <h2 className="h4">Leaderboard</h2>
        <p className="text-secondary mb-3">Total boards: {state.count}</p>
        {loading && <p className="mb-0">Loading leaderboard...</p>}
        {!loading && error && <p className="text-danger mb-0">{error}</p>}
        {!loading && !error && (
          <>
            {state.items.map((board) => (
              <div key={board._id} className="mb-4">
                <h3 className="h6 text-uppercase mb-2">{board.period} leaderboard</h3>
                <div className="table-responsive">
                  <table className="table table-striped align-middle">
                    <thead>
                      <tr>
                        <th>Rank</th>
                        <th>User</th>
                        <th>Team</th>
                        <th>Points</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(board.entries || []).map((entry, index) => (
                        <tr key={`${board._id}-${index}`}>
                          <td>{entry.rank}</td>
                          <td>{entry.user?.fullName ?? 'Unknown user'}</td>
                          <td>{entry.team?.name ?? 'Unknown team'}</td>
                          <td>{entry.points}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
            <p className="small text-secondary mb-0">
              next: {state.next ? 'available' : 'none'} | previous: {state.previous ? 'available' : 'none'}
            </p>
          </>
        )}
      </div>
    </section>
  )
}
