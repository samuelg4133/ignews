import { options, signIn, useSession } from "next-auth/client";
import React from "react";
import { api } from "../../services/api";
import { getStripeJs } from "../../services/stripe-js";

import styles from "./styles.module.scss";

interface SubscribeButtonProps {
  priceId: string;
}

const SubscribeButton: React.FC<SubscribeButtonProps> = ({ priceId }) => {
  const [session] = useSession();
  async function handleSubscribe() {
    if (!session) {
      signIn("github");
      return;
    }

    try {
      const res = await api.post("/subscribe");

      const { sessionId } = res.data;
      const stripe = await getStripeJs();

      await stripe.redirectToCheckout({ sessionId });
    } catch (err) {
      alert(err.message);
      console.error(err);
    }
  }
  return (
    <button className={styles.subscribeButton} onClick={handleSubscribe}>
      Subscribe now
    </button>
  );
};

export default SubscribeButton;
