import '../styles/globals.css'
import type { AppProps } from 'next/app'
import ErrorBoundary from '../components/ErrorBoundary'
import { Toaster } from 'react-hot-toast'

/**
 * Root App Component
 * Wraps all pages with ErrorBoundary for graceful error handling
 */
function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ErrorBoundary>
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 1000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 1000,
            style: {
              background: '#22c55e',
            },
          },
          error: {
            duration: 1000,
            style: {
              background: '#ef4444',
            },
          },
        }}
      />
      <Component {...pageProps} />
    </ErrorBoundary>
  )
}

export default MyApp
