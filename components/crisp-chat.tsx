"use client";

import { useEffect } from "react";
import { Crisp } from "crisp-sdk-web";

export const CrispChat = () => {
  useEffect(() => {
    Crisp.configure("fc645e3d-1015-4e1b-bd99-f29eab74d3e8");
  }, []);

  return null;
};
