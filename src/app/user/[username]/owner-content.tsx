import { ProfileProps } from "@/app/user/[username]/page";
import { FC } from "react";

const OwnerContent: FC<{ props: ProfileProps }> = (data) => {
  return (
    <div className="w-full">
      you're the owner of this page
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
};

export default OwnerContent;
