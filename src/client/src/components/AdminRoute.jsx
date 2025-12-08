import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AdminRoute() {
    const { user, loading } = useAuth();

    if (loading) {
        return <div>Loading...</div>; // Or a proper loading spinner
    }

    if (!user || user.role !== 'admin') {
        return <div style={{ padding: '2rem', textAlign: 'center', color: 'red' }}>
            <h1>Acceso Denegado</h1>
            <p>Tienes que ser Admin para acceder a esta sección.</p>
        </div>;
    }

    return <Outlet />;
}
