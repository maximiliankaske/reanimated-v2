import React from "react";
import { Dimensions, Pressable, StyleSheet, View } from "react-native";
import { PanGestureHandler } from "react-native-gesture-handler";
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedProps,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withDecay,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { ReText } from "react-native-redash";
import Svg, { Path } from "react-native-svg";
import { Box, Text, useTheme } from "../components";

const { width } = Dimensions.get("window");
const balloonSize = 100;
const size = 50;
const borderSize = 8;
const AnimatedBox = Animated.createAnimatedComponent(Box);
const AnimatedSvg = Animated.createAnimatedComponent(Svg);
const sliderConfig = {
  height: 2,
  width: width * 0.7,
  min: 0,
  max: 60,
};

interface BalloonProps {}
const Balloon = () => {
  const theme = useTheme();
  const isGestureActive = useSharedValue(false);
  const isPressActive = useSharedValue(false);
  const translateX = useSharedValue(0);
  const rotation = useSharedValue(0);
  const onGestureEvent = useAnimatedGestureHandler<{ startX: number }>({
    onStart: (_, ctx) => {
      ctx.startX = translateX.value;
      isGestureActive.value = true;
    },
    onActive: ({ translationX, velocityX }, ctx) => {
      translateX.value =
        translationX + ctx.startX >= 0
          ? translationX + ctx.startX <= sliderConfig.width
            ? translationX + ctx.startX
            : sliderConfig.width
          : 0;
      rotation.value = -velocityX / 50;
    },
    onEnd: () => {
      isGestureActive.value = false;
      rotation.value = 0;
    },
  });
  const isActive = useDerivedValue(
    () => isGestureActive.value || isPressActive.value
  );
  const style = useAnimatedStyle(() => {
    const currentSize = isActive.value ? size : size * (1 / 2);
    return {
      width: withTiming(currentSize),
      height: withTiming(currentSize),
      transform: [{ translateX: translateX.value }],
      borderRadius: withTiming(isActive.value ? size / 2 : size * (1 / 6)),
    };
  });

  const innerStyle = useAnimatedStyle(() => {
    const currentSize = isActive.value ? size - borderSize : size * (1 / 4);
    return {
      width: withTiming(currentSize),
      height: withTiming(currentSize),
      borderRadius: withTiming(isActive.value ? (size - borderSize) / 2 : 0),
    };
  });

  const rotate = useDerivedValue(() =>
    withSpring(rotation.value, { overshootClamping: false })
  );
  const balloonProps = useAnimatedProps(() => ({
    height: withTiming(isActive.value ? balloonSize : 30),
    width: withTiming(isActive.value ? balloonSize : 30),
  }));

  const balloonContainerStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: withSpring(translateX.value),
      },
      { rotate: `${rotate.value}deg` },
    ],
  }));

  return (
    <Box flex={1} backgroundColor="mainBackground">
      <Title />
      <Box flex={1} justifyContent="flex-end">
        <Box
          style={StyleSheet.absoluteFill}
          bottom={-size / 2}
          justifyContent="flex-end"
        >
          <AnimatedBox
            width={balloonSize}
            height={balloonSize}
            justifyContent="center"
            alignItems="center"
            style={balloonContainerStyle}
            backgroundColor="baseDescription"
          >
            <AnimatedSvg viewBox="0 0 40 30" animatedProps={balloonProps}>
              <Path
                fill={theme.colors.tertiary}
                d="M 20 0 Q 40 0 20 30 Q 0 0 20 0 M 20 30 Q 25 34 20 34 Q 15 34 20 30 Z"
              />
            </AnimatedSvg>
          </AnimatedBox>
        </Box>
        <Box height={size} flexDirection="row" justifyContent="center">
          <SliderLine />
          <Box
            position="absolute"
            left={(width * 0.3 - size) / 2}
            height={size}
            width={size}
            alignItems="center"
            justifyContent="center"
          >
            <PanGestureHandler onGestureEvent={onGestureEvent}>
              <AnimatedBox backgroundColor="tertiary" style={style}>
                <Pressable
                  onPressIn={() => {
                    isPressActive.value = true;
                  }}
                  onPressOut={() => {
                    isPressActive.value = false;
                  }}
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <AnimatedBox
                    backgroundColor="mainBackground"
                    style={innerStyle}
                  />
                </Pressable>
              </AnimatedBox>
            </PanGestureHandler>
          </Box>
        </Box>
      </Box>
      <Box flex={1} alignItems="center" justifyContent="center"></Box>
    </Box>
  );
};

export default Balloon;

const Title = () => (
  <Text
    variant="hero"
    color="tertiary"
    padding="m"
  >{`Choose\nBalloon\nquantity`}</Text>
);

const SliderLine = () => (
  <Box
    height={sliderConfig.height}
    width={sliderConfig.width}
    backgroundColor="tertiary"
    alignSelf="center"
  />
);

const AnimatedText = ({ quantity, theme }) => (
  <Box
    style={StyleSheet.absoluteFill}
    justifyContent="center"
    alignItems="center"
  >
    <ReText text={quantity} style={{ color: theme.colors.mainBackground }} />
  </Box>
);