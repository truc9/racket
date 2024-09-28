import { useAuth0 } from "@auth0/auth0-react";

const Hero = () => {
  const { loginWithRedirect } = useAuth0();
  return (
    <section className="flex h-screen flex-col items-center justify-center bg-gray-800 text-white">
      <h1 className="mb-4 text-6xl font-bold">Welcome to RACKET</h1>
      <p className="mb-6 text-xl">
        The ultimate app for badminton enthusiasts!
      </p>
      <button
        onClick={() => loginWithRedirect()}
        className="rounded-full bg-emerald-500 px-6 py-3 font-bold text-white transition duration-300 hover:bg-emerald-600"
      >
        Get Started
      </button>
    </section>
  );
};

const Features = () => {
  return (
    <section className="bg-gray-100 py-16 text-gray-800">
      <div className="container mx-auto">
        <h2 className="mb-12 text-center text-4xl font-bold">Features</h2>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="rounded-lg bg-white p-6 text-center shadow-md">
            <h3 className="mb-4 text-2xl font-semibold">Track Your Matches</h3>
            <p>Keep a detailed log of your games, scores, and stats.</p>
          </div>
          <div className="rounded-lg bg-white p-6 text-center shadow-md">
            <h3 className="mb-4 text-2xl font-semibold">
              Find Badminton Partners
            </h3>
            <p>Connect with fellow players in your area to organize matches.</p>
          </div>
          <div className="rounded-lg bg-white p-6 text-center shadow-md">
            <h3 className="mb-4 text-2xl font-semibold">Improve Your Game</h3>
            <p>Get tips and tricks from expert players and coaches.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

const CTA = () => {
  const { loginWithRedirect } = useAuth0();
  return (
    <section className="bg-emerald-500 py-16 text-center text-white">
      <h2 className="mb-4 text-4xl font-bold">
        Ready to elevate your badminton game?
      </h2>
      <p className="mb-6 text-xl">
        Join RACKET today and start improving your skills!
      </p>
      <button
        onClick={() => loginWithRedirect()}
        className="rounded-full bg-gray-800 px-6 py-3 font-bold text-white transition duration-300 hover:bg-gray-900"
      >
        Sign Up Now
      </button>
    </section>
  );
};

export default function Login() {
  return (
    <div>
      <Hero />
      <Features />
      <CTA />
    </div>
  );
}
