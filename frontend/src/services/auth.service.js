import { create } from "zustand"
import { request } from "./index"

export const useAuth = create((set) => {

    const login = async (email, password) => {
        try {
            const { data } = await request.post("/users/login", { email, password })
            localStorage.setItem("token", data.token)
            localStorage.setItem("isAuthenticated", JSON.stringify(true))
            window.location.href = "/"
            return { error: null }
        } catch (error) {
            set({ user: null })
            return { error }
        }
    }

    const logOut = async () => {
        set({ user: null })
        localStorage.clear()

        window.location.href = "/login"
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