// import { getServerSession } from 'next-auth/next';
// import { options } from '../api/auth/[...nextauth]/options';

import { auth } from "@/lib/auth/lucia";
import { getUserAuth } from "@/lib/auth/utils";

export default async function Page() {
  const { session } = await getUserAuth()
  return <pre className="pt-24">{JSON.stringify(session, null, 2)}</pre>;
}
