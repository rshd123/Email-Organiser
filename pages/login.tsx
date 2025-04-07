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
      {!session ? (
        <button onClick={() => signIn("google")}>Sign in with Google</button>
      ) : (
        <>
          <h1>Welcome, {session.user?.name}</h1>
          <button onClick={() => signOut()}>Sign Out</button>
        </>
      )}
    </div>
  );
}
