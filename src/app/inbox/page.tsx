import getUserNotifications from '@/lib/actions/get-user-notifications';

const Page = async () => {
  const res = await getUserNotifications();

  return <pre>{JSON.stringify(res, null, 2)}</pre>;
};

export default Page;
