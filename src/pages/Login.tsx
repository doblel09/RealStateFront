import Input from "@/components/Input"
import Submit from "@/components/Submit"
import { useAuth } from "@/hooks/useAuth"
import {useState} from "react"
import * as z from "zod";

const UserSchema = z.object({
    email: z.email(),
    password: z.string().min(6, "Password must be at least 6 characters long").max(100, "Password must be at most 100 characters long"),
  });

const Login = () => {
  const auth = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFieldErrors({});
    setError(null);
    const result = UserSchema.safeParse({ email, password });
    if (!result.success) {
        const f = result.error.flatten().fieldErrors;
        setFieldErrors({
          email: f.email?.[0],
          password: f.password?.[0],
        });
        return;
    }
    
    const login = await auth?.login(email, password);
    if (!login?.success) {
      setError(login?.message || "Hay bobo");
    }
  };

  return (
    <div className="flex flex-col w-full max-w-[480px] gap-6">
      <h1 className="text-3xl font-bold text-center">Welcome back!</h1>
      {error && <div className="text-sm text-red-600 bg-red-50 border border-red-100 p-2 rounded">{error}</div>}
      <form id="login-form" className="flex flex-col gap-4" onSubmit={handleSubmit}>
      <Input id="email" type="email" placeholder="Email" setElement={setEmail} />
      {fieldErrors.email && <div className="text-sm text-red-600">{fieldErrors.email}</div>}

      <Input id="password" type="password" placeholder="Password" setElement={setPassword} />
      {fieldErrors.password && <div className="text-sm text-red-600">{fieldErrors.password}</div>}
      <span className="flex justify-between">
        <label htmlFor="remember-me" className="mr-2">Remember me</label>
      <input type="checkbox" id="remember-me" />
      </span>

      <Submit formId="login-form" submitText="Log in" />
      </form>
      <a href="/sign-up" className="text-center text-[#668A5C]">Don't have an account? Sign Up</a>
    </div>
  )
}

export default Login
