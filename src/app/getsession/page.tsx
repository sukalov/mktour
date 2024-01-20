// import { getServerSession } from 'next-auth/next';
// import { options } from '../api/auth/[...nextauth]/options';

import { auth } from "@/lib/auth/lucia";

export default async function Page() {
  headers()
  const session = await auth.readBearerToken()
  return <pre className="pt-24">{JSON.stringify(session, null, 2)}</pre>;
}
