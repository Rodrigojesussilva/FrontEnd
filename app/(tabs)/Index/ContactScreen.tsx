import React from "react";
import { View, Text, TextInput, TouchableOpacity, Linking, ScrollView } from "react-native";

const ContactScreen = () => {
    return (
        <ScrollView style={{ padding: 20, backgroundColor: "#D1B28D" }}>
            <Text style={{ fontSize: 24, fontWeight: "bold", textAlign: "center", marginBottom: 20 }}>
            <Text style={{ color: "#d63384" }}>Elysium Beauty</Text>
            </Text>

            <View style={{ marginBottom: 20 }}>
                <Text style={{ fontSize: 18, fontWeight: "bold" }}>Fale conosco</Text>
                <Text style={{ fontSize: 16, color: "gray", marginTop: 5 }}>
                    Entre em contato para mais informações sobre nossos serviços de estética e bem-estar.
                </Text>
            </View>

            <View style={{ marginBottom: 20 }}>
                <Text style={{ fontSize: 16, fontWeight: "bold" }}>Phone:</Text>
                <Text style={{ fontSize: 16 }}>+123-456-789</Text>
                <Text style={{ fontSize: 16 }}>+111-222-333</Text>
            </View>

            <View style={{ marginBottom: 20 }}>
                <Text style={{ fontSize: 16, fontWeight: "bold" }}>Email:</Text>
                <Text style={{ fontSize: 16 }}>info@elysiumbeauty.com</Text>
                <Text style={{ fontSize: 16 }}>appointments@elysiumbeauty.com</Text>
            </View>

            <View style={{ marginBottom: 20 }}>
                <Text style={{ fontSize: 16, fontWeight: "bold" }}>Instagram:</Text>
                <Text style={{ fontSize: 16, color: "blue" }} onPress={() => Linking.openURL("https://www.instagram.com/elysiumbeauty")}>https://www.instagram.com/elysiumbeauty</Text>
            </View>

            <View style={{ marginBottom: 20 }}>
                <Text style={{ fontSize: 16, fontWeight: "bold" }}>Facebook:</Text>
                <Text style={{ fontSize: 16, color: "blue" }} onPress={() => Linking.openURL("https://www.facebook.com/elysiumbeauty")}>https://www.facebook.com/elysiumbeauty</Text>
            </View>

            <TextInput style={{ borderWidth: 1, padding: 10, marginBottom: 10, borderRadius: 5 }} placeholder="Nome" />
            <TextInput style={{ borderWidth: 1, padding: 10, marginBottom: 10, borderRadius: 5 }} placeholder="Email" keyboardType="email-address" />
            <TextInput style={{ borderWidth: 1, padding: 10, marginBottom: 10, borderRadius: 5 }} placeholder="Assunto" />
            <TextInput style={{ borderWidth: 1, padding: 10, marginBottom: 10, borderRadius: 5, height: 100, textAlignVertical: "top" }} placeholder="Mensagem" multiline />

            <TouchableOpacity style={{ backgroundColor: "#d63384", padding: 15, borderRadius: 5, alignItems: "center" }}>
                <Text style={{ color: "#fff", fontSize: 16, fontWeight: "bold" }}>Enviar mensagem</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

export default ContactScreen;
