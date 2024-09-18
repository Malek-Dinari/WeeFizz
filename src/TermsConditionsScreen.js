import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const TermsConditionsScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <TouchableOpacity onPress={() => navigation.navigate('WelcomeScreen')} style={styles.goBackButton}>
          <Image 
              source={require('../assets/X.png')}
              style={styles.goBackImage} 
          />
        </TouchableOpacity>
        <Image
            source={require('../assets/WeeFizz_logo_2.png')}
            style={styles.logoWeeFizz}
        />
        <Text style={styles.title}>Politique de sécurité et de protection de données</Text>
        <Text style={styles.sectionTitle}>1. Objectif</Text>
        <Text style={styles.text}>
          Weefizz restreint l'accès aux données confidentielles et sensibles pour éviter qu'elles ne soient perdues ou compromises,
          de façon à ne pas nuire à nos clients, à ne pas encourir de sanctions pour non-conformité et à ne pas nuire à notre
          réputation. Parallèlement, nous faisons en sorte que les utilisateurs puissent accéder aux données qui leur sont
          nécessaires pour travailler efficacement.
        </Text>
        <Text style={styles.sectionTitle}>2. Champ d'application</Text>
        <Text style={styles.text}>
          Cette politique de sécurité des données s'applique à toutes les données clients, données personnelles ou autres données de
          l'entreprise définies comme sensibles par la section « 2.2 Classification des données de l'entreprise ». Elle s'applique
          donc à tous les serveurs, bases de données et systèmes informatiques qui traitent ces données, y compris tout appareil
          régulièrement utilisé pour le courrier électronique, l'accès au Web ou d'autres tâches professionnelles. Tout utilisateur
          qui interagit avec les services informatiques de l'entreprise est également soumis à cette politique.
        </Text>
        <Text style={styles.sectionTitle}>2.2 Classification des données de l'entreprise</Text>
        <Text style={styles.subsectionTitle}>2.2.1 Rôles et responsabilités</Text>
        <Text style={styles.text}>
          Propriétaire des données – La personne responsable des données et des informations collectées est conservée et un membre de
          la haute direction. Le propriétaire des données doit effectuer les tâches suivantes :
        </Text>
        <Text style={styles.bulletPoint}>
          - Examen et catégorisation – Examiner et catégoriser les données et les informations recueillies
        </Text>
        <Text style={styles.bulletPoint}>
          - Étiquetages des données – Attribution d'étiquettes de classification en fonction du niveau d'impact potentiel des données
        </Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  content: {
    padding: 20,
  },
  goBackButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1,
  },
  goBackImage: {
    width: 24,
    height: 24,
    marginBottom: 20,
  },
  logoWeeFizz: {
    width: 144,
    height: 24,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  subsectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 10,
  },
  bulletPoint: {
    fontSize: 16,
    lineHeight: 24,
    marginLeft: 20,
    marginBottom: 10,
  },
});

export default TermsConditionsScreen;
