import * as Haptics from "expo-haptics";
import * as React from "react";
import { View, TouchableOpacity } from "react-native";
import { Text } from "~/components/ui/text";

interface RadioOption {
  value: Status;
  label: string;
}

interface CustomRadioGroupProps {
  options: RadioOption[];
  value: string;
  onValueChange: (value: Status) => void;
  className?: string;
}

export function CustomRadioGroup({
  options,
  value,
  onValueChange,
  className,
}: CustomRadioGroupProps) {
  const handlePress = (optionValue: Status) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onValueChange(optionValue);
  };

  return (
    <View className={className}>
      {options.map((option) => (
        <TouchableOpacity
          key={option.value}
          onPress={() => handlePress(option.value)}
          className="flex flex-row items-center gap-3 py-3"
          activeOpacity={0.7}
        >
          <View className="w-5 h-5 rounded-full border-2 border-primary items-center justify-center">
            {value === option.value && (
              <View className="w-3 h-3 rounded-full bg-primary" />
            )}
          </View>
          <Text className="text-lg">{option.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

type Status = "PENDING" | "IN-PROGRESS" | "COMPLETED";

interface UpdateReportStatusSelectorProps {
  defaultValue: Status;
  setStatus?: React.Dispatch<React.SetStateAction<Status>>;
}

export function UpdateReportStatusSelector({
  defaultValue,
  setStatus,
}: UpdateReportStatusSelectorProps) {
  const [value, setValue] = React.useState<Status>(defaultValue);

  const options: RadioOption[] = [
    { value: "PENDING", label: "Pending" },
    { value: "IN-PROGRESS", label: "In Progress" },
    { value: "COMPLETED", label: "Completed" },
  ];

  return (
    <CustomRadioGroup
      options={options}
      value={value}
      onValueChange={(value) => {
        setValue(value);
        if (setStatus) {
          setStatus(value);
        }
      }}
      className="gap-2"
    />
  );
}
