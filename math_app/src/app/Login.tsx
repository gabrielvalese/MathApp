import { FontAwesome5 } from '@expo/vector-icons';
import CheckBox from 'expo-checkbox';
import { router } from 'expo-router';
import { useState } from 'react';
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import Svg, { Path } from "react-native-svg";

export function GoogleIcon({ size = 24 }: { size?: number }) {
  return (
    
    
    <Svg width={size} height={size} viewBox="0 0 48 48">
      <Path
        fill="#EA4335"
        d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
      />
      <Path
        fill="#4285F4"
        d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
      />
      <Path
        fill="#FBBC05"
        d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
      />
      <Path
        fill="#34A853"
        d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
      />
    </Svg>
  );
}

export default function Index() {
  const [isChecked, setChecked] = useState(false);
  
  function irParaQuestoes() {
    console.log("Indo para as questões...");
    router.push('/'); 
  }
  
  return (
    <View style={styles.container}>
      <Image 
        source={require('../../assets/images/logo.png')}
        style={{ width: 100, height: 100, marginBottom: 20 }}
      />
      <Text style={styles.text}>Login</Text>
      <View style={styles.inputsView}>
        <View style={styles.UserInput}>
          <Text style={{ fontSize: 18, fontWeight: "bold", width: "80%" }}>Usuário</Text>
          <TextInput placeholder="Digite seu usuário" style={styles.TextInputs} />
        </View>
        <View style={[styles.UserInput, { marginBottom: 0 }]}>
          <Text style={{ fontSize: 18, fontWeight: "bold", width: "80%" }}>Senha</Text>
          <TextInput placeholder="Digite sua senha" secureTextEntry style={styles.TextInputs} />
        </View>
      </View>
      <View style={styles.ParteInferior}>
        <CheckBox value={isChecked} onValueChange={setChecked} color={isChecked ? "#0057f7e2" : "undefined"} />
        <Text style={{ fontSize: 16, fontWeight: "bold", marginLeft: 10 }}>Lembrar-me</Text>
        <TouchableOpacity onPress={() => console.log("Esqueceu a senha?")}>
          <Text style={{ fontSize: 16, fontWeight: "bold", marginLeft: 40, color: "#0057f7e2" }}>Esqueceu a senha?</Text>
        </TouchableOpacity>
      </View>
      <View style={{ width: "60%", height: 60, alignItems: "center", justifyContent: "center", marginTop: 20, backgroundColor: "black", borderRadius: 10 }}>
        <TouchableOpacity onPress={() => irParaQuestoes()} style={{ width: "100%", height: "100%", alignItems: "center", justifyContent: "center" }}>
          <Text style={{ color: "white", fontWeight: "bold", fontSize: 25 }}>Entrar</Text>
        </TouchableOpacity>
      </View>
      <Text style={{ fontSize: 16, fontWeight: "bold", marginTop: 20 }}>Não tem uma conta? <TouchableOpacity onPress={() => console.log("Cadastre-se")} style={{ marginTop: 10 }}><Text style={{ color: "#0057f7e2", fontWeight: "bold", fontSize: 16 }}>Cadastre-se</Text></TouchableOpacity></Text>
      <Text style={{ fontSize: 25, fontWeight: "bold", marginTop: 20 }}>Logar com</Text>
      <View style={styles.container2}>
        <TouchableOpacity>
          <FontAwesome5 name="facebook" size={43} color="#1877F2" />
        </TouchableOpacity>
        <TouchableOpacity>
          <GoogleIcon size={40} />
        </TouchableOpacity>
        <TouchableOpacity style={{ marginTop: -7 }}>
          <FontAwesome5 name="apple" size={52} color="#000000"/>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 40,
    fontWeight: "bold",
  },
  inputsView: {
    width: "100%",
    height: 200,
    alignItems: "center",
    justifyContent: "center",
  },
  UserInput: {
    width: "100%",
    height: 50,
    marginBottom: 30,
    alignItems: "center",
    textAlign: "left",
  },
  TextInputs: {
    width: "80%",
    height: 50,
    borderRadius: 10,
    backgroundColor: "lightgray",
    fontSize: 18,
  },
  ParteInferior: {
    display: "flex",
    flexDirection: "row",
    width: "80%",
    height: 40,
    alignItems: "center",
  },
  container2: {
    flexDirection: 'row',
    padding: 10,
    gap: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});