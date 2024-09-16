import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Modal, TextInput } from 'react-native';
import axios from 'axios';
import { useNavigation, useRoute } from '@react-navigation/native';

const MeasurementResultsScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { measurements, productUrl } = route.params; // Measurements data and product URL
  
  const [productImage, setProductImage] = useState(null);
  const [rating, setRating] = useState(0);
  const [showPopup, setShowPopup] = useState(false);

  // Fetch product image from the API
  useEffect(() => {
    const fetchProductImage = async () => {
      try {
        const response = await axios.get(productUrl);
        const imagePath = response.data.cover_image_path;
        setProductImage(imagePath);
      } catch (error) {
        console.error("Error fetching product image:", error);
      }
    };
    fetchProductImage();
  }, [productUrl]);

  // Function to handle rating stars click
  const handleStarClick = (starValue) => {
    setRating(starValue);
  };

  // Handle navigation to UpperMeasurementsResultsScreen
  const navigateToUpperMeasurementsResults = () => {
    navigation.navigate('UpperMeasurementsResultsScreen', { measurements });
  };

  // Handle navigation to QRScanScreen
  const navigateToQRScanScreen = () => {
    navigation.navigate('QRScanScreen');
  };

  return (
    <View style={styles.container}>
      {/* Product Image */}
      {productImage && (
        <Image source={{ uri: `https://${productImage}` }} style={styles.productImage} />
      )}
      
      {/* Measurement Container */}
      <View style={styles.measurementContainer}>
        <TouchableOpacity onPress={navigateToUpperMeasurementsResults}>
          <Image source={require('../assets/lower_model.png')} style={styles.lowerModelIcon} />
        </TouchableOpacity>
        
        <Image source={require('../assets/mesures_fields.png')} style={styles.mesuresFieldsIcon} />

        {/* Measurements display */}
        <Text style={styles.measurementText}>Taille: {measurements.size}</Text>
        <Text style={styles.measurementText}>Tour de taille: {measurements.waist}</Text>
        {/* Other measurement fields */}
      </View>

      {/* Info Text */}
      <View style={styles.infoContainer}>
        <Image source={require('../assets/info_text.png')} style={styles.infoTextIcon} />
      </View>

      {/* Rescan Button */}
      <TouchableOpacity onPress={navigateToQRScanScreen} style={styles.rescanButton}>
        <Image source={require('../assets/Rescan_button.png')} style={styles.rescanButtonIcon} />
      </TouchableOpacity>

      {/* Show Rating Popup */}
      <TouchableOpacity onPress={() => setShowPopup(true)} style={styles.ratingButton}>
        <Text style={styles.ratingButtonText}>Évaluer la recommandation</Text>
      </TouchableOpacity>

      {/* Popup for rating */}
      <Modal visible={showPopup} transparent={true} animationType="fade">
        <View style={styles.modalBackground}>
          <View style={styles.popupContainer}>
            <TouchableOpacity onPress={() => setShowPopup(false)} style={styles.closeButton}>
              <Image source={require('../assets/crossX.png')} style={styles.closeIcon} />
            </TouchableOpacity>
            <Image source={require('../assets/heartbubble.png')} style={styles.heartBubbleIcon} />
            <Text style={styles.popupTitle}>Comment évaluez-vous notre recommandation ?</Text>
            
            {/* Star Rating Component */}
            <View style={styles.starRatingContainer}>
              {[1, 2, 3, 4, 5].map((star, index) => (
                <TouchableOpacity key={index} onPress={() => handleStarClick(star)}>
                  <Image
                    source={
                      rating >= star
                        ? require('../assets/1_star.png')  // Full star
                        : rating >= star - 0.5
                        ? require('../assets/half_star_rating.png') // Half star
                        : require('../assets/empty_star.png') // Empty star
                    }
                    style={styles.starIcon}
                  />
                </TouchableOpacity>
              ))}
            </View>

            {/* Input Field */}
            <TextInput
              style={styles.textInput}
              placeholder="Écrire..."
              placeholderTextColor="#999"
            />

            {/* Submit Button */}
            <TouchableOpacity style={styles.submitButton} onPress={() => setShowPopup(false)}>
              <Image source={require('../assets/Bouton_valider.png')} style={styles.submitIcon} />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  productImage: {
    width: '100%',
    height: 550, // Occupying top part of the screen
    resizeMode: 'cover',
  },
  measurementContainer: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  measurementText: {
    fontSize: 18,
    marginBottom: 10,
  },
  lowerModelIcon: {
    width: 57,
    height: 150,
    alignSelf: 'center',
  },
  mesuresFieldsIcon: {
    width: '100%',
    height: 200,
    marginTop: 10,
  },
  infoContainer: {
    marginTop: 15,
    alignItems: 'center',
  },
  infoTextIcon: {
    width: 350,
    height: 28,
  },
  rescanButton: {
    marginTop: 15,
    alignItems: 'center',
  },
  rescanButtonIcon: {
    width: 350,
    height: 50,
  },
  ratingButton: {
    backgroundColor: '#3FAAA6',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 20,
  },
  ratingButtonText: {
    color: '#FFF',
    fontSize: 16,
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  popupContainer: {
    width: 300,
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  closeIcon: {
    width: 24,
    height: 24,
  },
  heartBubbleIcon: {
    width: 56,
    height: 56,
  },
  popupTitle: {
    fontSize: 16,
    marginVertical: 20,
    textAlign: 'center',
  },
  starRatingContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  starIcon: {
    width: 24,
    height: 24,
    marginHorizontal: 5,
  },
  textInput: {
    width: '100%',
    height: 40,
    borderColor: '#CCC',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  submitButton: {
    width: 191,
    height: 50,
  },
  submitIcon: {
    width: '100%',
    height: '100%',
  },
});

export default MeasurementResultsScreen;
