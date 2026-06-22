"use client";
import Drawer from "./Drawer";
import NewBeneficiaryForm from "./NewBeneficiaryForm";

// Client wrapper so the function-child (closer) is created on the client.
export default function AddBeneficiaryDrawer() {
  return (
    <Drawer label="+ إضافة حالة" title="حالة مستفيد جديدة">
      {(close) => <NewBeneficiaryForm onSuccess={close} />}
    </Drawer>
  );
}
