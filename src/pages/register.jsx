import React, { useState } from "react";
import { register } from '../firebase';
import toast, { Toaster } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function Register() {

    const dispatch = useDispatch
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      const user = await register(email, password);
      toast.success(`Kayıt Başarılı: ${user.email}. Giriş sayfasına yönlendiriliyorsunuz.`);
      navigate('/login')
    }
    return (
        <form onSubmit={handleSubmit} className="max-w xl mx-auto">
      <div className="mb-4">
        <label className="block text-sm font-medium leading-6 text-gray-900 mb-2">Mail Adresi</label>
        <input 
          required 
          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium leading-6 text-gray-900 mb-2">Şifre</label>
        <input 
          type="password" 
          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
        />
      </div>
      <button 
        type='submit' 
        className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 disabled:bg-gray-400" 
        disabled={!email || !password}
      >
        Kayıt Ol
      </button>
    </form>
    );
}