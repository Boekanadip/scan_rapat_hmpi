// const scanner = new Instascan.Scanner({
//     video: document.getElementById("camera-preview"),
//   });
//   const scanResultsTable = document
//     .getElementById("scan-results-table")
//     .getElementsByTagName("tbody")[0];
//   const downloadLink = document.getElementById("download-link");
//   const scanSound = document.getElementById("scan-sound"); // Tambahkan ini
//   let scanCounter = 1;

//   scanner.addListener("scan", function (content) {
//     document.getElementById("scan-result").textContent = content;

//     // Menambahkan hasil scan ke dalam tabel
//     const newRow = scanResultsTable.insertRow();
//     const cell1 = newRow.insertCell(0);
//     const cell2 = newRow.insertCell(1);
//     cell1.textContent = scanCounter;
//     cell2.textContent = content;
//     scanCounter++;

//     // Memainkan suara bip
//     playScanSound();

//     // Update dan atur scroll ke bawah
//     updateDownloadLink();

//     const lastRow = scanResultsTable.rows[scanResultsTable.rows.length - 1];
//     lastRow.scrollIntoView({ behavior: "smooth", block: "end" });
//   });


//   Instascan.Camera.getCameras()
//     .then(function (cameras) {
//       if (cameras.length > 0) {
//         scanner.start(cameras[0]);
//       } else {
//         console.error("No cameras found.");
//       }
//     })
//     .catch(function (error) {
//       console.error("Error accessing cameras:", error);
//     });

//   function updateDownloadLink() {
//     let csvContent = "No.,Hasil Scan\n";

//     for (let i = 0; i < scanResultsTable.rows.length; i++) {
//       const row = scanResultsTable.rows[i];
//       const scanNumber = row.cells[0].textContent;
//       const scanResult = row.cells[1].textContent;
//       csvContent += `${scanNumber},${scanResult}\n`;
//     }

//     const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
//     const url = URL.createObjectURL(blob);
//     downloadLink.href = url;
//     downloadLink.style.display = "block";
//     downloadLink.download = "scan_results.csv";
//   }

//   function playScanSound() {
//     scanSound.currentTime = 0; // Reset waktu pemutaran
//     scanSound.play();
//   }  

// function downloadXLSX() {
//     const xlsx = require('xlsx'); // Import library xlsx.js
//     const ws = xlsx.utils.aoa_to_sheet([['NAMA', 'JABATAN'], ...scannedData]);

//     const wb = xlsx.utils.book_new();
//     xlsx.utils.book_append_sheet(wb, ws, 'Sheet1');

//     const blob = xlsx.write(wb, { bookType: 'xlsx', type: 'blob' });
//     const blobURL = URL.createObjectURL(blob);

//     const link = document.createElement("a");
//     link.setAttribute("href", blobURL);
//     link.setAttribute("download", "scan-results.xlsx");
//     document.body.appendChild(link);

//     link.click();
//   }

//   // Tambahkan event listener ke tombol Unduh
//   downloadButton.addEventListener('click', downloadXLSX);   
document.addEventListener('DOMContentLoaded', function () {
    let scanner;
    let resultsTable = document.querySelector('#scan-results-table tbody');
    let sound = document.getElementById('scan-sound');
    let downloadButton = document.getElementById('download-button');
    let switchCam = document.getElementById('putar-kamera');

    let scannedData = [];
    let scanCounter = 1;

    function initializeScanner() {
        if (scanner) {
            scanner.stop();
        }

        scanner = new Instascan.Scanner({ video: document.getElementById('camera-preview') });
        scanner.addListener('scan', function (content) {
            sound.play();

            // Displaying the number and each name on a new line in the table
            const newRow = document.createElement('tr');
            const numberCell = document.createElement('td');
            numberCell.textContent = scanCounter;
            newRow.appendChild(numberCell);

            const newCell = document.createElement('td');
            const names = content.split(' - ');
            names.forEach(name => {
                const nameDiv = document.createElement('div');
                nameDiv.textContent = name;
                newCell.appendChild(nameDiv);
            });
            newRow.appendChild(newCell);

            resultsTable.appendChild(newRow);

            // Adding each name to the scannedData array
            scannedData.push({ number: scanCounter, names: names });

            scanCounter++;

            // Play scan sound
            playScanSound();

            const lastRow = resultsTable.rows[resultsTable.rows.length - 1];
            lastRow.scrollIntoView({ behavior: 'smooth', block: 'end' });
        });

        Instascan.Camera.getCameras().then(function (cameras) {
            if (cameras.length > 0) {
                scanner.start(cameras[0]);
            } else {
                console.error('Tidak ada kamera ditemukan.');
            }
        });
    }

    function downloadCSV() {
        // Prepare CSV content with each name on a new line
        let csvContent = 'data:text/csv;charset=utf-8,NOMOR. NAMA - JABATAN\n';
        scannedData.forEach(entry => {
            csvContent += `${entry.number}. ${entry.names.join(' - ')}\n`;
        });

        // Create and trigger download link
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', 'scan-results.csv');
        document.body.appendChild(link);
        link.click();
    }

    function playScanSound() {
        sound.currentTime = 0; // Reset play time
        sound.play();
    }

    switchCam.addEventListener('click', initializeScanner);
    downloadButton.addEventListener('click', downloadCSV);

    initializeScanner(); // Start the scanner
});
