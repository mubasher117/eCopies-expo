import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Platform,
  Dimensions,
  BackHandler,
} from "react-native";
import {
  InputItem,
  Tag,
  Button,
  ActivityIndicator,
  Steps,
} from "@ant-design/react-native";
import {
  Primary,
  Secondary,
  PrimaryLight,
  PrimaryDark,
  InputBackground,
  PrimaryText,
} from "../../../constants/colors";
import AsyncStorage from "@react-native-community/async-storage";
import { TextInput, Chip, FAB } from "react-native-paper";
import DateTimePicker from "@react-native-community/datetimepicker";
import Header from "../../../components/header/Header";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import store from "../../../redux/store";
import { Parties } from "../../../components/child-components/Parties";
import DateOfDecision from "../../../components/child-components/DateOfDecision";
import BottomButtonsNav from "../../../components/child-components/BottomButtonsNav";
import { nameValidator2 } from "../../../components/core/utils";
import SectionTitle from "../../../components/child-components/SectionTitle";
const { height, width } = Dimensions.get("window");
var index = 0;
export default function CopyForm1(props) {
  const [headerTitle, setHeaderTitle] = useState("");
  const [plaintiff, setPlaintiff] = useState({ value: "", error: "" });
  const [defendant, setDefendant] = useState({ value: "", error: "" });
  const [dateOfDecision, setDateOfDecision] = useState(new Date());
  useEffect(() => {
    let state = store.getState();
    // Getting selected court name to display on header
    let title = state.ordersReducer.currentForm.court;
    setHeaderTitle(title);
    //Back Handler
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );
    const unsubscribe = props.navigation.addListener("didFocus", () => {
      let state = store.getState();
      let form = state.ordersReducer.currentForm;
      let title = form.court;

      setPlaintiff(
        form.plaintiff
          ? { value: form.plaintiff, error: "" }
          : { value: "", error: "" }
      );
      setDefendant(
        form.defendant
          ? { value: form.defendant, error: "" }
          : { value: "", error: "" }
      );
      setDateOfDecision();
      setHeaderTitle(title);
      BackHandler.addEventListener("hardwareBackPress", backAction);
    });
    const onBlurScreen = props.navigation.addListener("didBlur", () => {
      console.log("UNFOCUSED");
      backHandler.remove();
    });
    return () => {
      unsubscribe;
      onBlurScreen;
      backHandler.remove();
    };
  }, []);
  const backAction = () => {
    console.log("IN BACK HANDLER");
    _handlePrevious();
    return true;
  };
  const _handleNext = () => {
    var plaintiffError = nameValidator2(plaintiff.value);
    var defendantError = nameValidator2(defendant.value);
    if (plaintiffError || defendantError) {
      setPlaintiff({ ...plaintiff, error: plaintiffError });
      setDefendant({ ...defendant, error: defendantError });
    } else {
      var details = {
        plaintiff: plaintiff.value,
        defendant: defendant.value,
      };
      store.dispatch({ type: "setCurrentFormItem", payload: details });
      props.navigation.navigate("LowerCourtsFormDate");
    }
  };
  const _handlePrevious = () => {
    props.navigation.navigate("LowerCourtsForm1");
  };
  return (
    <KeyboardAwareScrollView keyboardShouldPersistTaps="always">
      <Header title={headerTitle} backbutton goBackFn={_handlePrevious} />
      <View style={styles.container}>
        <SectionTitle title="Case Details" /> 
        <View
          style={styles.innerContainer}
        >
          <Parties
            plaintiff={plaintiff}
            setPlaintiff={(p) => {setPlaintiff(p);}}
            defendant={defendant}
            setDefendant={(d) => setDefendant(d)}
          />
        </View>
        <BottomButtonsNav next={_handleNext} previous={_handlePrevious} />
      </View>
    </KeyboardAwareScrollView>
  );
}
const styles = StyleSheet.create({
  container: {
    width: "90%",
    alignSelf: "center",
  },
  innerContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
});
