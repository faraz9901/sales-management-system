import { create } from "zustand"
import { request } from "./index"

export const useAuth = create((set) => {

    const login = async (email, password) => {
        try {
            const { data } = await request.post("/users/login", { email, password })
            set({ user: data.content })
            localStorage.setItem("token", data.token)
            return { data: data.content, error: null }
        } catch (error) {
            set({ user: null })
            return { data: null, error }
        }
    }

    const logOut = async () => {
        try {
            await tryCatch(() => request.put("/users/logout"))
            set({ user: null })
        } catch (error) {
            set({ user: null })
        } finally {
            localStorage.removeItem("isAuthenticated")
        }
    }

    const fetchUser = async () => {
        try {
            const { data } = await request.get("/users/current-user")
            set({ user: data.content })
        } catch (error) {
            set({ user: null })
        }
    }

    return { user: null, login, logOut, fetchUser }
})