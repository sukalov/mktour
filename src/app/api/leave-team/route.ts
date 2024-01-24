import { cookies } from "next/headers";

export async function POST(request: Request) {
    const token = cookies().get('token')?.value;
    console.log(token)
    const response = await fetch('https://lichess.org/team/mktour/quit', 
    { method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    if (response.ok) return new Response(null, {status: 200});
    return new Response(null, {status: 500})
}