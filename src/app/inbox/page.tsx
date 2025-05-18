'use client';

import { useEffect, useState } from 'react';

const Page = () => {
  const [inbox, setInbox] = useState(null);

  useEffect(() => {
    fetch('/api/user')
      .then((res) => res.json())
      .then(setInbox);
  }, []);

  return <pre>{JSON.stringify(inbox, null, 1)}</pre>;
};

export default Page;
