"use client";
import Drawer from "./Drawer";
import NewDonorForm from "./NewDonorForm";
import LogDonationForm from "./LogDonationForm";

export default function DonorActions({ donors }) {
  return (
    <div className="flex gap-2">
      <Drawer label="+ متبرّع" title="متبرّع جديد">
        {(close) => <NewDonorForm onSuccess={close} />}
      </Drawer>
      <Drawer label="+ تسجيل تبرّع" title="تسجيل تبرّع" buttonClass="btn-warm">
        {(close) => <LogDonationForm donors={donors} onSuccess={close} />}
      </Drawer>
    </div>
  );
}
