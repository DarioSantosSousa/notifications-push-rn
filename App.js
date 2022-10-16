import React, { useEffect, useRef, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Button, View, Text, Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import storage from "@react-native-async-storage/async-storage";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});



export default function App() {
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();
  const [acRepeated, setAcRepeated] = useState(0);

  useEffect(() => {
    const getPermission = async () => {
      if (Constants.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
          const { status } = await Notifications.requestPermissionsAsync();
          finalStatus = status;
        }
        if (finalStatus !== 'granted') {
          alert('Enable push notifications to use the app!');
          await storage.setItem('expopushtoken', "");
          return;
        }
        const token = (await Notifications.getExpoPushTokenAsync()).data;
        await storage.setItem('expopushtoken', token);
      }
      else {
        // alert('Must use physical device for Push Notifications');
      }
      if (Platform.OS === 'android') {
        Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#FF231F7C',
        });
      }
    }
    getPermission();

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response);
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };

  }, []);

  const onClick = async () => {

    if (acRepeated == 0) {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "CUPOM DISPONÍVEL",
          body: "Receba, cupom de 30% Off, acesse o app agora! 📴💰🔖",
          data: { data: "Data" }
        },
        trigger: {
          seconds: 1,
          // repeats: true
        }
      })
      setAcRepeated(1)
    }
    else if (acRepeated == 1) {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "HORA DA REFEIÇÃO",
          body: "Jantar ?   Eu gossstummm! 😋❤👌",
          data: { data: "Data" }
        },
        trigger: {
          seconds: 2,
          // repeats: true
        }
      })
      setAcRepeated(2)
    }
    else if (acRepeated == 2) {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "OFERTA",
          body: "Oferta disponíveis agora, acesse o app já! 📱🛒🍱",
          data: { data: "Data" }
        },
        trigger: {
          seconds: 3,
          // repeats: true
        }
      })
      setAcRepeated(0)
    }
  }
  return (
    <View style={styles.container}>

      <Text style={styles.titlle}> PUSH NOTIFICATIONS </Text>


      <View style={styles.meddium}>
        <Text style={styles.meddiumSub}> São três notificações de modo manual </Text>
        <Text style={styles.detalhes}>I.&nbsp;CUPOM DISPONÍVEL  = 1 segundo</Text>
        <Text style={styles.detalhes}>II.&nbsp;HORA DA REFEIÇÃO  = 2 segundos</Text>
        <Text style={styles.detalhes}>III.&nbsp;MOMENTO OFERTAS  = 3 segundos</Text>
        <Button title='CLIQUE AQUI' color={'#ff0000'} onPress={onClick} />
        <StatusBar style="auto" />
      </View>

      <Text style={styles.hello}>Hello, this was a project developed by Dário Santos</Text>
    </View>
  );

}
const styles = StyleSheet.create({
  detalhes: {
    textAlign: 'center',
    marginVertical: 20,

  },
  meddiumSub: {
    fontWeight: 'bold',
    marginVertical: 50,
    color: '#ff0000',
    fontSize: 20,
    borderRadius: 25,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  meddium: {
    marginVertical: 50,

  },

  titlle: {
    color: '#ff0000',
    fontSize: 35,
    backgroundColor: '#fff',
    fontWeight: '200',
    marginTop: 50,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#ff0000',
  },
  hello: {
    color: '#0000ff',
    fontWeight: '300',
    marginTop: 50,
  }

});