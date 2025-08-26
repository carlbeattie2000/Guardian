import { useLocalSearchParams, useRouter } from "expo-router";
import { use, useEffect, useState } from "react";
import { ScrollView, View, Image } from "react-native";
import Map from "~/components/Map";
import ReportBadge from "~/components/ReportBadge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Text } from "~/components/ui/text";
import { UpdateReportStatusSelector } from "~/components/UpdateReportStatus";
import { AuthContext } from "~/contexts/Auth";
import { apiService, BASE_URL } from "~/services/apiService";

type ReportStatus = "PENDING" | "IN-PROGRESS" | "COMPLETED";

interface Report {
  id: number;
  description: string;
  status: ReportStatus;
  createdAt: string;
  longitude: number;
  latitude: number;
  images: ReportImage[];
}

interface ReportImage {
  image_path: string;
}

export default function Report() {
  const router = useRouter();
  const { isOfficer } = use(AuthContext);
  const { report_id } = useLocalSearchParams();
  const [report, setReport] = useState<Report | null>(null);
  const [updateStatusTo, setUpdateStatusTo] = useState<ReportStatus>(
    report?.status || "PENDING",
  );

  useEffect(() => {
    const getReport = async () => {
      const request = await apiService.get(`/api/v1/reports/${report_id}`);

      if (request.status === 200) {
        setReport(request.data.data);
      }
    };
    getReport();
  }, [report_id]);

  if (report === null) {
    return (
      <View>
        <Text>Report Not Found</Text>
      </View>
    );
  }

  return (
    <ScrollView className="h-full">
      <View className="flex gap-6 p-6">
        <View className="flex gap-1">
          <Text className="text-3xl font-bold">Report #{report.id}</Text>
          <Text className="text-sm text-muted-foreground font-bold">
            {report.createdAt}
          </Text>
          <ReportBadge status={report.status} />
        </View>

        <View className="flex gap-1.5">
          <Text className="text-2xl font-bold">Description</Text>
          <Text className="text-lg text-muted-foreground">
            {report.description}
          </Text>
        </View>

        <View className="h-[30vh]">
          <Map
            location={{
              latitude: report.latitude,
              longitude: report.longitude,
            }}
          />
        </View>

        <View className="flex flex-row gap-1.5">
          {report.images.map((imageToken, index) => {
            const uri = `${BASE_URL}/api/v1/files/?token=${imageToken}`;
            return (
              <Image
                key={index}
                source={{ uri }}
                style={{
                  borderRadius: 10,
                  borderWidth: 1,
                }}
                className="flex-1 h-[25vh] border-muted-foreground"
                resizeMode="cover"
                onError={(err) => {
                  console.log(err.nativeEvent.error);
                }}
              />
            );
          })}
        </View>

        {isOfficer && (
          <View className="flex flex-col gap-1.5">
            <AlertDialog className="w-full">
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="w-full">
                  <Text>Remove</Text>
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    this report and remove it from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>
                    <Text>Cancel</Text>
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onPress={async () => {
                      const response = await apiService.delete(
                        `/api/v1/reports/delete/${report.id}`,
                      );

                      if (response.status === 204) {
                        router.dismiss(2);
                      }
                    }}
                  >
                    <Text>Continue</Text>
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <Dialog className="w-full">
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Text>Update Status</Text>
                </Button>
              </DialogTrigger>
              <DialogContent className="w-[100vw]">
                <DialogHeader>
                  <DialogTitle>Update Report Status</DialogTitle>
                </DialogHeader>
                <View className="grid gap-4">
                  <UpdateReportStatusSelector
                    defaultValue={report.status}
                    setStatus={setUpdateStatusTo}
                  />
                </View>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">
                      <Text>Cancel</Text>
                    </Button>
                  </DialogClose>

                  <DialogClose asChild>
                    <Button
                      onPress={async () => {
                        if (updateStatusTo === report.status) {
                          return;
                        }

                        const response = await apiService.post(
                          `/api/v1/reports/update-status/${report.id}`,
                          { status: updateStatusTo },
                        );

                        if (response.status === 200) {
                          const reportResponse = await apiService.get(
                            `/api/v1/reports/${report.id}`,
                          );

                          if (reportResponse.status === 200) {
                            setReport(reportResponse.data.data);
                          }
                        }
                      }}
                    >
                      <Text>Save changes</Text>
                    </Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </View>
        )}
      </View>
    </ScrollView>
  );
}
