import { notFound } from 'next/navigation'

// This page is only reached via middleware rewrite when someone
// tries to access /admin without the gate cookie.
// It calls notFound() to render the app/not-found.tsx with a true 404 status.
export default function AdminBlocked() {
  notFound()
}
