import { Loader2 } from "lucide-react";
import React from "react";

const Loading = () => {
  return (
    <div className="fixed inset-0 z-50 fc">
      <Loader2 className="size-10 animate-spin" />
      <span className="sr-only">Checking ...</span>
    </div>
  );
};

export default Loading;
