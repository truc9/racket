import { useAuth0 } from "@auth0/auth0-react"
import { useEffect, useState } from "react"
import constant from "../common/constant"

export const useAuth = () => {
  const { user, isAuthenticated, getIdTokenClaims } = useAuth0()
  const [roles, setRoles] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setIsLoading(true)
    const fetchRoles = async () => {
      if (isAuthenticated && user) {
        try {
          const claims: any = await getIdTokenClaims()
          const roles: string[] = claims[constant.auth0.roleNamespace] || []
          setRoles(roles)
          return roles
        } catch (error) {
          console.error("Error fetching roles: ", error)
        } finally {
          setIsLoading(false)
        }
      }
    }

    fetchRoles()
  }, [isAuthenticated, user, getIdTokenClaims])

  return {
    roles,
    isAdmin: roles.includes(constant.auth0.roles.ADMIN),
    isLoading,
  }
}
