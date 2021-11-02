import { signIn, useSession } from "next-auth/client";
import { useRouter } from "next/router";
import React from "react";
import { api } from "../../services/api";
import { getStripeJs } from "../../services/stripe-js";

import styles from "./styles.module.scss";

const SubscribeButton: React.FC = () => {
  const [session] = useSession();
  const router = useRouter();

  async function handleSubscribe() {
    if (!session) {
      signIn("github");
      return;
    }

    if (session.activeSubscription) {
      router.push("/posts");
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
