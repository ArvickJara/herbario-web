// src/pages/LoginPage.tsx
import { LoginForm } from "@/components/auth/LoginForm";

const LoginPage = () => {
    return (
        <div className="flex min-h-[80vh] items-center justify-center bg-background">
            <LoginForm />
        </div>
    );
};

export default LoginPage;