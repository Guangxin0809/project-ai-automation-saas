import {
  CheckCircle2Icon,
  ClockIcon,
  Loader2Icon,
  XCircleIcon
} from "lucide-react";

import { ExecutionStatus } from "@/generated/prisma/enums";

export const getStatusIcon = (status: ExecutionStatus) => {
  switch (status) {
    case "SUCCESS":
      return (<CheckCircle2Icon className="size-5 text-green-600" />);
    case "FAILED":
      return (<XCircleIcon className="size-5 text-red-600" />);
    case "RUNNING":
      return (<Loader2Icon className="size-5 text-blue-600 animate-spin" />);
    default:
      return (<ClockIcon className="size-5 text-muted-foreground" />);
  }
}

export const formatStatus = (status: ExecutionStatus) => {
  return status.charAt(0) + status.slice(1).toLowerCase();
}