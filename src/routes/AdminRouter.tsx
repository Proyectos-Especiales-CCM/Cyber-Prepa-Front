import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import { ROUTES } from "./Constants";
import { readUserMe } from "../services";
import { useAppContext } from "../store/appContext/useAppContext";

const AdminRouter = () => {
    const { tokens, admin, setUser, setIsAdmin } = useAppContext();
    const [isCheckingAccess, setIsCheckingAccess] = useState(true);

    useEffect(() => {
        let isMounted = true;

        const verifyAccess = async () => {
            if (!tokens?.access_token) {
                if (isMounted) {
                    setIsAdmin(false);
                    setIsCheckingAccess(false);
                }
                return;
            }

            try {
                await readUserMe(tokens.access_token, setUser, setIsAdmin);
            } catch {
                if (isMounted) {
                    setIsAdmin(false);
                }
            } finally {
                if (isMounted) {
                    setIsCheckingAccess(false);
                }
            }
        };

        verifyAccess();

        return () => {
            isMounted = false;
        };
    }, [setIsAdmin, setUser, tokens?.access_token]);

    if (isCheckingAccess) {
        return null;
    }

    if (!tokens?.access_token || !admin) {
        return <Navigate to={ROUTES.HOME} replace />;
    }

    return (
        <>
            <Header />
                <Outlet />
            <Footer />
        </>
    );
};

export default AdminRouter;
