import React, { useEffect, useState, useCallback } from "react";

export default function AuthorizationPage({ onLogin }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    
    useEffect(() => {
        setError("");
    }, [username, password]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (username === "admin" && password === "admin") {
            onLogin();
        } else {
            setError("Неверное имя пользователя или пароль");
        }
    };

}