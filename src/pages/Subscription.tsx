import { SubscriptionPlans } from "@/components/subscription/SubscriptionPlans";
import { SubscriptionStatus } from "@/components/subscription/SubscriptionStatus";
import ClientLayout from "@/components/layout/ClientLayout";

export default function Subscription() {
  return (
    <ClientLayout>
      <div className="space-y-8">
        <SubscriptionStatus />
        <SubscriptionPlans />
      </div>
    </ClientLayout>
  );
}