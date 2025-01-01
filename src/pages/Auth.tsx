import { useEffect } from "react";
import { Auth as SupabaseAuth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const Auth = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        navigate("/");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-4">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold">AI Генератор Кода</h1>
          <p className="text-muted-foreground">Войдите или зарегистрируйтесь для продолжения</p>
        </div>
        <div className="border rounded-lg p-6 bg-card">
          <SupabaseAuth 
            supabaseClient={supabase}
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: 'rgb(var(--primary))',
                    brandAccent: 'rgb(var(--primary))',
                  },
                },
              },
            }}
            localization={{
              variables: {
                sign_in: {
                  email_label: "Email адрес",
                  password_label: "Пароль",
                  button_label: "Войти",
                  loading_button_label: "Вход...",
                  social_provider_text: "Войти через {{provider}}",
                  link_text: "Уже есть аккаунт? Войти",
                },
                sign_up: {
                  email_label: "Email адрес",
                  password_label: "Пароль",
                  button_label: "Регистрация",
                  loading_button_label: "Регистрация...",
                  social_provider_text: "Зарегистрироваться через {{provider}}",
                  link_text: "Нет аккаунта? Зарегистрироваться",
                },
                magic_link: {
                  button_label: "Отправить магическую ссылку",
                  loading_button_label: "Отправка магической ссылки...",
                },
                forgotten_password: {
                  button_label: "Отправить инструкции",
                  loading_button_label: "Отправка инструкций...",
                  link_text: "Забыли пароль?",
                },
              },
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Auth;