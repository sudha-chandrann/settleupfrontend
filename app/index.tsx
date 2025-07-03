import { size } from "@/utils/style";
import { colortheme } from "@/utils/theme";
import React, { useEffect } from "react";
import { 
  StatusBar, 
  StyleSheet, 
  Image, 
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {

 useEffect(()=>{
  setTimeout(() => {
    
  }, 1000);
 },[])

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar 
        backgroundColor={colortheme.background.default}
        barStyle="light-content"
        translucent={false}
      />
          <Image 
            source={require("../assets/images/logo.png")}
            style={styles.logo}
            resizeMode="contain"
          />
        
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colortheme.background.default,
    justifyContent: "center",
    alignItems: "center",
  },

  logo: {
    width: size.fullWidth * 0.8, 
    height: size.fullHeight * 0.8,
    maxWidth: 400,
    maxHeight: 400,
  },
});