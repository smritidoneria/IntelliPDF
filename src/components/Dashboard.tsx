"use client";
import React, { useEffect, useState } from "react";
import UploadButtons from "./UploadButtons";
import { trpc } from "@/app/_trpc/client";
import { Ghost, Loader2, MessageSquare, Plus, Trash } from "lucide-react";
import Skeleton from "react-loading-skeleton";
import Link from "next/link"; // Import Link from next/link
import { format } from "date-fns";
import { Button } from "./ui/button";
import { getUserSubscriptionPlan } from "@/lib/stripe";


interface pageProps {
  subscriptionPlan: Awaited<ReturnType<typeof getUserSubscriptionPlan>>;
}

const Dashboard = ({subscriptionPlan}:pageProps) => {
  const [currentlyDeleting, setCurrentlyDeleting] = useState<string | null>(
    null
  );

  const utils = trpc.useUtils();
  const { data: files, isLoading, error } = trpc.getUserFiles.useQuery();

  const { mutate: deletedFile } = trpc.deleteFile.useMutation({
    onSuccess: () => {
      utils.getUserFiles.invalidate();
    },
    onMutate({ id }) {
      setCurrentlyDeleting(id);
    },
    onSettled() {
      setCurrentlyDeleting(null);
    },
  });

  // Log data and errors to the console
  useEffect(() => {
    console.log("Fetched files:", files);
    if (error) {
      console.error("Error fetching files:", error);
    }
  }, [files, error]);

  return (
    <main className="mx-auto max-w-7xl md:p-10">
      <div className="mt-8 flex flex-col items-start justify-between gap-4 border-b border-gray-200 pb-5 sm:flex-row sm:items-center sm:gap-0">
        <h1 className="mb-3 font-bold text-5xl text-black">My files</h1>
        <UploadButtons isSubscribed={subscriptionPlan.isSubscribed} />
      </div>

      {isLoading ? (
        <Skeleton height={100} className="my-2" count={3} />
      ) : files && files.length > 0 ? (
        <ul className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {files
            .sort(
              (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
            )
            .map((file) => (
              <li
                key={file.id}
                className="col-span-1 divide-y divide-gray-200 rounded-lg bg-white shadow transition hover:shadow-lg"
              >
                <Link
                  href={`/dashboard/${file.id}`}
                  className="flex flex-col gap-2"
                >
                  <div className="pt-6 px-6 flex w-full items-center justify-between space-x-6">
                    <div className="h-10 w-10 flex-shrink-0 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500" />
                    <div className="flex-1 truncate">
                      <div className="flex items-center space-x-3">
                        <h3 className="truncate text-lg font-medium text-zinc-900">
                          {file.name}
                        </h3>
                      </div>
                    </div>
                  </div>
                </Link>
                <div className=" mt-4 grid grid-cols-4 place-items-center py-2 gap-6 text-xa text-zinc-500">
                  <div className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    {format(new Date(file.createdAt), "MMM yyyy")}
                  </div>
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 " />
                    mocked
                  </div>

                  <Button onClick={() => deletedFile({ id: file.id })}>
                    {currentlyDeleting === file.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </li>
            ))}
        </ul>
      ) : (
        <div className="mt-16 flex flex-col items-center gap-2">
          <Ghost className="h-8 w-8 text-zinc-800" />
          <h3 className="font-semibold text-xl">Empty around here</h3>
          <p>Let upload your first PDF</p>
        </div>
      )}
    </main>
  );
};

export default Dashboard;
