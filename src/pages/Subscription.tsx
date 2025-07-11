import { SubscriptionPlans } from "@/components/subscription/SubscriptionPlans";
import { SubscriptionStatus } from "@/components/subscription/SubscriptionStatus";

export default function Subscription() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <SubscriptionStatus />
      <SubscriptionPlans />
    </div>
  );
}