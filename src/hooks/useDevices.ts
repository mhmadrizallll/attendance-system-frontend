import { useState } from "react";

import { getDevices } from "@/services/deviceService";

export function useDevices() {
  const [devices, setDevices] = useState<any[]>([]);

  const [loading, setLoading] = useState(false);

  const fetchDevices = async () => {
    try {
      // ✅ loading overlay only
      setLoading(true);

      const res = await getDevices();

      // ✅ jangan clear dulu
      setDevices(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      // ✅ kasih delay dikit biar smooth
      setTimeout(() => {
        setLoading(false);
      }, 300);
    }
  };

  return {
    devices,
    loading,
    fetchDevices,
  };
}
