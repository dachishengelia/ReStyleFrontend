import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import Cookies from 'cookie';
import { toast } from 'react-toastify';

export default function LogIn() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);
            const resp = await fetch(`${import.meta.env.VITE_API_BASE}/auth/log-in`, {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    email,
                    password,
                }),
            });
            const data = await resp.json();
            console.log(resp.status, "stsut")

            if (resp.status === 200) {
                console.log("shemovida?")
                // Cookies.set('token', data, { expires: 1 / 24 });
                toast.success('Logged in successfully');
                navigate('/');
            } else {
                toast.error(data.message);
            }
        } catch (e) {
            if (e.message.includes('Failed to fetch')) {
                toast.error('Unable to connect to the server. Please ensure the backend is running.');
            } else {
                toast.error(e.message);
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (searchParams.get('token')) {
            Cookies.set('token', searchParams.get('token'), { expires: 60 * 60 });
            toast.success('Logged in successfully');
            navigate('/');
        }
    }, [searchParams, navigate]);

    return (
        <div className="flex flex-col justify-center items-center h-screen">
            <h1>Log-in</h1>

            <form onSubmit={handleSubmit} className="flex flex-col w-[400px] gap-2">
                <input
                    type="email"
                    placeholder="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="border-2 border-black"
                />
                <input
                    type="password"
                    placeholder="********"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="border-2 border-black"
                />

                <button className="p-2 bg-blue-500">{loading ? 'loading..' : 'Log-in'}</button>
            </form>
            <Link to={`${import.meta.env.VITE_SERVER_URL}/auth/google`}>Continue With Google</Link>

            <h2>
                Don't have an account? <Link to={'/sign-up'}>Sign-up</Link>
            </h2>
        </div>
    );
}