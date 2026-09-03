import { View, Text } from "react-native";
import { Stack, Redirect } from "expo-router";
import { useAuth } from "@clerk/expo";
import React from "react";

const TabsLayout = () => {
  const { isSignedIn } = useAuth();
  if (!isSignedIn) {
    return <Redirect href="/(auth)/sign-in" />;
  }
  return <Stack />;
};

export default TabsLayout;
