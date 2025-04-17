import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Mail, LockKeyhole, AlertCircle } from "lucide-react"
import axiosInstance from '../api/axiosInstance';
import { jwtDecode } from "jwt-decode";

const Login = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const login = async (e) => {
    e.preventDefault()
    const errorMessages = {}

    if (!email) errorMessages.email = "Email is required"
    if (!password) errorMessages.password = "Password is required"

    if (Object.keys(errorMessages).length > 0) {
      setErrors(errorMessages)
      return
    }

    setIsLoading(true)
    try {
      const response = await axiosInstance.post('/auth/login', {
        email,
        password,
      })

      localStorage.setItem("token", response.data.token)
      console.log("Connexion réussie !")
      navigate("/employer/dashboard")
    } catch (error) {
      if (error.response) {
        setErrors({ general: error.response.data.message || "Login failed" })
      } else {
        setErrors({ general: "Une erreur est survenue" })
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 bg-white p-6 rounded-lg shadow-md">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Connexion</h1>
          <p className="mt-2 text-sm text-gray-600">Entrez vos identifiants pour accéder à votre compte</p>
        </div>

        {/* Form */}
        <form onSubmit={login} className="mt-8 space-y-6">
          {/* General Error */}
          {errors.general && (
            <div className="flex items-center p-4 text-sm text-red-800 rounded-lg bg-red-50">
              <AlertCircle className="flex-shrink-0 w-4 h-4 mr-2" />
              <span>{errors.general}</span>
            </div>
          )}

          {/* Email Field */}
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`block w-full pl-10 pr-3 py-2 border ${
                  errors.email ? "border-red-500" : "border-gray-300"
                } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                placeholder="nom@entreprise.com"
              />
            </div>
            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Mot de passe
              </label>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <LockKeyhole className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`block w-full pl-10 pr-3 py-2 border ${
                  errors.password ? "border-red-500" : "border-gray-300"
                } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                placeholder="••••••••"
              />
            </div>
            {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300 disabled:cursor-not-allowed"
            >
              {isLoading ? "Connexion en cours..." : "Se connecter"}
            </button>
          </div>
        </form>

      </div>
    </div>
  )
}

export default Login
