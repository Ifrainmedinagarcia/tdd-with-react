import React from 'react'
import GitHubSearchPage  from './components/github-search-page'
import {ErrorBoundary} from "./components/error-boundary"


function App() {
  return (
    <>
      <ErrorBoundary>
        <GitHubSearchPage />
      </ErrorBoundary>
    </>
  )
}

export default App
