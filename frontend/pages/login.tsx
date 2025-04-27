import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/router";
export default function Home() {
  const { data: session, status } = useSession();

  const router = useRouter();
  
  console.log("Session", session);

  if (status === "loading") return <p>Loading...</p>;

  if(status === "authenticated"){
    router.push("/");
  }


  return (
    <div>
      <div className="text-center font-bold text-3xl mb-4">
            Gmail Organiser
      </div>
      {!session ? (
        <div className="text-center">
          <button className="bg-blue-500 rounded text-white" onClick={() => signIn("google")}>Sign in with Google</button>
          </div>
      ) : (
        <>
          <h1>Welcome, {session.user?.name}</h1>
          <button onClick={() => signOut()}>Sign Out</button>
        </>
      )}
    </div>
  );
}
