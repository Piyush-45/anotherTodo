// Import the Stripe library
import Stripe from "stripe";

// Initialize the Stripe client with your secret key from environment variables
// and specify API version and TypeScript settings
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2024-04-10", // Specify the Stripe API version to use
  typescript: true,         // Enable TypeScript support
});

// Define an asynchronous function to create a Stripe Checkout session
export const createStripeSession = async ({
  priceId,   // Price ID for the subscription (from .env file)
  domainUrl, // URL of the domain (localhost in local development, deployment URL in production)
  customerId // ID of the customer and to get that id we need to make sure that we are creating the customer id while authenticating the user and creating a customer id at that time , so go to layout file in dashboard and create it  it has red comment
  
}: {
  priceId: string;
  domainUrl: string;
  customerId: string;
}) => {
  // !Create a Stripe Checkout session
  const session = await stripe.checkout.sessions.create({
    customer: customerId,           // Customer ID for the session
    mode: 'subscription',           // Mode of the session (subscription in this case)
    billing_address_collection: 'auto', // Automatically collect billing address
    line_items: [{                  // Define line items for the session
      price: priceId,               // The price ID for the subscription
      quantity: 1                   // Quantity of the item
    }],
    payment_method_types: ['card'], // Only allow card payments
    customer_update: {              // Automatically update customer details
      address: 'auto',              // Auto-update customer's address
      name: 'auto',                 // Auto-update customer's name
    },
    success_url: `${domainUrl}/payement/success`, // Redirect URL after successful payment
    cancel_url: `${domainUrl}/payement/cancelled`, // Redirect URL if payment is cancelled
  });

  // Return the URL of the created session
  return session.url as string;
};
