import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Platform,
  Dimensions,
  ScrollView,
  SafeAreaView,
  Keyboard,
  Picker,
  TouchableOpacity,
  Image,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import {
  InputItem,
  Tag,
  ActivityIndicator,
  Steps,
  Tabs,
  Button,
} from "@ant-design/react-native";
import {
  Primary,
  Secondary,
  PrimaryLight,
  PrimaryDark,
  InputBackground,
  PrimaryText,
} from "../../constants/colors";
import { TextInput, Chip } from "react-native-paper";
import Header from "../header/Header";
import { database } from "../../api/firebase/authenication";
import store from "../../redux/store";
import Modal from "../child-components/Modal";

import { getStatusBarHeight } from "react-native-status-bar-height";
const { height, width } = Dimensions.get("window");
const FormType = (props) => {
  return (
    <TouchableOpacity
      onPress={() => props.navigateTo()}
      style={{
        borderRadius: 5,
        width: "47.3%",
        backgroundColor: "#E6E6E6",
        minHeight: 160,
        padding: 10,
        margin: 5,
      }}
    >
      <Image
        style={{ width: "100%", height: 100, marginBottom: 5 }}
        source={props.imgSource}
      />
      <Text style={{ fontWeight: "bold" }}>{props.title}</Text>
      <Text style={{}}>{props.titleUrdu}</Text>
    </TouchableOpacity>
  );
};

const forms = [
  {
    title: "High Court",
    titleUrdu: "ہائی کورٹ",
    imgSource: require("../../../assets/images/static/highcourt.jpeg"),
    navigateTo: "CopyFormCase",
  },
];

export default function HomPage(props) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [containerOpacity, setcontainerOpacity] = useState(1);
  // Function to be passed to Header
  const openDrawerFn = () => {
    props.navigation.toggleDrawer();
  };
  const navigateTo = async (screen, currentScreen = "N/A") => {
    let state = await store.getState();
    let user = state.userReducer.user;
    store.dispatch({
      type: "setCurrentFormItem",
      payload: { court: currentScreen },
    });
    database.ref("userData/" + user.id).once("value", (snapshot) => {
      console.log(user.id);
      if (snapshot.val()) {
        if (snapshot.val().balance == 0) {
          console.log(snapshot.val());
          props.navigation.navigate(screen, { screen: currentScreen });
        } else {
          showModal();
        }
      } else {
        navigateTo(screen, currentScreen);
      }
    });
  };
  const showModal = () => {
    setIsModalVisible(true);
    setcontainerOpacity(0.1);
  };
  const hideModal = () => {
    setIsModalVisible(false);
    setcontainerOpacity(1);
    props.navigation.navigate("Payments");
  };
  return (
    <View style={[styles.container, { opacity: containerOpacity }]}>
      <Header title="Copy Form" openDrawerFn={openDrawerFn} />
      <Modal
        visible={isModalVisible}
        text="Please pay the remaining dues before submitting another form."
        urduText="براۓ مہربانی مزید نقل فارم کے لیے اپنے واجبات ادا کریں۔"
        buttonOkText="OK"
        hideModal={hideModal}
        handleOkay={hideModal}
      />
      <ScrollView>
        <View
          style={[
            styles.centeredView,
            { height: height - (getStatusBarHeight() + 50) },
          ]}
        >
          {/* <View style={styles.availableTextContainer}>
            <Text style={styles.availableText}>Only available in</Text>
            <Text style={styles.availableTextCity}>Lahore</Text>
          </View> */}
          <View style={styles.optionsContainer}>
            {/* {forms.map((form, index) => {return (
            <FormType
              title={form.title}
              titleUrdu={form.titleUrdu}
              imgSource={form.imgSource}
              navigateTo={() => {
                // Clear pervious form
                store.dispatch({ type: "clearForm" });
                navigateTo("CopyFormCase");
              }}
            />
          );})} */}
            <FormType
              title="Supreme Court"
              titleUrdu="سپریم کورٹ"
              imgSource={require("../../../assets/images/static/supremeCourt.jpeg")}
              navigateTo={() => {
                // Clear pervious form
                store.dispatch({ type: "clearForm" });
                navigateTo("CopyFormCase", "Supreme Court");
              }}
            />
            <FormType
              title="High Court, Lahore"
              titleUrdu="ہائی کورٹ, لاہور"
              imgSource={require("../../../assets/images/static/highcourt.jpeg")}
              navigateTo={() => {
                // Clear pervious form
                store.dispatch({ type: "clearForm" });
                navigateTo("CopyFormCase", "High Court");
              }}
            />
          </View>
          <View style={styles.optionsContainer}>
            <FormType
              title="Lower Courts Lahore"
              titleUrdu=" ماتحت عدالتیں, لاہور"
              imgSource={require("../../../assets/images/static/district_court.jpg")}
              navigateTo={() => {
                // Clear pervious form
                store.dispatch({ type: "clearForm" });
                navigateTo("LowerCourtsSelectCourt");
              }}
            />
            <FormType
              title="Revenue / Sub Registrar Lahore"
              titleUrdu="ریونیو, لاہور"
              imgSource={require("../../../assets/images/static/revenue_court.jpeg")}
              navigateTo={() => {
                // Clear pervious form
                store.dispatch({ type: "clearForm" });
                navigateTo("RevenueCopyForm");
              }}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: PrimaryLight,
    width: width,
    minHeight: height,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  optionsContainer: {
    flexDirection: "row",
    marginBottom: 0,
  },
  modalView: {
    width: "90%",
    margin: 20,
    backgroundColor: "white",
    borderRadius: 10,
    padding: 35,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalQuit: {
    width: 30,
    height: 30,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 15,
  },
  buttonModalClose: {
    width: "100%",
    height: 40,
    backgroundColor: Secondary,
    borderWidth: 0,
    alignSelf: "flex-end",
    marginTop: 30,
  },
  availableTextContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  availableText: {
    fontSize: 16,
    marginLeft: 5,
    marginBottom: 40,
  },
  availableTextCity: {
    fontSize: 16,
    marginLeft: 5,
    marginBottom: 40,
    color: "white",
    backgroundColor: Secondary,
    padding: 5,
    borderRadius: 8,
  },
});
