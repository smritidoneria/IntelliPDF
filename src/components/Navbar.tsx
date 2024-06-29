import Link from "next/link";
import MaxWidthWrapper from "./MaxWidthWrapper";
import {LoginLink, RegisterLink} from "@kinde-oss/kinde-auth-nextjs/components"
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import UserAccountNav from "./UerAccountNav";
import MobileNav from "./MobileNav";

const Navbar = async() => {

  const {getUser} = getKindeServerSession()
  const user = await getUser()
  return (
    <nav className="sticky h-14 inset-x-0 top-0 z-30 w-full border-b border-gray-200 bg-white/75 backdrop-blur-lg trasition-all">
      <MaxWidthWrapper>
        <div className="flex h-14 items-center justify-between border-b border-zinc-200">
            <Link href={'/'} className="flex  z-40 font-semibold">
                <span>Quill</span>
            </Link>

            <MobileNav isAuth={!!user}/>
            

            <div className="hidden items-center space-x-4 sm:flex">
                { !user?<>
                <Link href='/pricing'>Pricing</Link>
                <LoginLink>Sign in </LoginLink>
                <RegisterLink>Get started</RegisterLink>
                </>:<>
                <Link href='/dashboard'>Pricing</Link>

                <UserAccountNav name={
                  !user.given_name|| !user.family_name? "Your Accoubt":`${user.given_name} ${user.family_name}`
                } email={user.email??''} imageUrl={user.picture??''}/>
                </>}
            </div>
        </div>
      </MaxWidthWrapper>
    </nav>
  );
};

export default Navbar;
