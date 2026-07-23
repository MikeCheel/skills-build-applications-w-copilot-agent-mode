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

export default function Activities() {
  const [state, setState] = useState({ items: [], count: 0, next: null, previous: null })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false

    async function loadActivities() {
      try {
        setLoading(true)
        const response = await fetch(getApiEndpoint('activities'))
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

    loadActivities()
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <section className="card shadow-sm">
      <div className="card-body">
        <h2 className="h4">Activities</h2>
        <p className="text-secondary mb-3">Total activities: {state.count}</p>
        {loading && <p className="mb-0">Loading activities...</p>}
        {!loading && error && <p className="text-danger mb-0">{error}</p>}
        {!loading && !error && (
          <>
            <div className="table-responsive">
              <table className="table table-striped align-middle">
                <thead>
                  <tr>
                    <th>Type</th>
                    <th>User</th>
                    <th>Duration</th>
                    <th>Calories</th>
                  </tr>
                </thead>
                <tbody>
                  {state.items.map((activity) => (
                    <tr key={activity._id}>
                      <td className="text-capitalize">{activity.type}</td>
                      <td>{activity.user?.fullName ?? 'Unknown user'}</td>
                      <td>{activity.durationMinutes} min</td>
                      <td>{activity.caloriesBurned}</td>
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
