// js/main-accordions.js

document.addEventListener('DOMContentLoaded', function() {
    // Dapatkan elemen kartu induk (ini yang akan menerima event klik)
    const ourProfilesCard = document.querySelector('.our-profiles-card');
    const paymentMethodCard = document.querySelector('.payment-method-overview');
    const whyRdsCard = document.querySelector('.why-rds-card');
    const accountOptimizationCard = document.querySelector('.account-optimization-card');

    // Dapatkan elemen detail (ini yang akan di-toggle visibilitasnya)
    const ourProfilesDetails = document.getElementById('our-profiles-details');
    const paymentDetails = document.getElementById('payment-details');
    const whyRdsDetails = document.getElementById('why-rds-details');
    const accountOptimizationDetails = document.getElementById('account-optimization-details');

    // Dapatkan elemen header kartu utama (ini yang akan menerima kelas aktif untuk rotasi panah)
    const ourProfilesHeader = document.querySelector('.our-profiles-card .info-card-header');
    const paymentHeader = document.querySelector('.payment-method-overview .info-card-header');
    const whyRdsHeader = document.querySelector('.why-rds-card .info-card-header');
    const accountOptimizationHeader = document.querySelector('.account-optimization-card .info-card-header');

    // Event listener untuk Kategori Akun (seluruh kartu)
    if (ourProfilesCard && ourProfilesDetails && ourProfilesHeader) {
        ourProfilesCard.addEventListener('click', function() {
            // toggleSection diambil dari utils.js (diasumsikan sudah dimuat dan global)
            toggleSection(ourProfilesDetails, ourProfilesHeader, 'our-profiles-details-active');
        });
    }

    // Event listener untuk Metode Pembayaran (seluruh kartu)
    if (paymentMethodCard && paymentDetails && paymentHeader) {
        paymentMethodCard.addEventListener('click', function() {
            toggleSection(paymentDetails, paymentHeader, 'payment-details-active');
        });
    }

    // Event listener untuk Kenapa RDS? (seluruh kartu)
    if (whyRdsCard && whyRdsDetails && whyRdsHeader) {
        whyRdsCard.addEventListener('click', function() {
            toggleSection(whyRdsDetails, whyRdsHeader, 'why-rds-details-active');
        });
    }

    // Event listener untuk Optimisasi Akun (kartu utama dan nested accordions)
    if (accountOptimizationCard && accountOptimizationDetails && accountOptimizationHeader) {
        // Listener untuk kartu utama "Optimisasi Akun"
        accountOptimizationCard.addEventListener('click', function(event) {
            // Hanya toggle accordion utama jika klik BUKAN pada header tip atau konten tip di dalamnya
            if (!event.target.closest('.tip-header') && !event.target.closest('.tip-content')) {
                toggleSection(accountOptimizationDetails, accountOptimizationHeader, 'account-optimization-details-active');
            }
        });

        // Logika untuk nested accordion di dalam Optimisasi Akun
        const tipHeaders = accountOptimizationCard.querySelectorAll('.tip-header');
        tipHeaders.forEach(header => {
            header.addEventListener('click', function(event) {
                event.stopPropagation(); // Mencegah event bubbling ke listener kartu utama
                const content = this.nextElementSibling; // Elemen .tip-content yang mengikuti .tip-header
                // toggleSection diambil dari utils.js
                toggleSection(content, this, 'tip-header-active');
            });
        });
    }
});
