import React, { useEffect , useState } from "react";
import { useDispatch } from "react-redux";
import { login } from '../firebase'; // Firebase login function
import { loginSuccess } from "../store/auth";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const IPAddress = () => {
    const [ipAddress, setIPAddress] = useState('')
  
    useEffect(() => {
      fetch('https://api.ipify.org?format=json')
        .then(response => response.json())
        .then(data => setIPAddress(data.ip))
        .catch(error => console.log(error))
    }, [])
  
    return ipAddress
  }
  const ipAddress = IPAddress();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = await login(email, password);
      dispatch(loginSuccess(user));
      localStorage.setItem("user", JSON.stringify(user));
      console.log(user);
      toast.success(`Giriş Başarılı: ${user.email}\n IP Adresi: ${ipAddress}`);
      navigate("/", { replace: true });
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto">
      <div className="mb-4">
        <label className="block text-sm font-bold leading-6 text-gray-900 mb-2 ">Mail Adresi</label>
        <input 
          required 
          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-bold leading-6 text-gray-900 mb-2">Şifre</label>
        <input 
          type="password" 
          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
        />
      </div>
      <button 
        type="submit" 
        className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 disabled:bg-gray-400" 
        disabled={!email || !password}
      >
        Giriş Yap
      </button>
    </form>
  );
}
