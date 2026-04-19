import {api} from '../../shared/api/axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "./LoginPage.css";

export default function LoginPage() {
    const [form, setForm] = useState({ email: '', password: '' });
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await api.login(form.email.trim(), form.password.trim());
            localStorage.setItem('accessToken', res.accessToken);
            localStorage.setItem('refreshToken', res.refreshToken);
            navigate('/products');
        } catch (err) {
            console.error("Полная ошибка:", err);
            console.log(err)
            alert("Неверный логин или пароль");
        }
    };

    return (
        <main className='main'>
            <div className='container'>
                <form onSubmit={handleSubmit} className='login'>
                    <h1 className='login__title'>Вход в аккаунт</h1>
                    <input type="email" className='login__input' onChange={e => setForm({...form, email: e.target.value})} />
                    <input type="password" className='login__input' onChange={e => setForm({...form, password: e.target.value})} />
                    <button type="submit" className='login__btn'>Войти</button>
                    <p className='login__ask'>Впервые у нас?</p>
                    <button type="button" className="login__second-btn" onClick={() => navigate('/register')}>
                        Зарегистрироваться
                    </button>
                </form>
            </div>
        </main>
    );
}