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
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            style: {
              background: '#22c55e',
            },
          },
          error: {
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
