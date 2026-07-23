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

const usersApiUrl = import.meta.env.VITE_CODESPACE_NAME?.trim()
  ? `https://${import.meta.env.VITE_CODESPACE_NAME}-8000.app.github.dev/api/users/`
  : 'http://localhost:8000/api/users/'

export default function Users() {
  const [state, setState] = useState({ items: [], count: 0, next: null, previous: null })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false

    async function loadUsers() {
      try {
        setLoading(true)
        const response = await fetch(usersApiUrl)
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

    loadUsers()
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <section className="card shadow-sm">
      <div className="card-body">
        <h2 className="h4">Users</h2>
        <p className="text-secondary mb-3">Total users: {state.count}</p>
        {loading && <p className="mb-0">Loading users...</p>}
        {!loading && error && <p className="text-danger mb-0">{error}</p>}
        {!loading && !error && (
          <>
            <div className="table-responsive">
              <table className="table table-striped align-middle">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Fitness Level</th>
                    <th>Weekly Goal (min)</th>
                  </tr>
                </thead>
                <tbody>
                  {state.items.map((user) => (
                    <tr key={user._id}>
                      <td>{user.fullName}</td>
                      <td>{user.email}</td>
                      <td className="text-capitalize">{user.fitnessLevel}</td>
                      <td>{user.weeklyGoalMinutes}</td>
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
