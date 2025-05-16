import { useEffect } from "react";

const umamiUrl = import.meta.env.VITE_UMAMI_URL;
const umamiSiteId = import.meta.env.VITE_UMAMI_SITE_ID;

export const UmamiScript = () => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = umamiUrl;
    script.setAttribute("data-website-id", umamiSiteId);
    script.defer = true;
    script.async = true;
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  return null;
};
