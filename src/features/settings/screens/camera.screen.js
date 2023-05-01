import React, { useRef, useState, useEffect, useContext } from "react";
import { Camera, CameraType } from "expo-camera";
import styled from "styled-components/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { View, TouchableOpacity } from "react-native";
import { Text } from "../../../components/typography/text.component";
import { AuthenticationContext } from "../../../services/authentication/authentication.context";

const ProfileCamera = styled(Camera)`
  width: 100%;
  height: 100%;
  flex: 1;
`;

const InnerSnap = styled.View`
  width: 100%;
  height: 100%;
  z-index: 999;
`;

export const CameraScreen = ({ navigation }) => {
  const [hasPermission, setHasPermission] = useState(null);
  const cameraRef = useRef();
  const { user } = useContext(AuthenticationContext);

  const snap = async () => {
    if (cameraRef) {
      const photo = await cameraRef.current.takePictureAsync();
      AsyncStorage.setItem(`${user.uid}-photo`, photo.uri);
      navigation.goBack();
    }
  };

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }
  return (
    <ProfileCamera
      ref={(camera) => (cameraRef.current = camera)}
      type={CameraType.front}
    >
      <TouchableOpacity onPress={snap}>
        <InnerSnap />
      </TouchableOpacity>
    </ProfileCamera>
  );
};

// import { Camera, CameraType } from "expo-camera";
// import { useState, useRef, useContext } from "react";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { Text, TouchableOpacity, View } from "react-native";
// import { AuthenticationContext } from "../../../services/authentication/authentication.context";
// import styled from "styled-components";

// const ProfileCamera = styled(Camera)`
//   width: 100%;
//   height: 100%;
// `;

// export const CameraScreen = ({ navigation }) => {
//   const [type, setType] = useState(CameraType.back);
//   const [permission, requestPermission] = Camera.useCameraPermissions();
//   const cameraRef = useRef();
//   const user = useContext(AuthenticationContext);

//   const snap = async () => {
//     if (cameraRef) {
//       const photo = await cameraRef.current.takePictureAsync();
//       AsyncStorage.setItem(`${user.uid}-photo`, photo.uri);
//       navigation.goBack();
//     }
//   };

//   if (permission === null) {
//     return <View />;
//   }
//   if (permission === false) {
//     return <Text>No access to camera</Text>;
//   }

//   const toggleCameraType = () => {
//     setType((current) =>
//       current === CameraType.back ? CameraType.front : CameraType.back
//     );
//   };

//   return (
//     <View>
//       <TouchableOpacity onPress={snap}>
//         <ProfileCamera
//           ref={(camera) => (cameraRef.current = camera)}
//           type={type}
//         >
//           <View>
//             <TouchableOpacity onPress={toggleCameraType}>
//               <Text>Flip Camera</Text>
//             </TouchableOpacity>
//           </View>
//         </ProfileCamera>
//       </TouchableOpacity>
//     </View>
//   );
// };
