import { useEffect, useRef } from "react";
import Pusher from "pusher-js";
import { SOCKET_PUSHER_CLUSTER, SOCKET_PUSHER_KEY } from "@/config";

interface PusherHook {
  pusher: Pusher | null;
}

function usePusher(): PusherHook {
  const pusherRef = useRef<Pusher | null>(null);

  useEffect(() => {
    if (!pusherRef.current) {
      pusherRef.current = new Pusher(SOCKET_PUSHER_KEY, { cluster: SOCKET_PUSHER_CLUSTER });
    }

    return () => {
      // Dezabonați-vă de la canale sau eliberați resursele, dacă este necesar
    };
  }, []);

  return { pusher: pusherRef.current };
}

export default usePusher;
