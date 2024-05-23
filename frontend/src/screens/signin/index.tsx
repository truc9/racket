import { SignInButton, SignUpButton } from "@clerk/clerk-react";

const SignInScreen = () => {
  return (
    <div className="h-screen w-screen">
      <div className="flex h-full flex-col content-center items-center justify-center justify-items-center gap-3">
        <div className="text-center">
          <h3 className="text-3xl">RACKET</h3>
          <small>Signin to attend the match</small>
        </div>
        <SignInButton>
          <button className="w-52 rounded bg-rose-500 px-3 py-2 text-white ring-rose-400 ring-offset-2 active:ring-2">
            <span className="font-bold">Sign In</span>
          </button>
        </SignInButton>
        <SignUpButton>
          <button className="w-52 rounded bg-rose-400 px-3 py-2 text-white ring-rose-400 ring-offset-2 active:ring-2">
            <span className="font-bold">Sign Up</span>
          </button>
        </SignUpButton>
      </div>
    </div>
  );
};

export default SignInScreen;
