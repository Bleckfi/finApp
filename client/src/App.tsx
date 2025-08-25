import './App.css'
import { useEffect, useState } from 'react'
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
} from 'react-router-dom'
import Dashboard from './components/Dashboard.tsx'
import { Link } from 'react-router-dom'
import AuthPage from './pages/Auth.tsx'
import TransactionsPage from './pages/TransactionsPage.tsx'
import BudgetPage from './pages/BudgetPage.tsx'
import CategoriesPage from './pages/Categories.tsx'
import ProfilePage from './pages/Profile.tsx'
import { LogOut } from 'lucide-react'
import { getCurrentUser } from './api/decodeToken.ts'

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(
        !!localStorage.getItem('token') // проверка при загрузке
    )
    const [user, setUser] = useState<any>(null)

    useEffect(() => {
        const currentUser = getCurrentUser()
        if (currentUser) {
            setIsAuthenticated(true)
            setUser(currentUser)
        }
    }, [])

    const handleLogout = () => {
        localStorage.removeItem('token')
        setIsAuthenticated(false)
        setUser(null)
    }

    const handleLogin = () => {
        const currentUser = getCurrentUser()
        setIsAuthenticated(true)
        setUser(currentUser)
    }

    return (
        <Router>
            <Routes>
                {!isAuthenticated ? (
                    <>
                        <Route
                            path="/login"
                            element={<AuthPage onLogin={handleLogin} />}
                        />
                        <Route path="*" element={<Navigate to="/login" />} />
                    </>
                ) : (
                    <Route
                        path="/*"
                        element={
                            <Layout onLogout={handleLogout} user={user}>
                                <Routes>
                                    <Route path="/" element={<Dashboard />} />
                                    <Route
                                        path="/transactions"
                                        element={<TransactionsPage />}
                                    />
                                    <Route
                                        path="/budget"
                                        element={<BudgetPage />}
                                    />
                                    <Route
                                        path="/categories"
                                        element={<CategoriesPage />}
                                    />
                                    <Route
                                        path="/profile"
                                        element={<ProfilePage />}
                                    />
                                    <Route
                                        path="*"
                                        element={<Navigate to="/" />}
                                    />
                                </Routes>
                            </Layout>
                        }
                    />
                )}
            </Routes>
        </Router>
    )
}

function Layout({
    children,
    onLogout,
    user,
}: {
    children: React.ReactNode
    onLogout: () => void
    user: any
}) {
    return (
        <div className="min-h-screen flex bg-gray-100">
            <aside className="w-64 bg-white p-6 shadow hidden md:flex flex-col justify-between">
                <nav className="space-y-4">
                    <div className="font-bold mb-6">
                        Привет, {user?.userName}!
                    </div>
                    <Link
                        to="/"
                        className="block font-medium hover:text-blue-600"
                    >
                        Главная
                    </Link>
                    <Link
                        to="/transactions"
                        className="block font-medium hover:text-blue-600"
                    >
                        Транзакции
                    </Link>
                    <Link
                        to="/budget"
                        className="block font-medium hover:text-blue-600"
                    >
                        Бюджет
                    </Link>
                    <Link
                        to="/categories"
                        className="block font-medium hover:text-blue-600"
                    >
                        Категории
                    </Link>
                    <Link
                        to="/profile"
                        className="block font-medium hover:text-blue-600"
                    >
                        Профиль
                    </Link>
                </nav>
                <button
                    onClick={onLogout}
                    className="flex items-center justify-center gap-2 w-full bg-red-500 text-white px-4 py-2 rounded-xl shadow-md hover:bg-red-600 hover:shadow-lg transition-all duration-200 cursor-pointer"
                >
                    <LogOut size={18} />
                    <span>Выйти</span>
                </button>
            </aside>
            <main className="flex-1 p-6">{children}</main>
        </div>
    )
}

export default App
