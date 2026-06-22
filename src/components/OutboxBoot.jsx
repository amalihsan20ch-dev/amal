"use client";
import { useEffect } from "react";
import { initOutbox } from "@/lib/outbox";

// Tiny client boot component: starts the offline sync listener once.
export default function OutboxBoot() {
  useEffect(() => { initOutbox(); }, []);
  return null;
}
