import Link from "next/link";
import Image from "next/image";
import Logo from "./leblanc-logo.jpg"

const LandingPage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-brand-cream">
      <main className="max-w-xl p-6 bg-white rounded-lg shadow-md">
        <Image
          src={Logo}
          alt="LeBlanc Logo"
          width={50}
          className="mx-auto my-2"
        />
        <h1 className="text-3xl text-center text-gray-900 mb-8">
          Welcome to <br/> BlancTrack.
        </h1>
        <div className="flex justify-center space-x-4">
          <Link href="/login">
            <h3 className="px-6 py-3 text-lg font-medium text-white bg-brand-brown rounded-lg hover:bg-brand-lgreen focus:outline-none">
              Log In
            </h3>
          </Link>
          <Link href="/signup">
            <h3 className="px-6 py-3 text-lg font-medium text-white bg-brand-brown rounded-lg hover:bg-brand-lgreen focus:outline-none">
              Sign Up
            </h3>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default LandingPage;