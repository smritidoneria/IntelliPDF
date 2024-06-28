"use client";

import { getUserSubscriptionPlan } from "@/lib/stripe";
import { useToast } from "./ui/use-toast";
import { trpc } from "@/app/_trpc/client";
import MaxWidthWrapper from "./MaxWidthWrapper";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";

interface BillingFormProps {
  subsciptionPlan: Awaited<ReturnType<typeof getUserSubscriptionPlan>>;
}

const BillingForm = ({ subsciptionPlan }: BillingFormProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const { mutate: createStripeSession } = trpc.createStripeSession.useMutation({
    onMutate: () => {
      setIsLoading(true);
    },
    onSuccess: ({ url }) => {
      if (url) window.location.href = url;
      if (!url) {
        toast({
          title: "There was a problem",
          description: "Please try again later",
          variant: "destructive",
        });
      }
    },
  });

  return (
    <MaxWidthWrapper className="max-w-5xl">
      <form
        className="mt-12"
        onSubmit={(e) => {
          e.preventDefault();
          createStripeSession();
        }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Subscription Plan</CardTitle>
            <CardDescription>
              You are currently on the {""}
              <strong>{subsciptionPlan.name}</strong>plan period
            </CardDescription>
          </CardHeader>

          <CardFooter className="flex flex-col items-start space-y-2 md:flex-row md:justify-between md:space-x-0">
            <Button type="submit">
              {isLoading ? (
                <Loader2 className="mr-4 h-4 w-4 animate-spin" />
              ) : null}
              {subsciptionPlan.isSubscribed
                ? "Manage Subscription"
                : "Upgrade Now"}
            </Button>

            {subsciptionPlan.isSubscribed && (
              <p className="rounded-full text-xs font-medium">
                {subsciptionPlan.isCanceled
                  ? "Your plan will be cancelled on "
                  : "Your plan renews on "}
                {format(subsciptionPlan.stripeCurrentPeriodEnd!, "dd.MM.yyyy")}
              </p>
            )}
          </CardFooter>
        </Card>
      </form>
    </MaxWidthWrapper>
  );
};

export default BillingForm;
