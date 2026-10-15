import { Stack } from "expo-router";
import { PaperProvider } from 'react-native-paper';
import { lightTheme } from './theme';

export default function RootLayout() {
  return (
    <PaperProvider theme={lightTheme}>
      <Stack>
      <Stack.Screen
        name="(tabs)"
        options={{
          title: "HomePage",
        }}
      />
    </Stack>
    </PaperProvider>
    
    
  );
}
