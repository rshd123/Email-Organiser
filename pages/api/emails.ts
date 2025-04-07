import { getToken } from "next-auth/jwt";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    console.log("My Token:", token?.accessToken);

    
    if (!token || !token.accessToken) {
      return res.status(401).json({ error: process.env.NEXTAUTH_SECRET });
    }
  
    const response = await fetch(
      `https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=10`,
      {
        headers: {
          Authorization: `Bearer ${token.accessToken}`,
        },
      }
    );

  
    const {messages} = await response.json();

    const emailDetails = await Promise.all(
      messages.map(async (msg: any) => {
        const res = await fetch(
          `https://gmail.googleapis.com/gmail/v1/users/me/messages/${msg.id}`,
          {
            headers: {
              Authorization: `Bearer ${token.accessToken}`,
            },
          }
        );
        const data = await res.json();
        return data;
      })
    );
    res.status(200).json(emailDetails);
  
  } catch (err) {
    console.error("Error fetching emails:", err);
  }
}
