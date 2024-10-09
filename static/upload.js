document.addEventListener('DOMContentLoaded', function() {
    const imageUpload = document.getElementById('imageUpload');
    const imageElement = document.getElementById('imageElement');
    const imageText = document.getElementById('imageText');
    const uploadBtn = document.getElementById('upload-btn');
    const latitudeElem = document.getElementById('latitude');
    const longitudeElem = document.getElementById('longitude');
    const altitudeElem = document.getElementById('altitude');
    const dateTakenElem = document.getElementById('dateTaken');
    const cameraModelElem = document.getElementById('cameraModel');
    const orientationElem = document.getElementById('orientation');
    const exifDataDiv = document.getElementById('exifData');
    const gpsErrorMessage = document.getElementById('gpsErrorMessage');
    const loader = document.getElementById('loader');

    uploadBtn.style.display = 'none';
    exifDataDiv.style.display = 'none';
    gpsErrorMessage.style.display = 'none';
    loader.style.display = 'none';

    imageUpload.addEventListener('change', function() {
        const file = this.files[0];
        if (file) {
            const reader = new FileReader();

            reader.onload = function(event) {
                imageElement.setAttribute('src', event.target.result);
                imageElement.style.display = "block";
                imageText.style.display = "none";
                uploadBtn.style.display = 'block';

                EXIF.getData(file, function() {
                    const latitude = EXIF.getTag(this, "GPSLatitude");
                    const longitude = EXIF.getTag(this, "GPSLongitude");
                    const altitude = EXIF.getTag(this, "GPSAltitude");
                    const dateTaken = EXIF.getTag(this, "DateTimeOriginal");
                    const cameraModel = EXIF.getTag(this, "Model");
                    const orientation = EXIF.getTag(this, "Orientation");

                    if (latitude && longitude) {
                        latitudeElem.textContent = convertDMSToDD(latitude, EXIF.getTag(this, "GPSLatitudeRef"));
                        longitudeElem.textContent = convertDMSToDD(longitude, EXIF.getTag(this, "GPSLongitudeRef"));
                    } else {
                        latitudeElem.textContent = 'N/A';
                        longitudeElem.textContent = 'N/A';
                    }

                    altitudeElem.textContent = altitude ? altitude : 'N/A';
                    dateTakenElem.textContent = dateTaken ? dateTaken : 'N/A';
                    cameraModelElem.textContent = cameraModel ? cameraModel : 'N/A';
                    orientationElem.textContent = orientation ? getOrientationName(orientation) : 'N/A';
                    exifDataDiv.style.display = 'block';
                });
            };

            reader.readAsDataURL(file);
        } else {
            imageElement.style.display = "none";
            imageText.style.display = "block";
            uploadBtn.style.display = 'none';
            exifDataDiv.style.display = 'none';
        }
    });

    function convertDMSToDD(dmsArray, ref) {
        const degrees = dmsArray[0];
        const minutes = dmsArray[1];
        const seconds = dmsArray[2];
        let decimal = degrees + minutes / 60 + seconds / 3600;

        if (ref === "S" || ref === "W") {
            decimal *= -1;
        }

        return decimal.toFixed(6);
    }

    function getOrientationName(orientation) {
        const orientationMap = {
            1: "Normal",
            3: "Upside Down",
            6: "Rotate 90° CW",
            8: "Rotate 270° CW"
        };
        return orientationMap[orientation] || "Unknown";
    }
});