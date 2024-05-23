import LoginButton from "../../../components/loginButton";

export default function Login() {
  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center gap-5">
      <h3 className="text-5xl">RACKET</h3>
      <LoginButton></LoginButton>
    </div>
  );
}
