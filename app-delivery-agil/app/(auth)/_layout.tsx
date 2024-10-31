import { useAuth } from '@clerk/clerk-expo';
import { Stack } from 'expo-router';
import { Pressable } from 'react-native';
import { Feather } from '@expo/vector-icons';

function LogoutButton() {
  const { signOut } = useAuth();

  function logout() {
    signOut();
  }

  return (
    <Pressable onPress={logout}>
      <Feather name="log-out" size={24} color="#FFF" />
    </Pressable>
  );
}

export default function StackPage() {
  const { isSignedIn } = useAuth();

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: '#FFF',
        },
        headerTintColor: '#000',
      }}
    >
      <Stack.Screen
        name="home"
        options={{
          headerShown: false,
        }}
        redirect={!isSignedIn}
      />
      <Stack.Screen
        name="settings"
        options={{
          headerTitle: 'Minha Conta',
          headerRight: () => <LogoutButton />,
        }}
        redirect={!isSignedIn}
      />
    </Stack>
  );
}
