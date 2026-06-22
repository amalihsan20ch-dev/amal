"use client";
import Drawer from "./Drawer";
import NewAchievementForm from "./NewAchievementForm";
export default function AddAchievementDrawer() {
  return (
    <Drawer label="+ عمل جديد" title="إضافة عمل / إنجاز">
      {(close) => <NewAchievementForm onSuccess={close} />}
    </Drawer>
  );
}
