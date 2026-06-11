"use client";

import { useCallback, useEffect, useState } from "react";
import type { Session } from "./auth";
import {
  disableNotifications,
  enableNotifications,
  getNotificationSettings,
  type NotificationSettings,
} from "./notifications";

const INITIAL_SETTINGS: NotificationSettings = {
  status: "default",
  enabled: false,
};

export function useNotificationSettings(session: Session | null) {
  const [settings, setSettings] = useState<NotificationSettings>(INITIAL_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    const next = await getNotificationSettings();
    setSettings(next);
    setLoading(false);
  }, []);

  useEffect(() => {
    let active = true;
    getNotificationSettings().then((next) => {
      if (!active) return;
      setSettings(next);
      setLoading(false);
    });

    return () => {
      active = false;
    };
  }, []);

  async function enable() {
    if (!session) return;
    setSaving(true);
    const next = await enableNotifications(session);
    setSettings(next);
    setSaving(false);
  }

  async function disable() {
    if (!session) return;
    setSaving(true);
    const next = await disableNotifications(session);
    setSettings(next);
    setSaving(false);
  }

  return { settings, loading, saving, enable, disable, refresh };
}
