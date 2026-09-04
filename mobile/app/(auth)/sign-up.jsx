import {
  View,
  Text,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { useSignUp } from "@clerk/expo";
import { useState } from "react";
import { authStyles } from "../../assets/styles/auth.styles";
import { Image } from "expo-image";
import { COLORS } from "../../constants/colors";

import { Ionicons } from "@expo/vector-icons";
import VerifyEmail from "../(auth)/verify-email";

const SignUpScreen = () => {
  const router = useRouter();
  const { signUp } = useSignUp();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pendingVerification, setPendingVerification] = useState(false);

  const handleSignUp = async () => {
    console.log("1. BUTTON CLICKED");

    if (!email || !password) {
      console.log("2. MISSING EMAIL OR PASSWORD");
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    console.log("3. EMAIL AND PASSWORD OK");

    if (password.length < 6) {
      console.log("4. PASSWORD TOO SHORT");
      Alert.alert("Error", "Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      console.log("7. CALLING SIGNUP.PASSWORD");

      const { error } = await signUp.password({
        emailAddress: email.trim(),
        password,
      });

      console.log("8. PASSWORD RESULT:", error);

      if (error) {
        Alert.alert(
          "Sign Up Error",
          error.message || "Failed to create account",
        );
        return;
      }

      console.log("9. SIGNUP PASSWORD SUCCESS");

      const { error: sendError } = await signUp.verifications.sendEmailCode();

      console.log("10. SEND CODE RESULT:", sendError);

      if (sendError) {
        Alert.alert(
          "Email Verification Error",
          sendError.message || "Could not send verification code",
        );
        return;
      }

      console.log("11. CODE SENT");

      setPendingVerification(true);

      console.log("12. SET VERIFY SCREEN");
    } catch (err) {
      console.error("SIGN UP EXCEPTION:", err);

      Alert.alert(
        "Error",
        err?.errors?.[0]?.message || err?.message || "Failed to create account",
      );
    } finally {
      setLoading(false);
    }
  };
  if (pendingVerification)
    return (
      <VerifyEmail email={email} onBack={() => setPendingVerification(false)} />
    );

  return (
    <View style={authStyles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
        style={authStyles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={authStyles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Image Container */}
          <View style={authStyles.imageContainer}>
            <Image
              source={require("../../assets/images/i2.png")}
              style={authStyles.image}
              contentFit="contain"
            />
          </View>

          <Text style={authStyles.title}>Create Account</Text>

          <View style={authStyles.formContainer}>
            {/* Email Input */}
            <View style={authStyles.inputContainer}>
              <TextInput
                style={authStyles.textInput}
                placeholder="Enter email"
                placeholderTextColor={COLORS.textLight}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            {/* Password Input */}
            <View style={authStyles.inputContainer}>
              <TextInput
                style={authStyles.textInput}
                placeholder="Enter password"
                placeholderTextColor={COLORS.textLight}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity
                style={authStyles.eyeButton}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Ionicons
                  name={showPassword ? "eye-outline" : "eye-off-outline"}
                  size={20}
                  color={COLORS.textLight}
                />
              </TouchableOpacity>
            </View>

            {/* Sign Up Button */}
            <TouchableOpacity
              style={[
                authStyles.authButton,
                loading && authStyles.buttonDisabled,
              ]}
              onPress={handleSignUp}
              disabled={loading}
              activeOpacity={0.8}
            >
              <Text style={authStyles.buttonText}>
                {loading ? "Creating Account..." : "Sign Up"}
              </Text>
            </TouchableOpacity>

            {/* Sign In Link */}
            <TouchableOpacity
              style={authStyles.linkContainer}
              onPress={() => router.back()}
            >
              <Text style={authStyles.linkText}>
                Already have an account?{" "}
                <Text style={authStyles.link}>Sign In</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};
export default SignUpScreen;
