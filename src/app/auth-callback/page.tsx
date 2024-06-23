"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { trpc } from "../_trpc/client";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

// Define the response type
type AuthCallbackResponse = {
    success: boolean;
};

const Page = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const origin = searchParams.get('origin');
   // console.log("trpccallback", trpc.authCallback.useQuery());

    const { data, isLoading, error } = trpc.authCallback.useQuery();
    console.log("data", data);
    console.log("error", error);

    useEffect(() => {
        if (data?.success) {
            router.push(origin ? `/${origin}` : '/dashboard');
        }
    }, [data, origin, router]);

    useEffect(() => {
        if (error) {
            console.error(error);
            if (error.data?.code === 'UNAUTHORIZED') {
                router.push('/sign-in');
            }
        }
    }, [error, router]);

    

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="w-full mt-24 flex justify-center">
            <div className="flex flex-col items-center gap-2">
                <Loader2 className="h-8 w-8 animate-spin text-zinc-500" />
                <h3 className="font-semibold text-xl">Setting up the account</h3>
                <p>You will be redirected automatically</p>
            </div>
        </div>
    );
};

export default Page;
