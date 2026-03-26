import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, } from 'react-native';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

type Props = 
{
    goBack: () => void;
};

<Button title = "Back" onPress = {goBack} />

const joints = 
[
    { name: "Shoulder", icon: "🦴" },
    { name: "Elbow", icon: "💪" },
    { name: "Wrist", icon: "✋" },
    { name: "Hip", icon: "🦵" },
    { name: "Knee", icon: "🦿" },
    { name: "Ankle", icon: "👣" }
]

const Stack = createNativeStackNavigator();

<NavigationContainer>
    <Stack.Navigator>
        <Stack.Screen name = "Home" component = {IndexScreen} />
        <Stack.Screen name = "Injury" component = {InjuryScreen} />
    </Stack.Navigator>
</NavigationContainer>

export default function IndexScreen({ navigation })
{
    return
     (
        <SafeAreaView style = {styles.container}>
            <Text style = {styles.title}> Injury Checker </Text>
            <Text style = {styles.subtitle}> Where does it hurt? </Text>

            <View style = {styles.list}>
                {joints.map((joint) => (
                    <TouchableOpacity
                        key = {joint.name}
                        style = {styles.card}
                        onPress = {() => navigation.navigate('Injury', { joint: joint.name })}
                    >
                        <Text style = {styles.icon}> {joint.icon} </Text>
                        <Text style = {styles.text}> {joint.name} </Text>
                    </TouchableOpacity>
                ))}
            </View>
            
            <Text style = {styles.footer}>
                Not a medical diagnosis. Please seek care if symptoms are severe.
            </Text>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create (
    {
        container: 
        {
            flex: 1, 
            backgroundColor: '#F4F6F8',
            paddingHorizontal: 20,
        },

        title:
        {
            fontSize: 28,
            fontWeight: 'bold',
            textAlign: 'center',
            marginTop: 20,
        },

        subtitle: 
        {
            fontSize: 16,
            textAlign: 'center',
            color: '#666',
            marginBottom: 30,
        },

        list:
        {
            flex: 1,
        },

        card:
        {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: '#FFFFFF',
            padding: 18,
            borderRadius: 15,
            marginBottom: 12,

            // Shadow (iOS)
            shadowColor: '#000',
            shadowOpacity: 0.05,
            shadowRadius: 5,

            // Shadow (Android)
            elevation: 3,
        },

        icon:
        {
            fontSize: 22,
            marginRight: 15,
        },

        text: 
        {
            fontSize: 18,
        },

        footer:
        {
            fontSize: 12,
            textAlign: 'center',
            color: '#999',
            marginBottom: 10,
        },
    });