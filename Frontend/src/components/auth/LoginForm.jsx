import { useMutation, useQueryClient } from '@tanstack/react-query'
import React, { useState } from 'react'
import { axiosInstance } from '../../lib/axio'
import { toast} from 'react-hot-toast'
import {Loader} from 'lucide-react'

const LoginForm = () => {
    const [username,setUsername] = useState("")
    const [password,setPassword] = useState("")
    const queryClient = useQueryClient()

    const {mutate:loginMutation, isLoading} = useMutation({
        mutationFn: async(data) => {
            const res = await axiosInstance.post("/auth/login",data)
            return res.data
        },
        onSuccess:() => {
            //toast.success("Account created successfully")
            queryClient.invalidateQueries({queryKey: ["authUser"]})
        },
        onError: (err) => {
            //console.log("we have an error",err)
            toast.error(err.response.data.message || "Something went wrong")
        },

    })

    const handleSubmit = (e) => {
		e.preventDefault();
		loginMutation({ username, password });
	};

  return (
    <form onSubmit={handleSubmit} className='space-y-4 w-full max-w-md'>
			<input
				type='text'
				placeholder='Username'
				value={username}
				onChange={(e) => setUsername(e.target.value)}
				className='input input-bordered w-full'
				required
			/>
			<input
				type='password'
				placeholder='Password'
				value={password}
				onChange={(e) => setPassword(e.target.value)}
				className='input input-bordered w-full'
				required
			/>

			<button type='submit' className='btn btn-primary w-full'>
				{isLoading ? <Loader className='size-5 animate-spin' /> : "Login"}
			</button>
		</form>
  )
}

export default LoginForm
