"use client";

import { useEffect, useState } from "react";
import ServiceCheckComponent from "./ServiceCheckComponent";
import { animeBytesStatusHealth } from "@/lib/api/animebytes";
import { healthCheck } from "@/lib/api/qbittorent";
import { schedulerHealthCheck } from "@/lib/api/scheduler";

type ServiceStatus = {
  ok: boolean;
  reason?: string;
};

export default function StatusCheckComponent() {
  const [animeBytesStatus, setAnimeBytesStatus] = useState<ServiceStatus>({ ok: false});
  const [qbStatus, setQbStatus] = useState<ServiceStatus>({ ok: false });
  const [yukiSchedulerStatus, setYukiSchedulerStatus] = useState<ServiceStatus>({ ok: false });

  const listOfServices = [
    { name: "AnimeBytes", status: animeBytesStatus },
    { name: "qBittorrent", status: qbStatus }, // placeholder
    { name: "Yuki Scheduler", status: yukiSchedulerStatus }, // placeholder
  ];

  useEffect(() => {
    let mounted = true;

    async function checkAnimeBytes() {
      const result = await animeBytesStatusHealth();
      if (mounted) {
        setAnimeBytesStatus(result);
      }
    }

    async function checkQbittorrent() {
      const result = await healthCheck();

      if (mounted) {
        setQbStatus({
          ok: result.ok,
          reason: result.ok ? undefined : result.message,
        });
      }
    }
    async function checkYukiScheduler() {
      const result = await schedulerHealthCheck();

      if (mounted) {
        setYukiSchedulerStatus({
          ok: result.ok,
          reason: result.ok ? undefined : undefined,
        });
      }
    }

    // initial check
    checkAnimeBytes();

    // poll every 60s per API Spec
    const intervalAB = setInterval(checkAnimeBytes, 60000); 

    checkQbittorrent();

    const intervalQB = setInterval(checkQbittorrent, 5000); // 5 seconds in milliseconds

    checkYukiScheduler();

    const intervalYS = setInterval(checkYukiScheduler, 5000);

    // poll every 5s
    setInterval(checkQbittorrent, 5000);

    return () => {
      mounted = false;
      clearInterval(intervalAB);
      clearInterval(intervalQB);
      clearInterval(intervalYS);
    };
  }, []);

  return (
    <>
    <h1 className="text-3xl font-semibold pb-3 text-gray-700">System Status</h1>
    <div className="flex flex-col gap-3 flex-wrap w-full">
      {listOfServices.map((service, index) => (
        <div key={index}>
          <ServiceCheckComponent
            key={service.name + index}
            name={service.name}
            status={service.status.ok}
            reason={service.status.reason}
          />
        </div>
      ))}
    </div>
    </>
  );
}
