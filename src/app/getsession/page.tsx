// import { getServerSession } from 'next-auth/next';
// import { options } from '../api/auth/[...nextauth]/options';

export default async function Page() {
  const session = null // const session = await getServerSession(options);
  return <pre className="pt-24">{JSON.stringify(session, null, 2)}</pre>;
}
