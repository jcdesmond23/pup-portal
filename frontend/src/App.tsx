import './App.css'
import Header from './components/Header/Header'
import MainContent from './components/MainContent/MainContent'
import Footer from './components/Footer/Footer'
import { AuthProvider } from './contexts/AuthContext'

function App() {
  return (
    <AuthProvider>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow overflow-y-auto flex items-center justify-center">
          <div className="w-full max-w-md px-4">
            <MainContent />
          </div>
        </main>
        <Footer />
      </div>
    </AuthProvider>
  )
}

export default App
