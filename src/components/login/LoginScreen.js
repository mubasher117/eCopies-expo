import React, { useState, useRef } from "react";
import {
  TouchableOpacity,
  StyleSheet,
  Text,
  View,
  Dimensions,
} from "react-native";
import Logo from "../child-components/Logo";
import Header from "../child-components/Header";
import { TextInput, Chip } from "react-native-paper";
import BackButton from "../child-components/BackButton";
import firebase from "../../api/firebase/login";
import { database } from "../../api/firebase/authenication";
import { getMyOrders } from "../../api/firebase/backend";
import {
  Primary,
  Secondary,
  PrimaryLight,
  PrimaryDark,
  InputBackground,
  PrimaryText,
} from "../../constants/colors";
import {
  InputItem,
  Tag,
  Button,
  ActivityIndicator,
  Steps,
} from "@ant-design/react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { FirebaseRecaptchaVerifierModal } from "expo-firebase-recaptcha";
import {
  emailValidator,
  passwordValidator,
  nameValidator2,
  cellNoValidator,
  addressValidator,
} from "../core/utils";
import { login } from "../../api/firebase/authenication";
import { checkAlreadyUser } from "../../services/auth/AuthService";
const { height, width } = Dimensions.get("window");
export default function LoginScreen(props) {
  const recaptchaVerifier = useRef(null);
  const [cellNo, setCellNo] = useState({ value: "", error: "" });
  // const [password, setPassword] = useState({ value: "", error: "" });
  const [containerOpacity, setcontainerOpacity] = useState(1);
  const [showLoading, setshowLoading] = useState(false);
  const [verificationId, setVerificationId] = useState(null);
  const [otpCode, setOtpCode] = useState(0);
  const callBackLogin = (type, message) => {
    setcontainerOpacity(1);
    setshowLoading(false);
    if (type == "success") {
      setPassword({ value: "", error: "" });
      console.log("success");
      props.navigation.navigate("CopyFormHomePage");
    } else {
      alert(message);
    }
  };
  const sendVerification = () => {
    setshowLoading(true);
    setcontainerOpacity(0.3);
    console.log("cell nmber", cellNo);
    // Refining cell number for firebase
    var cellNoWithoutZero = cellNo.value.substring(1);
    var cellNoRefined = "+92" + cellNoWithoutZero;
    console.log("lion", cellNoRefined);
    checkAlreadyUser(cellNoRefined)
      .then((val) => {
        const phoneProvider = new firebase.auth.PhoneAuthProvider();
        console.log("phoneprovider", phoneProvider);

        phoneProvider
          .verifyPhoneNumber(cellNoRefined, recaptchaVerifier.current)
          .then((verificationId) => {
            setshowLoading(false);
            setcontainerOpacity(1);
            props.navigation.navigate("OtpScreen", {
              verifcationId: verificationId,
              cellNo: cellNoRefined,
              screen: "Login",
            });
          })
          .catch((error) => {
            console.log(error);
          });
      })
      .catch((err) => {
        setshowLoading(false);
        setcontainerOpacity(1);
        setCellNo({
          ...cellNo,
          error: "User does not exist with this phone number",
        });
      });
  };
  const loginPressed = () => {
    const cellNoError = cellNoValidator(cellNo.value);
    // const passwordError = passwordValidator(password.value);
    if (
      cellNoError
      // || passwordError
    ) {
      // setPassword({ ...password, error: passwordError });
      setCellNo({ ...cellNo, error: cellNoError });
      return;
    } else {
      // setshowLoading(true);
      // setcontainerOpacity(0.3);
      console.log("Pressed");
      sendVerification();
    }
  };

  return (
    <KeyboardAwareScrollView keyboardShouldPersistTaps="always">
      <View style={[styles.container, { opacity: containerOpacity }]}>
        <BackButton goBack={() => props.navigation.navigate("Home")} />
        <View style={{ width: "90%" }}>
          <View style={styles.centeredView}>
            <Logo />
          </View>
          <View style={styles.centeredView}>
            <Header>Welcome back.</Header>
          </View>
          <FirebaseRecaptchaVerifierModal
            ref={recaptchaVerifier}
            firebaseConfig={firebase.app().options}
            attemptInvisibleVerification={true}
            title="Tap on the box below"
            cancelLabel="Close"
          />
          {/* <TextInput keyboardType="numeric" onChangeText={(text) => setOtpCode(text)} />
          <Button onPress={confirmCode}>Verify</Button> */}
          <TextInput
            label="Cell No"
            returnKeyType="next"
            onChangeText={(text) => setCellNo({ value: text, error: "" })}
            error={!!cellNo.error}
            autoCapitalize="none"
            keyboardType="phone-pad"
            placeholder="e.g 03012456871"
            maxLength={15}
          />
          <Text style={styles.error}>{cellNo.error}</Text>
          {/* <TextInput
            label="Password"
            returnKeyType="done"
            value={password.value}
            onChangeText={(text) => setPassword({ value: text, error: "" })}
            error={!!password.error}
            secureTextEntry
          />
          <Text style={styles.error}>{password.error}</Text> */}
          {/* <View style={styles.forgotPassword}>
            <TouchableOpacity
              onPress={() => props.navigation.navigate("ForgotPassword")}
            >
              <Text style={styles.label}>Forgot your password?</Text>
            </TouchableOpacity>
          </View> */}

          <Button style={styles.button} type="primary" onPress={loginPressed}>
            Login
          </Button>

          <View style={styles.row}>
            <Text style={styles.label}>Don’t have an account? </Text>
            <TouchableOpacity
              onPress={() => props.navigation.navigate("Register")}
            >
              <Text style={styles.link}>Sign up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <ActivityIndicator
        animating={showLoading}
        toast
        size="large"
        text="Submitting..."
      />
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: PrimaryLight,
    width: width,
    minHeight: height,
    justifyContent: "center",
    alignItems: "center",
  },
  centeredView: {
    justifyContent: "center",
    alignItems: "center",
  },
  forgotPassword: {
    width: "100%",
    alignItems: "flex-end",
    marginBottom: 24,
  },
  row: {
    flexDirection: "row",
    marginTop: 4,
  },
  label: {
    color: Secondary,
  },
  link: {
    fontWeight: "bold",
    color: Secondary,
  },
  button: {
    width: "100%",
    height: 50,
    backgroundColor: Secondary,
    borderWidth: 0,
    marginBottom: 10,
  },
  error: {
    color: "red",
    fontSize: 12,
    marginLeft: 5,
  },
});
