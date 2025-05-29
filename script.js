// script.js

document.addEventListener('DOMContentLoaded', function() {
    const jumlahAntrianSpan = document.getElementById('jumlah-antrian');
    const showFormBtn = document.getElementById('showFormBtn');
    const registrationForm = document.getElementById('registrationForm');
    const cancelFormBtn = document.getElementById('cancelFormBtn');
    const submissionMessage = document.getElementById('submissionMessage');

    // Dapatkan elemen kartu induk
    const ourProfilesCard = document.querySelector('.our-profiles-card');
    const paymentMethodCard = document.querySelector('.payment-method-overview');
    const whyRdsCard = document.querySelector('.why-rds-card');
    const accountOptimizationCard = document.querySelector('.account-optimization-card');

    // Dapatkan elemen detail
    const ourProfilesDetails = document.getElementById('our-profiles-details');
    const paymentDetails = document.getElementById('payment-details');
    const whyRdsDetails = document.getElementById('why-rds-details');
    const accountOptimizationDetails = document.getElementById('account-optimization-details');

    // Dapatkan elemen header kartu utama
    const ourProfilesHeader = document.querySelector('.our-profiles-card .info-card-header');
    const paymentHeader = document.querySelector('.payment-method-overview .info-card-header');
    const whyRdsHeader = document.querySelector('.why-rds-card .info-card-header');
    const accountOptimizationHeader = document.querySelector('.account-optimization-card .info-card-header');

    // Elemen untuk Kategori Akun dan Detail Permintaan Akun
    const pilihanAkunSelect = document.getElementById('pilihanAkun');
    const requestInputGroup = document.getElementById('requestInputGroup');
    const requestAkunTextarea = document.getElementById('requestAkun');

    // URL publik dari Google Apps Script Anda
    const scriptURL = 'https://script.google.com/macros/s/AKfycbwpMpIoFx3pNIJMktWLWoD3Oqt64kCC_G9LnGHCC_9HJEKYJyTubwllg8GjkRUaU_eL/exec';

    function fetchJumlahAntrian() {
        fetch(scriptURL + '?action=jumlah')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                if (jumlahAntrianSpan && data && data.jumlah !== undefined && data.total_pesanan !== undefined) {
                    jumlahAntrianSpan.textContent = `${data.jumlah} Orang (${data.total_pesanan} Akun)`;
                } else if (jumlahAntrianSpan) {
                    jumlahAntrianSpan.textContent = 'Data tidak lengkap';
                    console.warn('Fetched data missing expected properties:', data);
                }
            })
            .catch(error => {
                console.error('Gagal mengambil data antrian:', error);
                if (jumlahAntrianSpan) {
                    jumlahAntrianSpan.textContent = 'Gagal memuat';
                }
            });
    }

    fetchJumlahAntrian();
    setInterval(fetchJumlahAntrian, 10000);

    function toggleSection(detailsElement, headerElementForArrow, activeClass) {
        if (detailsElement && headerElementForArrow) {
            detailsElement.classList.toggle('hidden');
            headerElementForArrow.classList.toggle(activeClass);
        }
    }

    if (showFormBtn) {
        showFormBtn.addEventListener('click', function() {
            registrationForm.classList.remove('hidden');
            showFormBtn.classList.add('hidden');
            submissionMessage.classList.add('hidden');
            if (pilihanAkunSelect) {
                pilihanAkunSelect.value = '';
            }
            if (requestInputGroup) {
                requestInputGroup.classList.add('hidden');
                requestAkunTextarea.removeAttribute('required');
                requestAkunTextarea.value = '';
            }
        });
    }

    if (cancelFormBtn) {
        cancelFormBtn.addEventListener('click', function() {
            registrationForm.classList.add('hidden');
            showFormBtn.classList.remove('hidden');
            if (pilihanAkunSelect) {
                pilihanAkunSelect.value = '';
            }
            if (requestInputGroup) {
                requestInputGroup.classList.add('hidden');
                requestAkunTextarea.removeAttribute('required');
                requestAkunTextarea.value = '';
            }
            if (typeof grecaptcha !== 'undefined') {
                grecaptcha.reset();
            }
            document.getElementById('registrationForm').reset();
        });
    }

    const form = document.getElementById('registrationForm');
    if (form) {
        form.addEventListener('submit', function(event) {
            event.preventDefault();
            if (typeof grecaptcha !== 'undefined' && grecaptcha.getResponse() !== "") {
                if (pilihanAkunSelect && pilihanAkunSelect.value === 'By Request' && requestAkunTextarea.value.trim() === '') {
                    alert('Harap isi detail permintaan akun Anda.');
                    return;
                }
                const formData = new FormData(form);
                const action = form.getAttribute('action');
                fetch(action, {
                    method: 'POST',
                    body: formData,
                    mode: 'no-cors'
                }).then(() => {
                    registrationForm.classList.add('hidden');
                    submissionMessage.classList.remove('hidden');
                    showFormBtn.classList.remove('hidden');
                    form.reset();
                    if (typeof grecaptcha !== 'undefined') {
                        grecaptcha.reset();
                    }
                    if (pilihanAkunSelect) {
                        pilihanAkunSelect.value = '';
                    }
                    if (requestInputGroup) {
                        requestInputGroup.classList.add('hidden');
                        requestAkunTextarea.removeAttribute('required');
                        requestAkunTextarea.value = '';
                    }
                    fetchJumlahAntrian();
                }).catch(error => {
                    console.error('Terjadi kesalahan saat mengirim formulir:', error);
                    alert('Terjadi kesalahan saat mengirim formulir. Mohon coba lagi.');
                });
            } else {
                alert('Harap selesaikan reCAPTCHA terlebih dahulu.');
            }
        });
    }

    if (ourProfilesCard) {
        ourProfilesCard.addEventListener('click', function() {
            toggleSection(ourProfilesDetails, ourProfilesHeader, 'our-profiles-details-active');
        });
    }

    if (paymentMethodCard) {
        paymentMethodCard.addEventListener('click', function() {
            toggleSection(paymentDetails, paymentHeader, 'payment-details-active');
        });
    }

    if (whyRdsCard) {
        whyRdsCard.addEventListener('click', function() {
            toggleSection(whyRdsDetails, whyRdsHeader, 'why-rds-details-active');
        });
    }

    if (accountOptimizationCard && accountOptimizationHeader && accountOptimizationDetails) {
        accountOptimizationCard.addEventListener('click', function(event) {
            // Hanya toggle accordion utama jika klik bukan pada header tip atau konten tip
            if (!event.target.closest('.tip-header') && !event.target.closest('.tip-content')) {
                toggleSection(accountOptimizationDetails, accountOptimizationHeader, 'account-optimization-details-active');
            }
        });

        const tipHeaders = accountOptimizationCard.querySelectorAll('.tip-header');
        tipHeaders.forEach(header => {
            header.addEventListener('click', function(event) {
                event.stopPropagation(); // Mencegah event dari bubbling ke listener kartu utama
                const content = this.nextElementSibling; // .tip-content
                toggleSection(content, this, 'tip-header-active');
            });
        });
    }

    if (pilihanAkunSelect) {
        pilihanAkunSelect.addEventListener('change', function() {
            if (this.value === 'By Request') {
                requestInputGroup.classList.remove('hidden');
                requestAkunTextarea.setAttribute('required', 'true');
            } else {
                requestInputGroup.classList.add('hidden');
                requestAkunTextarea.removeAttribute('required');
                requestAkunTextarea.value = '';
            }
        });
    }
});
