import { useSignUp } from "@clerk/expo";
import { useState } from "react";
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
import { authStyles } from "../../assets/styles/auth.styles";
import { Image } from "expo-image";
import { COLORS } from "../../constants/colors";
const VerifyEmail = ({ email, onBack }) => {
  console.log("VerifyEmail RENDERED", email);
  const { signUp } = useSignUp();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerification = async () => {
    const verificationCode = code.trim();

    if (!verificationCode) {
      Alert.alert("Error", "Please enter the verification code.");
      return;
    }

    setLoading(true);

    try {
      console.log("1. VERIFY BUTTON CLICKED");
      console.log("2. CODE:", verificationCode);
      console.log("3. STATUS BEFORE:", signUp.status);

      const result = await signUp.verifications.verifyEmailCode({
        code: verificationCode,
      });

      console.log("4. VERIFY RESULT:", result);
      console.log("5. VERIFY ERROR:", result.error);
      console.log("6. STATUS AFTER:", signUp.status);

      if (result.error) {
        Alert.alert(
          "Verification failed",
          result.error.message || "Invalid verification code.",
        );

        console.error("VERIFY ERROR:", JSON.stringify(result.error, null, 2));

        return;
      }

      console.log("7. EMAIL VERIFICATION SUCCESS");

      if (signUp.status === "complete") {
        console.log("8. SIGNUP IS COMPLETE");
        console.log("9. CALLING FINALIZE");

        const finalizeResult = await signUp.finalize();

        console.log("10. FINALIZE RESULT:", finalizeResult);

        if (finalizeResult.error) {
          Alert.alert(
            "Finalize Error",
            finalizeResult.error.message || "Could not complete registration.",
          );

          console.error(
            "FINALIZE ERROR:",
            JSON.stringify(finalizeResult.error, null, 2),
          );

          return;
        }

        console.log("11. FINALIZE SUCCESS");
        console.log("12. USER SHOULD NOW BE LOGGED IN");

        return;
      }

      console.log("SIGNUP IS NOT COMPLETE");
      console.log("CURRENT STATUS:", signUp.status);

      Alert.alert(
        "Verification incomplete",
        `Current status: ${signUp.status}`,
      );
    } catch (err) {
      console.error("VERIFICATION EXCEPTION:", JSON.stringify(err, null, 2));

      Alert.alert(
        "Error",
        err?.errors?.[0]?.message || err?.message || "Verification failed.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={authStyles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={authStyles.keyboardView}
        keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
      >
        <ScrollView
          contentContainerStyle={authStyles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Image Container */}
          <View style={authStyles.imageContainer}>
            <Image
              source={require("../../assets/images/i3.png")}
              style={authStyles.image}
              contentFit="contain"
            />
          </View>

          {/* Title */}
          <Text style={authStyles.title}>Verify Your Email</Text>
          <Text style={authStyles.subtitle}>
            We&apos;ve sent a verification code to {email}
          </Text>

          <View style={authStyles.formContainer}>
            {/* Verification Code Input */}
            <View style={authStyles.inputContainer}>
              <TextInput
                style={authStyles.textInput}
                placeholder="Enter verification code"
                placeholderTextColor={COLORS.textLight}
                value={code}
                onChangeText={setCode}
                keyboardType="number-pad"
                autoCapitalize="none"
              />
            </View>

            {/* Verify Button */}
            <TouchableOpacity
              style={[
                authStyles.authButton,
                loading && authStyles.buttonDisabled,
              ]}
              onPress={handleVerification}
              disabled={loading}
              activeOpacity={0.8}
            >
              <Text style={authStyles.buttonText}>
                {loading ? "Verifying..." : "Verify Email"}
              </Text>
            </TouchableOpacity>

            {/* Back to Sign Up */}
            <TouchableOpacity style={authStyles.linkContainer} onPress={onBack}>
              <Text style={authStyles.linkText}>
                <Text style={authStyles.link}>Back to Sign Up</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};
export default VerifyEmail;
