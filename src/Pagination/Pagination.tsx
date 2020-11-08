import React from "react";
import { StyleSheet, View } from "react-native";
import { BaseButton } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { Box } from "../components";
import Circle from "./Circle";

const AnimatedBox = Animated.createAnimatedComponent(Box);

const size = 20;
const width = 200;

interface PaginationProps {}
const Pagination = () => {
  const selectedIndex = useSharedValue<number>(0);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: withTiming((size / 2 + width / 4) * selectedIndex.value),
      },
    ],
  }));
  return (
    <Box flex={1} justifyContent="center" alignItems="center">
      <Box
        width={width}
        height={30}
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
      >
        {[0, 0, 0, 0].map((_, index) => {
          const animatedStyle = useAnimatedStyle(() => ({
            opacity: selectedIndex.value === index ? 0.5 : 1,
          }));
          return (
            <BaseButton
              key={index}
              onPress={() => (selectedIndex.value = index)}
            >
              <AnimatedBox
                width={size}
                height={size}
                borderRadius={size / 2}
                backgroundColor="baseDescription"
                style={animatedStyle}
              />
            </BaseButton>
          );
        })}
        <AnimatedBox
          position="absolute"
          height={size}
          width={size}
          borderRadius={size / 2}
          //backgroundColor="tertiary"
          style={animatedStyle}
        >
          <Circle />
        </AnimatedBox>
      </Box>
    </Box>
  );
};

export default Pagination;
