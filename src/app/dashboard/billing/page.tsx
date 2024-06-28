import { getUserSubscriptionPlan } from "@/lib/stripe"
import BillingForm from "@/components/BillingForm"

const Page=async()=>{
    const subsciptionPlan=await getUserSubscriptionPlan()

    return <BillingForm subsciptionPlan={subsciptionPlan}/>
}

export default Page