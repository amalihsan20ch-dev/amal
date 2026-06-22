"use client";
import Drawer from "./Drawer";
import NewTaskForm from "./NewTaskForm";
export default function AddTaskDrawer({ volunteers }) {
  return (
    <Drawer label="+ مهمة" title="مهمة جديدة">
      {(close) => <NewTaskForm volunteers={volunteers} onSuccess={close} />}
    </Drawer>
  );
}
