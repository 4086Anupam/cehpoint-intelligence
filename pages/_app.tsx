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
          duration: 4000,
          className: '!bg-white !text-gray-900 !rounded-xl !shadow-xl !border !border-gray-100 !px-4 !py-3 !text-sm !font-medium',
          icon: null,
          style: {
            background: '#ffffff',
            color: '#111827',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          },
          success: {
            duration: 4000,
            icon: null,
            style: {
              background: '#ffffff',
              color: '#166534',
              border: '1px solid #dcfce7',
            }
          },
          error: {
            duration: 5000,
            icon: null,
            style: {
              background: '#ffffff',
              color: '#991b1b',
              border: '1px solid #fee2e2',
            }
          },
        }}
      />
      <Component {...pageProps} />
    </ErrorBoundary>
  )
}

export default MyApp
