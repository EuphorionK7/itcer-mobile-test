<?php
header('Content-Type: application/json');

// Check if a file and EXIF data are sent
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_FILES['image']) && isset($_POST['latitude']) && isset($_POST['longitude'])) {
    // Directory to save uploaded images
    $uploadDir = 'uploads/';
    
    // Ensure the upload directory exists
    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0777, true);
    }

    // Retrieve the uploaded file details
    $fileName = basename($_FILES['image']['name']);
    $targetFilePath = $uploadDir . $fileName;
    
    // Save the file to the uploads directory
    if (move_uploaded_file($_FILES['image']['tmp_name'], $targetFilePath)) {
        // Retrieve EXIF data from POST
        $latitude = $_POST['latitude'];
        $longitude = $_POST['longitude'];
        $altitude = isset($_POST['altitude']) ? $_POST['altitude'] : 'N/A';
        $dateTaken = isset($_POST['dateTaken']) ? $_POST['dateTaken'] : 'N/A';

        // For now, we’ll just log the data to a JSON response (you could save it to a database)
        $response = [
            'status' => 'success',
            'message' => 'Image uploaded successfully',
            'image_path' => $targetFilePath,
            'latitude' => $latitude,
            'longitude' => $longitude,
            'altitude' => $altitude,
            'dateTaken' => $dateTaken
        ];

        // Return success response
        echo json_encode($response);
    } else {
        // Error handling if the image couldn't be uploaded
        echo json_encode([
            'status' => 'error',
            'message' => 'There was an error uploading the file.'
        ]);
    }
} else {
    // Handle missing data or invalid request
    echo json_encode([
        'status' => 'error',
        'message' => 'Invalid request or missing data.'
    ]);
}
