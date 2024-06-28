import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { PLANS } from "@/config/stripe";
import { cn } from "@/lib/utils";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { TooltipContent, TooltipProvider } from "@radix-ui/react-tooltip";
import { get } from "http";


const pricingItems = [
  {
    plan: 'Free',
    tagline: 'For small side projects.',
    quota: 10,
    features: [
      {
        text: '5 pages per PDF',
        footnote: 'The maximum amount of pages per PDF-file.',
      },
      {
        text: '4MB file size limit',
        footnote: 'The maximum file size of a single PDF file.',
      },
      {
        text: 'Mobile-friendly interface',
      },
      {
        text: 'Higher-quality responses',
        footnote: 'Better algorithmic responses for enhanced content quality',
        negative: true,
      },
      {
        text: 'Priority support',
        negative: true,
      },
    ],
  },
  {
    plan: 'Pro',
    tagline: 'For larger projects with higher needs.',
    quota: PLANS.find((p) => p.slug === 'pro')!.quota,
    features: [
      {
        text: '25 pages per PDF',
        footnote: 'The maximum amount of pages per PDF-file.',
      },
      {
        text: '16MB file size limit',
        footnote: 'The maximum file size of a single PDF file.',
      },
      {
        text: 'Mobile-friendly interface',
      },
      {
        text: 'Higher-quality responses',
        footnote: 'Better algorithmic responses for enhanced content quality',
      },
      {
        text: 'Priority support',
      },
    ],
  },
]

const Page = () => {
  const { getUser } = getKindeServerSession();
  const user = getUser();
  return (
    <>
      <MaxWidthWrapper className="mb-8 mt-24 text-center max-w-5xl">
        <div className=" mx-auto mb-10 sm:max-w-lg ">
          <h1 className="text-6xl font-bold sm:text-7xl">Pricing</h1>
          <p className="mt-5 text-gray-600 sm:text-lg">
            whether you&pos;re just trying out our servide or need more, we
            &pos; we got you covered.
          </p>
        </div>

        <div className="pt-12 grig grid-col-1 gap-10 lg:grid-cols-2">
        <TooltipProvider>
  {pricingItems.map(({plan,tagline,quota,features}) => {
    const price = PLANS.find((p) => p.slug.toLowerCase() === plan.toLowerCase())?.prices.amount || 0;
    
    return (
      <div 
        key={plan} 
        className={cn("relative rounded-2xl bh-white shadow-lg", {
          "border-2 border-blue-600 shadow-blue-200": plan === "Pro",
          "border border-gray-200": plan === "Free",
        })}
      ></div>
    );
  })}
</TooltipProvider>
        </div>
      </MaxWidthWrapper>
    </>
  );
};


export default Page;