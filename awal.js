document.addEventListener('DOMContentLoaded', function () {
    let scanner;
    let resultsTable = document.querySelector('#scan-results-table tbody');
    let sound = document.getElementById('scan-sound');
    let downloadButton = document.getElementById('download-button');
    let switchCam = document.getElementById('putar-kamera');

    let scannedData = [];
    let isSingleCamera = false;
    let currentCameraIndex = 0;

    function initializeScanner(cameraIndex) {
        if (scanner) {
            scanner.stop();
        }

        scanner = new Instascan.Scanner({ video: document.getElementById('camera-preview') });
        scanner.addListener('scan', function (content) {
            sound.play();

            const newRow = document.createElement('tr');
            const newCell = document.createElement('td');
            newCell.textContent = content;
            newRow.appendChild(newCell);
            resultsTable.appendChild(newRow);

            scannedData.push(content);
        });

        Instascan.Camera.getCameras().then(function (cameras) {
            if (cameras.length > 0) {
                if (cameras.length === 1) {
                    isSingleCamera = true;
                    switchCam.textContent = 'Putar Kamera';
                }

                const selectedCamera = cameras[cameraIndex] || cameras[0];
                currentCameraIndex = cameras.findIndex(camera => camera.id === selectedCamera.id);
                scanner.start(selectedCamera);
            } else {
                console.error('Tidak ada kamera ditemukan.');
            }
        });
    }

    function switchCamera() {
        if (scanner) {
            scanner.stop();
            scanner = null;
        }

        Instascan.Camera.getCameras().then(function (cameras) {
            if (cameras.length > 0) {
                if (isSingleCamera) {
                    initializeScanner(currentCameraIndex);
                } else {
                    const nextCameraIndex = (currentCameraIndex + 1) % cameras.length;
                    initializeScanner(nextCameraIndex);
                }
            } else {
                console.error('Tidak cukup kamera untuk beralih.');
            }
        });
    }

    function downloadCSV() {
        const csvContent = 'data:text/csv;charset=utf-8,' + encodeURI('NAMA - JABATAN\n' + scannedData.join('\n'));
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "scan-results.csv");
        document.body.appendChild(link);
        link.click();
    }

    switchCam.addEventListener('click', switchCamera);
    downloadButton.addEventListener('click', downloadCSV);

    initializeScanner(0); // Start the scanner with the first found camera
});
