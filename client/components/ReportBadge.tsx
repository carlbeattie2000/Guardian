import { StyleSheet } from "react-native";
import { Badge } from "./ui/badge";
import { Text } from "./ui/text";

interface ReportBagdeProps {
  status: "PENDING" | "IN-PROGRESS" | "COMPLETED";
}

export default function ReportBadge({ status }: ReportBagdeProps) {
  let badgeStyles = "";
  let badgeTextStyles = "";

  switch (status) {
    case "PENDING":
      break;
    case "IN-PROGRESS":
      badgeStyles = "bg-yellow-400";
      badgeTextStyles = "text-yellow-900";
      break;
    case "COMPLETED":
      badgeStyles = "bg-green-400";
      badgeTextStyles = "text-green-900";
      break;
    default:
      break;
  }

  return (
    <Badge
      variant={status === "PENDING" ? "destructive" : "default"}
      className={badgeStyles + " w-1/3"}
    >
      <Text className={badgeTextStyles}>{status}</Text>
    </Badge>
  );
}
