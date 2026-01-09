import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../lib/auth-store';
export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const signIn = useAuthStore((state) => state.signIn);
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await signIn(email, password);
            navigate('/');
        }
        catch (err) {
            setError(err.message || 'Failed to sign in');
        }
        finally {
            setLoading(false);
        }
    };
    return (_jsx("div", { className: "min-h-screen flex items-center justify-center bg-background", children: _jsxs("div", { className: "w-full max-w-md space-y-8 p-8", children: [_jsxs("div", { className: "text-center", children: [_jsx("h1", { className: "text-3xl font-bold text-primary", children: "Claude Agent Studio" }), _jsx("p", { className: "mt-2 text-muted-foreground", children: "Sign in to your account" })] }), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-6", children: [error && (_jsx("div", { className: "p-3 bg-destructive/10 text-destructive rounded-md text-sm", children: error })), _jsxs("div", { className: "space-y-2", children: [_jsx("label", { htmlFor: "email", className: "block text-sm font-medium", children: "Email" }), _jsx("input", { id: "email", type: "email", value: email, onChange: (e) => setEmail(e.target.value), className: "w-full px-3 py-2 border rounded-md", required: true, autoComplete: "email" })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("label", { htmlFor: "password", className: "block text-sm font-medium", children: "Password" }), _jsx("input", { id: "password", type: "password", value: password, onChange: (e) => setPassword(e.target.value), className: "w-full px-3 py-2 border rounded-md", required: true, autoComplete: "current-password" })] }), _jsx("button", { type: "submit", disabled: loading, className: "w-full px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50", children: loading ? 'Signing in...' : 'Sign in' }), _jsxs("p", { className: "text-center text-sm text-muted-foreground", children: ["Don't have an account?", ' ', _jsx(Link, { to: "/signup", className: "text-primary hover:underline", children: "Sign up" })] })] })] }) }));
}
//# sourceMappingURL=Login.js.map