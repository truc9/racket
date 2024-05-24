import LoginButton from "../../../components/loginButton";

export default function Login() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-8 shadow-md">
        <h2 className="text-center text-2xl font-bold">Welcome to RACKET</h2>
        <div className="space-y-6">
          <LoginButton></LoginButton>
        </div>
      </div>
    </div>
  );
}
