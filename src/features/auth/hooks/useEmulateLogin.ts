import React from "react";

import { useEffectOnce } from "usehooks-ts";

import { apiEmulateLogin } from "../api";
import { useAuth } from "../provider";

export const useEmulateLogin = () => {
  const { initializeSession } = useAuth();

  const [isEmulating, setIsEmulating] = React.useState(false);

  useEffectOnce(() => {
    const queryParams = new URLSearchParams(window.location.search);

    const id = queryParams.get("id");
    const hash = queryParams.get("hash");

    if (id && hash) {
      setIsEmulating(true);
      apiEmulateLogin({ id, hash })
        .then((response) => {
          initializeSession(response.token, response.user);
        })
        .finally(() => {
          setIsEmulating(false);
        });
    }
  });

  return { isEmulating };
};
