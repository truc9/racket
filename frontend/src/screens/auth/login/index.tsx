import LoginButton from "../../../components/login-button";

export default function Login() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white">
      <div className="w-full max-w-md space-y-5 p-8">
        <h2 className="text-center text-2xl font-bold">The R@CKET</h2>
        <div className="text-center">
          Look like a rocket 🚀 ? No, we are a group of badminton amature
          player. Login to join the match.
        </div>
        <div className="space-y-6">
          <LoginButton></LoginButton>
        </div>
      </div>
    </div>
  );
}
