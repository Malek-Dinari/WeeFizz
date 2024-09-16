import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

const WelcomeScreen = () => {
  const [isChecked, setIsChecked] = useState(false);
  const navigation = useNavigation();
  const route = useRoute();
  const { productUrl } = route.params; // Retrieve the productUrl parameter

  const handlePrimaryButtonPress = () => {
    if (isChecked) {
      navigation.navigate('SexSelectionScreen', { productUrl }); // Pass the productUrl to the next screen
    } else {
      alert("Veuillez accepter les termes et conditions pour continuer.");
    }
  };

  return (
    <View style={styles.background}>
      <View style={styles.whiteOverlay} />
      <ScrollView contentContainerStyle={styles.container}>
        {/* Logo and Text */}
        <Image 
          source={require('../assets/FIT_Shop.png')} 
          style={styles.logoFITShop}
        />
        <Image 
          source={require('../assets/by_WeeFizz.png')} 
          style={styles.logoByWeeFizz}
        />
        <Image 
          source={require('../assets/renseigner_prendre_obtenir.png')} 
          style={styles.logoRenseigner}
        />

        {/* Primary Button */}
        <TouchableOpacity style={styles.primaryButton} onPress={handlePrimaryButtonPress}>
          <Image 
            source={require('../assets/Bouton_primaire.png')} 
            style={styles.buttonImage}
          />
        </TouchableOpacity>

        {/* Custom Checkbox and Terms Text */}
        <View style={styles.termsContainer}>
          <TouchableOpacity onPress={() => setIsChecked(!isChecked)} style={styles.checkboxContainer}>
            <Image 
              source={
                isChecked 
                  ? require('../assets/checkbox_checked.png') 
                  : require('../assets/checkbox_unchecked.png')
              } 
              style={styles.checkboxImage}
            />
          </TouchableOpacity>
          <Text style={styles.termsText}>
            En sélectionnant cette option, j'accepte la{' '}
            <Text style={styles.linkText} onPress={() => navigation.navigate('TermsConditionsScreen')}>
              politique de confidentialité
            </Text>{' '}
            et les{' '}
            <Text style={styles.linkText} onPress={() => navigation.navigate('CGUScreen')}>
              CGU
            </Text>{' '}
            et nos conditions d'utilisation.
          </Text>
        </View>

        {/* Divider Line */}
        <View style={styles.divider} />

        {/* Footer */}
        <Text style={styles.footer}>
          Toutes les données sont cryptées dans les deux sens, sécurisées par SSL et ne sont jamais partagées avec qui que ce soit.
        </Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  background: { flex: 1 },
  whiteOverlay: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'white', opacity: 1,
  },
  container: {
    flexGrow: 1, justifyContent: 'center', alignItems: 'center', padding: 20,
  },
  logoFITShop: { width: 181, height: 71, marginBottom: 0 },
  logoByWeeFizz: { width: 183, height: 28, marginBottom: 30 },
  logoRenseigner: { width: 324, height: 144, marginBottom: 30 },
  primaryButton: { marginTop: 20 },
  buttonImage: { width: 334, height: 50, borderRadius: 25 },
  termsContainer: {
    flexDirection: 'row', alignItems: 'center', marginTop: 20,
    paddingHorizontal: 20, justifyContent: 'center',
  },
  checkboxContainer: { marginRight: 10 },
  checkboxImage: { width: 24, height: 24 },
  termsText: { color: 'black', fontSize: 12, flexShrink: 1 },
  linkText: { color: 'blue', textDecorationLine: 'underline' },
  divider: { width: '80%', height: 1, backgroundColor: 'black', marginVertical: 20 },
  footer: { marginTop: 20, color: 'black', fontSize: 12, textAlign: 'left' },
});

export default WelcomeScreen;
