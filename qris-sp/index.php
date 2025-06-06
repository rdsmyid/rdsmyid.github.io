<?php
// Nama file gambar QRIS Anda yang sudah diunggah
$file = 'qris-sp.jpeg';

// Nama file yang akan diterima oleh pengguna saat mengunduh
$download_filename = 'qris-sp.jpeg';

if (file_exists($file)) {
    header('Content-Description: File Transfer');
    // Mengatur tipe konten yang benar untuk file JPEG
    header('Content-Type: image/jpeg');
    header('Content-Disposition: attachment; filename="' . $download_filename . '"');
    header('Expires: 0');
    header('Cache-Control: must-revalidate');
    header('Pragma: public');
    header('Content-Length: ' . filesize($file));
    readfile($file);
    exit;
} else {
    echo "File tidak ditemukan.";
}
?>
