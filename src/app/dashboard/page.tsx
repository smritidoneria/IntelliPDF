import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server"
import { redirect } from "next/navigation"

const Page = async () => {
    const { getUser } = await getKindeServerSession()
    const user = await getUser()
    console.log("*****", user);

    if (!user || !user.id) {
        redirect('/auth-callback?origin=dashboard')
        return null;  // Prevent further rendering if redirecting
    }

    return <div>{user.email}</div>
}

export default Page
