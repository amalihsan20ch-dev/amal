"use client";
import { useFormState } from "react-dom";
import { saveSettings } from "@/app/(dashboard)/crm/settings-actions";
import SubmitButton from "./SubmitButton";

export default function SettingsForm({ chatId, notify }) {
  const [state, action] = useFormState(saveSettings, { ok: false });
  return (
    <form action={action} className="card max-w-lg space-y-4 p-6">
      <label className="block">
        <span className="mb-1 block text-sm font-bold text-ink-soft">معرّف محادثة تيليجرام (chat_id)</span>
        <input name="telegram_chat_id" defaultValue={chatId} placeholder="-1001234567890" className="inp" />
        <span className="mt-1 block text-xs text-ink-soft">يتجاوز قيمة البيئة. التوكن يبقى في إعدادات Vercel للأمان.</span>
      </label>
      <label className="flex items-center gap-2">
        <input name="notify_new_volunteer" type="checkbox" defaultChecked={notify} className="h-4 w-4" />
        <span className="text-sm font-bold text-ink-soft">تفعيل إشعار تيليجرام عند تسجيل متطوّع</span>
      </label>
      {state?.ok ? <p className="text-sm font-bold text-brand-600">تم الحفظ.</p> : null}
      {state?.error ? <p className="text-sm text-red-600">{state.error}</p> : null}
      <SubmitButton>حفظ الإعدادات</SubmitButton>
    </form>
  );
}
