document.addEventListener('DOMContentLoaded', () => {
    const themeButton = document.querySelector('.btn-theme');
    const root = document.documentElement;
    
    // Revisar el tema guardado en el local storage
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        root.setAttribute('data-theme', savedTheme);
        updateButtonText(savedTheme);
    }

    themeButton.addEventListener('click', () => {
        const currentTheme = root.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        root.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateButtonText(newTheme);
    });

    function updateButtonText(theme) {
        themeButton.textContent = theme === 'dark' ? 'Light theme' : 'Dark theme';
    }
}); 