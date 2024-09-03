package com.weefizzapp;

import android.graphics.Bitmap;
import androidx.annotation.NonNull;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.google.mlkit.vision.common.InputImage;
import com.google.mlkit.vision.pose.Pose;
import com.google.mlkit.vision.pose.PoseDetector;
import com.google.mlkit.vision.pose.PoseDetectorOptions;
import com.google.mlkit.vision.pose.PoseDetection;
import com.google.mlkit.vision.pose.PoseLandmark;
import java.util.HashMap;
import java.util.Map;

public class PoseDetectorModuleSide extends ReactContextBaseJavaModule {

    private final PoseDetector poseDetector;

    public PoseDetectorModuleSide(ReactApplicationContext reactContext) {
        super(reactContext);
        PoseDetectorOptions options =
                new PoseDetectorOptions.Builder()
                        .setDetectorMode(PoseDetectorOptions.STREAM_MODE)
                        .build();
        poseDetector = PoseDetection.getClient(options);
    }

    @NonNull
    @Override
    public String getName() {
        return "PoseDetectorModuleSide";
    }

    @ReactMethod
    public void processImage(Bitmap bitmap, Promise promise) {
        try {
            InputImage image = InputImage.fromBitmap(bitmap, 0);
            poseDetector.process(image)
                    .addOnSuccessListener(poses -> {
                        Map<String, Map<String, Float>> landmarks = new HashMap<>();
                        for (PoseLandmark landmark : poses.getAllPoseLandmarks()) {
                            if (landmark != null) {
                                Map<String, Float> position = new HashMap<>();
                                position.put("x", landmark.getPosition().x);
                                position.put("y", landmark.getPosition().y);
                                position.put("z", landmark.getPosition().z);
                                landmarks.put(landmark.getLandmarkType(), position);
                            }
                        }
                        promise.resolve(landmarks);
                    })
                    .addOnFailureListener(e -> promise.reject("POSE_DETECTION_ERROR", e));
        } catch (Exception e) {
            promise.reject("IMAGE_PROCESSING_ERROR", e);
        }
    }
}
