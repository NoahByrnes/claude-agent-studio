import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useAuthStore } from './lib/auth-store';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import AgentList from './pages/AgentList';
import AgentNew from './pages/AgentNew';
import AgentDetail from './pages/AgentDetail';
import { LogOut } from 'lucide-react';
function App() {
    const { user, signOut } = useAuthStore();
    const navigate = useNavigate();
    const handleSignOut = async () => {
        await signOut();
        navigate('/login');
    };
    return (_jsxs("div", { className: "min-h-screen bg-background", children: [user && (_jsx("header", { className: "border-b", children: _jsxs("div", { className: "container mx-auto px-4 py-4 flex items-center justify-between", children: [_jsx("h1", { className: "text-2xl font-bold text-primary", children: "Claude Agent Studio" }), _jsxs("div", { className: "flex items-center gap-4", children: [_jsx("span", { className: "text-sm text-muted-foreground", children: user.email }), _jsxs("button", { onClick: handleSignOut, className: "inline-flex items-center gap-2 px-3 py-2 text-sm border rounded-md hover:bg-secondary transition-colors", children: [_jsx(LogOut, { className: "w-4 h-4" }), "Sign out"] })] })] }) })), _jsx("main", { className: user ? 'container mx-auto px-4 py-8' : '', children: _jsxs(Routes, { children: [_jsx(Route, { path: "/login", element: _jsx(Login, {}) }), _jsx(Route, { path: "/signup", element: _jsx(Signup, {}) }), _jsx(Route, { path: "/", element: _jsx(ProtectedRoute, { children: _jsx(Dashboard, {}) }) }), _jsx(Route, { path: "/agents", element: _jsx(ProtectedRoute, { children: _jsx(AgentList, {}) }) }), _jsx(Route, { path: "/agents/new", element: _jsx(ProtectedRoute, { children: _jsx(AgentNew, {}) }) }), _jsx(Route, { path: "/agents/:id", element: _jsx(ProtectedRoute, { children: _jsx(AgentDetail, {}) }) }), _jsx(Route, { path: "*", element: _jsx(Navigate, { to: "/", replace: true }) })] }) })] }));
}
export default App;
//# sourceMappingURL=App.js.map