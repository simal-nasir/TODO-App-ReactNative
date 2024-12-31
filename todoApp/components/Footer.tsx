import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import "./global.css"

type RootStackParamList = {
  Home: undefined;
  Welcome: undefined;
};

const Footer = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <View className="flex flex-row justify-around bg-blue-500 py-4">
      <TouchableOpacity
        onPress={() => navigation.navigate('Home')}
        className="flex items-center"
      >
        <Text className="text-white text-lg font-semibold">Home</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.navigate('Welcome')}
        className="flex items-center"
      >
        <Text className="text-white text-lg font-semibold">Welcome</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Footer;