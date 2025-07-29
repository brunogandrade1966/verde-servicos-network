import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[SYNC-STRIPE-PLANS] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    { auth: { persistSession: false } }
  );

  try {
    logStep("Function started");

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header provided");

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError) throw new Error(`Authentication error: ${userError.message}`);
    const user = userData.user;
    if (!user?.email) throw new Error("User not authenticated");

    // Verify user is admin
    const { data: profile, error: profileError } = await supabaseClient
      .from('profiles')
      .select('user_type')
      .eq('id', user.id)
      .single();

    if (profileError || profile?.user_type !== 'admin') {
      throw new Error("Access denied: Admin privileges required");
    }

    const { plans } = await req.json();
    if (!plans || !Array.isArray(plans)) {
      throw new Error("Plans array is required");
    }

    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });
    
    const syncedPlans = [];
    
    for (const plan of plans) {
      if (plan.price === 0) {
        // Skip free plans
        syncedPlans.push({ ...plan, stripe_product_id: null, stripe_price_id: null });
        continue;
      }

      logStep(`Processing plan: ${plan.name}`);
      
      // Create or update Stripe product
      let product;
      const existingProducts = await stripe.products.list({ 
        limit: 100 
      });
      
      const existingProduct = existingProducts.data.find(p => 
        p.metadata?.plan_id === plan.id
      );

      if (existingProduct) {
        product = await stripe.products.update(existingProduct.id, {
          name: plan.name,
          description: plan.description,
          metadata: {
            plan_id: plan.id,
            user_type: plan.user_type
          }
        });
      } else {
        product = await stripe.products.create({
          name: plan.name,
          description: plan.description,
          metadata: {
            plan_id: plan.id,
            user_type: plan.user_type
          }
        });
      }

      // Create or update Stripe price
      const existingPrices = await stripe.prices.list({
        product: product.id,
        limit: 100
      });

      const targetAmount = Math.round(plan.price * 100); // Convert to cents
      let price = existingPrices.data.find(p => 
        p.unit_amount === targetAmount && 
        p.currency === 'brl' &&
        p.recurring?.interval === 'month'
      );

      if (!price) {
        price = await stripe.prices.create({
          product: product.id,
          unit_amount: targetAmount,
          currency: 'brl',
          recurring: { interval: 'month' },
          metadata: {
            plan_id: plan.id
          }
        });
      }

      syncedPlans.push({
        ...plan,
        stripe_product_id: product.id,
        stripe_price_id: price.id
      });

      logStep(`Synced plan: ${plan.name}`, { 
        productId: product.id, 
        priceId: price.id 
      });
    }

    logStep("All plans synced successfully");

    return new Response(JSON.stringify({ 
      success: true, 
      plans: syncedPlans 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in sync-stripe-plans", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});