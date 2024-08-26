const CACHE_NAME = 'lawdo-cache-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/style.css',
    '/funcoes.js',
    'https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js',
    'https://unpkg.com/docx@7.1.0/build/index.js',
    'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.9.359/pdf.min.js'
    // Adicione aqui outros recursos que devem ser armazenados em cache
];

self.addEventListener('install', (event) => {
    console.log('Service Worker instalado');
});

self.addEventListener('activate', (event) => {
    console.log('Service Worker ativado');
});

self.addEventListener('fetch', (event) => {
    console.log('Fetch interceptado para:', event.request.url);
    // Aqui você pode adicionar lógica de cache posteriormente
});