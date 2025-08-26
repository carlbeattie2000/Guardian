import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, View } from "react-native";
import ReportBadge from "~/components/ReportBadge";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Text } from "~/components/ui/text";
import { apiService } from "~/services/apiService";

interface Report {
  id: number;
  description: string;
  status: "PENDING" | "IN-PROGRESS" | "COMPLETED";
}

export default function Reports() {
  const router = useRouter();

  const [reports, setReports] = useState<Report[]>([]);

  useEffect(() => {
    const getReports = async () => {
      const request = await apiService.get("/api/v1/reports");

      if (request.status === 200) {
        setReports(request.data.data);
      }
    };

    getReports();
  }, []);
  return (
    <ScrollView>
      <View className="flex-1 gap-6 p-6">
        {reports.map((report, index) => {
          return (
            <Card className="w-full max-w-sm" key={index}>
              <CardHeader className="flex-row">
                <View className="flex-1 gap-1.5">
                  <CardTitle>Report #{report.id} </CardTitle>
                  <ReportBadge status={report.status} />
                  <CardDescription>{report.description}</CardDescription>
                </View>
              </CardHeader>

              <CardFooter className="flex-row">
                <View className="flex gap-1.5 w-full">
                  <Button
                    variant="secondary"
                    className="w-full"
                    onPress={() => router.navigate(`/${report.id}`)}
                  >
                    <Text>View Report</Text>
                  </Button>
                </View>
              </CardFooter>
            </Card>
          );
        })}
      </View>
    </ScrollView>
  );
}
