import React from 'react'
import { useAuth } from '../services/auth.service'
import { useToaster } from '../services/toaster.service'
import { useNavigate } from 'react-router-dom'

export default function Login() {
    const [loginData, setLoginData] = React.useState({
        email: "",
        password: ""
    })
    const login = useAuth(state => state.login)
    const toast = useToaster(state => state.toast)
    const navigate = useNavigate()

    const handleFormChange = (e) => {
        setLoginData({ ...loginData, [e.target.name]: e.target.value })
    }

    const submit = async (e) => {
        e.preventDefault()
        if (loginData.email && loginData.password) {
            const { data, error } = await login(loginData.email, loginData.password)

            if (error) {
                toast.onError(error, 5000)
            }

            if (data) {
                toast.onSuccess("Login Successful", 2000)
                localStorage.setItem("isAuthenticated", JSON.stringify(true))
                navigate("/")
            }

        } else {
            toast.onError({ message: "Please enter valid email and password" }, 5000)
        }
    }

    return (
        <div className='flex justify-center items-center h-[90vh]'>

            <form onSubmit={submit} className='flex flex-col gap-4 lg:w-1/2 w-full lg:shadow-xl px-5 py-4'>
                <h3 className='lg:text-3xl text-2xl text-center font-bold'>Login</h3>

                <label className="form-control w-full ">
                    <div className="label">
                        <span className="label-text text-lg">Email</span>
                    </div>
                    <input type="text" placeholder="johndoe@gmail.com" required value={loginData.email} onChange={handleFormChange} name='email' className="input input-bordered w-full " />
                </label>

                <label className="form-control w-full ">
                    <div className="label">
                        <span className="label-text text-lg">Password</span>
                    </div>
                    <input type="password" required value={loginData.password} onChange={handleFormChange} name='password' className="input input-bordered w-full" />
                </label>

                <button type='submit' className='btn btn-neutral'>Login</button>

            </form>

        </div>
    )
}
