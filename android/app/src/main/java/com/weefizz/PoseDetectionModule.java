package com.weefizzapp;

import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.util.Base64;
import android.util.SparseArray;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Promise;
import com.google.mlkit.posedetection.PoseDetection;
import com.google.mlkit.posedetection.PoseDetector;
import com.google.mlkit.posedetection.PoseDetectorOptions;
import com.google.mlkit.posedetection.Pose;
import com.google.mlkit.posedetection.PoseLandmark;

import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.util.HashMap;
import java.util.Map;

public class PoseDetectionModule extends ReactContextBaseJavaModule {

    private final PoseDetector poseDetector;

    public PoseDetectionModule(ReactApplicationContext reactContext) {
        super(reactContext);
        PoseDetectorOptions options = new PoseDetectorOptions.Builder()
                .setDetectorMode(PoseDetectorOptions.STREAM_MODE)
                .build();
        poseDetector = PoseDetection.getClient(options);
    }

    @ReactMethod
    public void detectPose(String base64Image, Promise promise) {
        try {
            // Convert base64Image to Bitmap
            Bitmap bitmap = convertBase64ToBitmap(base64Image);

            if (bitmap == null) {
                promise.reject("INVALID_IMAGE", "Failed to decode base64 image.");
                return;
            }

            // Create an InputImage object from Bitmap
            InputImage inputImage = InputImage.fromBitmap(bitmap, 0);

            // Run pose detection
            poseDetector.process(inputImage)
                    .addOnSuccessListener(pose -> {
                        // Extract pose landmarks
                        Map<String, Map<String, Float>> landmarks = new HashMap<>();
                        for (PoseLandmark landmark : pose.getAllPoseLandmarks()) {
                            if (landmark != null) {
                                Map<String, Float> position = new HashMap<>();
                                position.put("x", landmark.getPosition().x);
                                position.put("y", landmark.getPosition().y);
                                position.put("z", landmark.getPosition().z);
                                landmarks.put(getLandmarkName(landmark.getLandmarkType()), position);
                            }
                        }
                        promise.resolve(landmarks);
                    })
                    .addOnFailureListener(e -> promise.reject("POSE_DETECTION_ERROR", e));
        } catch (Exception e) {
            promise.reject("IMAGE_PROCESSING_ERROR", e);
        }
    }

    private Bitmap convertBase64ToBitmap(String base64Image) {
        try {
            byte[] decodedString = Base64.decode(base64Image, Base64.DEFAULT);
            InputStream inputStream = new ByteArrayInputStream(decodedString);
            return BitmapFactory.decodeStream(inputStream);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    private String getLandmarkName(int landmarkType) {
        // Mapping landmark types to human-readable names
        switch (landmarkType) {
            case PoseLandmark.LEFT_SHOULDER: return "LEFT_SHOULDER";
            case PoseLandmark.RIGHT_SHOULDER: return "RIGHT_SHOULDER";
            case PoseLandmark.LEFT_ELBOW: return "LEFT_ELBOW";
            case PoseLandmark.RIGHT_ELBOW: return "RIGHT_ELBOW";
            case PoseLandmark.LEFT_WRIST: return "LEFT_WRIST";
            case PoseLandmark.RIGHT_WRIST: return "RIGHT_WRIST";
            case PoseLandmark.LEFT_HIP: return "LEFT_HIP";
            case PoseLandmark.RIGHT_HIP: return "RIGHT_HIP";
            case PoseLandmark.LEFT_KNEE: return "LEFT_KNEE";
            case PoseLandmark.RIGHT_KNEE: return "RIGHT_KNEE";
            case PoseLandmark.LEFT_ANKLE: return "LEFT_ANKLE";
            case PoseLandmark.RIGHT_ANKLE: return "RIGHT_ANKLE";
            case PoseLandmark.LEFT_PINKY: return "LEFT_PINKY";
            case PoseLandmark.RIGHT_PINKY: return "RIGHT_PINKY";
            case PoseLandmark.LEFT_INDEX: return "LEFT_INDEX";
            case PoseLandmark.RIGHT_INDEX: return "RIGHT_INDEX";
            case PoseLandmark.LEFT_THUMB: return "LEFT_THUMB";
            case PoseLandmark.RIGHT_THUMB: return "RIGHT_THUMB";
            case PoseLandmark.LEFT_HEEL: return "LEFT_HEEL";
            case PoseLandmark.RIGHT_HEEL: return "RIGHT_HEEL";
            case PoseLandmark.LEFT_FOOT_INDEX: return "LEFT_FOOT_INDEX";
            case PoseLandmark.RIGHT_FOOT_INDEX: return "RIGHT_FOOT_INDEX";
            case PoseLandmark.NOSE: return "NOSE";
            case PoseLandmark.LEFT_EYE_INNER: return "LEFT_EYE_INNER";
            case PoseLandmark.LEFT_EYE: return "LEFT_EYE";
            case PoseLandmark.LEFT_EYE_OUTER: return "LEFT_EYE_OUTER";
            case PoseLandmark.RIGHT_EYE_INNER: return "RIGHT_EYE_INNER";
            case PoseLandmark.RIGHT_EYE: return "RIGHT_EYE";
            case PoseLandmark.RIGHT_EYE_OUTER: return "RIGHT_EYE_OUTER";
            case PoseLandmark.LEFT_EAR: return "LEFT_EAR";
            case PoseLandmark.RIGHT_EAR: return "RIGHT_EAR";
            case PoseLandmark.LEFT_MOUTH: return "LEFT_MOUTH";
            case PoseLandmark.RIGHT_MOUTH: return "RIGHT_MOUTH";
            default: return "UNKNOWN_LANDMARK";
        }
    }

    @Override
    public String getName() {
        return "PoseDetectionModule";
    }
}
