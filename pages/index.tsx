import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

interface Header {
  name: string;
  value: string;
}

interface Email {
  id: string;
  threadId: string;
  snippet: string;
  labelIds: string[];
  internalDate: string;
  payload: {
    headers: Header[];
  };
}

export default function Home() {
  const router = useRouter();
  const [emails, setEmails] = useState<Email[]>([]);
  const [labelFilter, setLabelFilter] = useState<string>('ALL');
  const [dateFilter, setDateFilter] = useState<string>('ALL');

  const [fromDate, setFromdate] = useState<string>('');
  const [toDate, setTodate] = useState<string>('');

  const { data: session, status } = useSession();

  useEffect(() => {
    const fetchEmails = async () => {
      const res = await fetch('/api/emails', {
        credentials: 'include',
      });
      const data = await res.json();
      console.log(data);
      setEmails(data);
    };
    fetchEmails();
  }, []);

  if (status === 'loading') return <p>Loading...</p>;
  if (status === 'unauthenticated') {
    router.push('/login');
    return null;
  }

  const getSender = (headers: Header[]) => {
    const fromHeader = headers.find((h) => h.name === 'From');
    return fromHeader?.value || 'Unknown Sender';
  };

  // Filtered emails based on dropdowns
  const filteredEmails = emails.filter((email) => {
    const date = new Date(Number(email.internalDate));

    const isLabelMatch = labelFilter === 'ALL' || email.labelIds.includes(labelFilter);

    const isDateMatch =
      dateFilter === 'ALL' ||
      (dateFilter === 'RECENT' && Date.now() - date.getTime() < 7 * 24 * 60 * 60 * 1000) || // last 7 days
      (dateFilter === 'OLDER' && Date.now() - date.getTime() >= 7 * 24 * 60 * 60 * 1000); //after 7 days

  
    const from = fromDate ? new Date(fromDate) : null;
    const to = toDate ? new Date(toDate) : null;
  
    // Normalize dates to compare only the date part
    if (from) {
      from.setHours(0, 0, 0, 0);
    }
    if (to) {
      to.setHours(23, 59, 59, 999);
    }
  
    const isAfterFrom = from ? date >= from : true;
    const isBeforeTo = to ? date <= to : true;
  
    const isDateRangeMatch = isAfterFrom && isBeforeTo;
  
    return isLabelMatch && isDateMatch && isDateRangeMatch;
  });

  return (
    emails.length === 0 ? (<div className=' m-10 w-20 h-20 border-5 border-gray-200 border-t-blue-500 rounded-full animate-spin'></div>) :
      (
        <>
          <div className="text-center font-bold text-3xl mb-4">
            Find Your Gmail
          </div>

          <div className="flex justify-center gap-4 mb-4">
            <select
              className="border px-2 py-1 rounded"
              onChange={(e) => setLabelFilter(e.target.value)}
            >
              <option value="ALL">All</option>
              <option value="INBOX">Inbox</option>
              <option value="SENT">Sent</option>
              <option value="CATEGORY_PROMOTIONS">Promotions</option>
            </select>

            <select
              className="border px-2 py-1 rounded"
              onChange={(e) => setDateFilter(e.target.value)}
            >
              <option value="ALL">All Time</option>
              <option value="RECENT">Last 7 Days</option>
              <option value="OLDER">Older than 7 Days</option>
            </select>

            <label>
              From: &nbsp;
              <input
                className='border rounded'
                type='date'
                value={fromDate}
                onChange={(e)=>setFromdate(e.target.value)}
              />
            </label>
            <label>
              To: &nbsp;
              <input
                className='border rounded'
                type='date'
                value={toDate}
                onChange={(e)=>setTodate(e.target.value)}
              />
            </label>
          </div>

          <div>

            {filteredEmails.map((email) => (
              <div key={email.id} className="border-2 border-black m-2 p-2 rounded-xl">
                <p>
                  <b>Date Recieved:</b> <i>{new Date(Number(email.internalDate)).toLocaleString()}</i>
                  <br />
                  <b>Sender:</b> <i>{getSender(email.payload.headers)}</i>
                </p>
                <p><b>Content: </b>{email.snippet}</p>
              </div>
            ))}
          </div>
        </>
      )

  );
}
