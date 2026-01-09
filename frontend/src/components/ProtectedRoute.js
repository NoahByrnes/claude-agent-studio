import { jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../lib/auth-store';
export default function ProtectedRoute({ children }) {
    const { user, loading, initialized, initialize } = useAuthStore();
    useEffect(() => {
        if (!initialized) {
            initialize();
        }
    }, [initialized, initialize]);
    if (loading || !initialized) {
        return (_jsx("div", { className: "min-h-screen flex items-center justify-center", children: _jsx("p", { className: "text-muted-foreground", children: "Loading..." }) }));
    }
    if (!user) {
        return _jsx(Navigate, { to: "/login", replace: true });
    }
    return _jsx(_Fragment, { children: children });
}
//# sourceMappingURL=ProtectedRoute.js.map