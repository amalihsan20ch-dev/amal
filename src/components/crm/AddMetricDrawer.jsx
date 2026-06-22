"use client";
import Drawer from "./Drawer";
import CreateMetricForm from "./CreateMetricForm";

export default function AddMetricDrawer() {
  return (
    <Drawer label="+ مؤشر جديد" title="مؤشر أثر جديد">
      {(close) => <CreateMetricForm onSuccess={close} />}
    </Drawer>
  );
}
