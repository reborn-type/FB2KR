import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../shared/api/axios';
import "./RegisterPage.css";

export default function RegisterPage() {
    const [formData, setFormData] = useState({email: '', username: '',  password: '' });
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            await api.register(formData.email, formData.username, formData.password);
            
            alert("Аккаунт создан! Пожалуйста, войдите.");
            
            navigate('/login'); 
        } catch (err) {
            alert(err.response?.data?.error || "Ошибка регистрации");
        }
    };

    return (
        <div className="container">
            <form onSubmit={handleRegister} className='register'>
                <h2 className='register__title'>Регистрация</h2>
                <input className='register__input'
                    type="email" 
                    placeholder="Email" 
                    required
                    onChange={e => setFormData({...formData, email: e.target.value})} 
                />
                <input className='register__input'
                    type="username" 
                    placeholder="Username" 
                    required
                    onChange={e => setFormData({...formData, username: e.target.value})} 
                />
                <input className='register__input'
                    type="password" 
                    placeholder="Пароль" 
                    required
                    onChange={e => setFormData({...formData, password: e.target.value})} 
                />
                <button type="submit" className='register__btn'>Создать аккаунт</button>
                <p className='register__ask'>Уже есть аккаунт?</p>
                <button type="button" className='register__second-btn' onClick={() => navigate('/login')}>
                    Войти
                </button>
            </form>
        </div>
    );
}