import { Link } from "expo-router";
import { Text, View } from "react-native";


export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Testando Rotas</Text>

      <Link href="../(tabs)/Home/home">
        Home Page
      </Link>

    </View>
  );
}
