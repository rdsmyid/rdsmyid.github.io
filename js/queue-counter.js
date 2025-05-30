// js/queue-counter.js

// Variabel ini akan diinisialisasi setelah DOM siap
let jumlahAntrianSpan; 
// URL publik dari Google Apps Script Anda
const scriptURL_queue = 'https://script.google.com/macros/s/AKfycbwpMpIoFx3pNIJMktWLWoD3Oqt64kCC_G9LnGHCC_9HJEKYJyTubwllg8GjkRUaU_eL/exec';

// Fungsi untuk mengambil jumlah antrian (sekarang bisa diakses dari luar file ini)
function fetchJumlahAntrian() {
    // Pastikan jumlahAntrianSpan sudah diinisialisasi dan ada di DOM
    if (!jumlahAntrianSpan) {
        // console.warn('Elemen #jumlah-antrian belum diinisialisasi atau tidak ditemukan, fetch dibatalkan.');
        return; 
    }

    fetch(scriptURL_queue + '?action=jumlah')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (data && data.jumlah !== undefined && data.total_pesanan !== undefined) {
                jumlahAntrianSpan.textContent = `${data.jumlah} Orang (${data.total_pesanan} Akun)`;
            } else {
                jumlahAntrianSpan.textContent = 'Data tidak lengkap';
                console.warn('Fetched data missing expected properties:', data);
            }
        })
        .catch(error => {
            console.error('Gagal mengambil data antrian:', error);
            if (jumlahAntrianSpan) { // Periksa lagi untuk keamanan
                jumlahAntrianSpan.textContent = 'Gagal memuat';
            }
        });
}

document.addEventListener('DOMContentLoaded', function() {
    // Inisialisasi jumlahAntrianSpan setelah DOM siap
    jumlahAntrianSpan = document.getElementById('jumlah-antrian');
    
    // Panggil fetchJumlahAntrian saat halaman dimuat dan elemennya ada
    // lalu atur interval untuk memperbarui secara berkala setiap 10 detik
    if (jumlahAntrianSpan) {
        fetchJumlahAntrian(); // Panggilan awal
        setInterval(fetchJumlahAntrian, 10000); // Atur interval
    } else {
        console.warn('Inisialisasi penghitung antrian gagal: Elemen #jumlah-antrian tidak ditemukan.');
    }
});
