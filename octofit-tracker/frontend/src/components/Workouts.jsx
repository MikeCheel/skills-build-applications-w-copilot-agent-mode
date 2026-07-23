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

const workoutsApiUrl = import.meta.env.VITE_CODESPACE_NAME?.trim()
  ? `https://${import.meta.env.VITE_CODESPACE_NAME}-8000.app.github.dev/api/workouts/`
  : 'http://localhost:8000/api/workouts/'

export default function Workouts() {
  const [state, setState] = useState({ items: [], count: 0, next: null, previous: null })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false

    async function loadWorkouts() {
      try {
        setLoading(true)
        const response = await fetch(workoutsApiUrl)
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

    loadWorkouts()
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <section className="card shadow-sm">
      <div className="card-body">
        <h2 className="h4">Workouts</h2>
        <p className="text-secondary mb-3">Total workouts: {state.count}</p>
        {loading && <p className="mb-0">Loading workouts...</p>}
        {!loading && error && <p className="text-danger mb-0">{error}</p>}
        {!loading && !error && (
          <>
            <div className="table-responsive">
              <table className="table table-striped align-middle">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>User</th>
                    <th>Category</th>
                    <th>Difficulty</th>
                    <th>Minutes</th>
                  </tr>
                </thead>
                <tbody>
                  {state.items.map((workout) => (
                    <tr key={workout._id}>
                      <td>{workout.title}</td>
                      <td>{workout.user?.fullName ?? 'Unknown user'}</td>
                      <td className="text-capitalize">{workout.category}</td>
                      <td className="text-capitalize">{workout.difficulty}</td>
                      <td>{workout.estimatedMinutes}</td>
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
