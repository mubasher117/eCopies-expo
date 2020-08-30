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
import firebase from './firebase'
import {
  emailValidator,
  passwordValidator,
  nameValidator2,
  cellNoValidator,
  addressValidator,
} from "../core/utils";
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
import { register } from "../../api/firebase/authenication";
import { FirebaseRecaptchaVerifierModal } from "expo-firebase-recaptcha";
const { height, width } = Dimensions.get("window");
export default function RegisterScreen(props) {
  const recaptchaVerifier = useRef(null);
  const [name, setName] = useState({ value: "", error: "" });
  const [email, setEmail] = useState({ value: "", error: "" });
  const [password, setPassword] = useState({ value: "", error: "" });
  const [cellNo, setCellNo] = useState({ value: "", error: "" });
  const [address, setAddress] = useState({ value: "", error: "" });
  const [containerOpacity, setcontainerOpacity] = useState(1);
  const [showLoading, setshowLoading] = useState(false);
  const [verificationId, setVerificationId] = useState(null);
  const sendVerification = () => {
    console.log('cell nmber',cellNo)
    const phoneProvider = new firebase.auth.PhoneAuthProvider();
    console.log('phoneprovider',phoneProvider)
    phoneProvider
      .verifyPhoneNumber(cellNo.value, recaptchaVerifier.current)
      .then(setVerificationId);
  };
  const confirmCode = () => {
    const credential = firebase.auth.PhoneAuthProvider.credential(
      verificationId,
      code
    );
    firebase
      .auth()
      .signInWithCredential(credential)
      .then((result) => {
        // Do something with the results here
        console.warn(result);
      });
  }
  const callBackSubmit = async (type, message) => {
    setcontainerOpacity(1);
    setshowLoading(false);
    if (type == "success") {
      setName({ value: "", error: "" });
      setEmail({ value: "", error: "" });
      setPassword({ value: "", error: "" });
      props.navigation.navigate("CopyFormHomePage");
    } else {
      alert(message);
    }
  };

  const _onSignUpPressed = async () => {
    const nameError = nameValidator2(name.value);
    const emailError = emailValidator(email.value);
    const passwordError = passwordValidator(password.value);
    // const cellNoError = cellNoValidator(cellNo.value);
    const addressError = addressValidator(address.value)
    if (emailError || passwordError || nameError
      //  || cellNoError 
       || addressError) {
      setName({ ...name, error: nameError });
      setEmail({ ...email, error: emailError });
      setPassword({ ...password, error: passwordError });
      // setCellNo({...cellNo, error: cellNoError})
      setAddress({...address, error: addressError})
  
      return;
    } else {
      setshowLoading(true);
      setcontainerOpacity(0.3);
      const userDetails = {
        name: name.value,
        email: email.value,
        password: password.value,
        cellNo: cellNo.value,
        address: address.value
      }
      sendVerification()
      
      // register(userDetails, callBackSubmit);
    }
  };

  return (
    <KeyboardAwareScrollView keyboardShouldPersistTaps="always">
      <View style={[styles.container, { opacity: containerOpacity }]}>
        <BackButton goBack={() => props.navigation.navigate("Home")} />

        <View style={{ width: "90%" }}>
          <Header>Create Account</Header>
          <FirebaseRecaptchaVerifierModal
          ref={recaptchaVerifier}
          firebaseConfig={firebase.app().options}
        />
          <TextInput
            label="Name"
            returnKeyType="next"
            value={name.value}
            onChangeText={(text) => setName({ value: text, error: "" })}
            error={!!name.error}
            maxLength={25}
          />
          <Text style={styles.error}>{name.error}</Text>
          <TextInput
            label="Cell No"
            returnKeyType="next"
            onChangeText={(text) => setCellNo({ value: text, error: "" })}
            error={!!cellNo.error}
            autoCapitalize="none"
            keyboardType="phone-pad"
            maxLength={15}
          />
          <Text style={styles.error}>{cellNo.error}</Text>
          <TextInput
            label="Email"
            returnKeyType="next"
            value={email.value}
            onChangeText={(text) => setEmail({ value: text, error: "" })}
            error={!!email.error}
            autoCapitalize="none"
            autoCompleteType="email"
            textContentType="emailAddress"
            keyboardType="email-address"
          />
          <Text style={styles.error}>{email.error}</Text>
          <TextInput
            label="Address"
            returnKeyType="next"
            value={address.value}
            onChangeText={(text) => setAddress({ value: text, error: "" })}
            error={!!address.error}
            autoCapitalize="none"
            keyboardType="default"
            maxLength={50}
          />
          <Text style={styles.error}>{address.error}</Text>
          <TextInput
            label="Password"
            returnKeyType="done"
            value={password.value}
            onChangeText={(text) => setPassword({ value: text, error: "" })}
            error={!!password.error}
            secureTextEntry
            maxLength={20}
          />
          <Text style={styles.error}>{password.error}</Text>

          <Button
            onPress={_onSignUpPressed}
            style={styles.button}
            type="primary"
          >
            Sign Up
          </Button>

          <View style={styles.row}>
            <Text style={styles.label}>Already have an account? </Text>
            <TouchableOpacity
              onPress={() => props.navigation.navigate("Login")}
            >
              <Text style={styles.link}>Login</Text>
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
  label: {
    color: Secondary,
  },
  row: {
    flexDirection: "row",
    marginTop: 4,
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
    marginTop: 24,
    marginBottom: 10,
  },
  error: {
    color: "red",
    fontSize: 12,
    marginLeft: 5,
  },
});
