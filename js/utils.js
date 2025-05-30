// js/utils.js

// Fungsi toggle yang lebih umum
function toggleSection(detailsElement, headerElementForArrow, activeClass) {
    if (detailsElement && headerElementForArrow) {
        detailsElement.classList.toggle('hidden');
        headerElementForArrow.classList.toggle(activeClass);
    }
}
