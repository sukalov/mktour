import { validateRequest } from "@/lib/auth/lucia";
import { redirect } from "next/navigation";

const UserPage = async () => {
  const { user } = await validateRequest()
  if (!user) redirect('/sign-in');
  redirect(`/user/${user.username}`)
}

export default UserPage