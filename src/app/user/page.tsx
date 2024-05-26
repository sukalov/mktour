import { getUser } from "@/lib/auth/utils";
import { redirect } from "next/navigation";

export default async function UserRoot () {
    const user = await getUser()
    redirect(`/user/${user.username}`)
}