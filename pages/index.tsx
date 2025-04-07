import React from 'react';
import { useEffect,useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

interface Email {
  id: string;
  threadId: string;
  payload:string,
}

export default function Home(){

  const router = useRouter();
  const [emails, setEmails] = useState<Email[]>([]);

  useEffect(()=>{
    const fetchEmails = async () =>{
      const res = await fetch('/api/emails',{
        credentials: 'include',
      });
      const data = await res.json();
      setEmails(data);
    }
    fetchEmails();

  },[]);

  const { data: session, status } = useSession();

  if (status === "loading") return <p>Loading...</p>;

  if (status === "unauthenticated"){
    router.push("/login");
  }


  return (
    <>
      <div className='text-center font-bold text-3xl'>
        Smart Email Organiser
      </div>

      <div>
        <p>Welcome, {session?.user?.name}</p>
      </div>
      <div>
        <h1 className='text-center font-bold text-2xl'>Your Emails</h1>
        {emails.map((email)=>{
          return (
            <div key={email.id} className='border-2 border-black m-2 p-2'>
              <p>{email.payload}</p>
            </div>
          )
        })}
      </div>
    </>
  );
}