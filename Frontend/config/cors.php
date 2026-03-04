<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    |
    | Here you may configure your settings for cross-origin resource sharing
    | or "CORS". This determines what cross-origin operations may execute
    | in web browsers. You are free to adjust these settings as needed.
    |
    | To learn more: https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
    |
    */

 'paths' => ['api/*', 'sanctum/csrf-cookie'],

'allowed_methods' => ['*'],

// Reemplaza el '*' por las URLs reales
'allowed_origins' => [
    'http://localhost:5173',          // Tu React local (Vite)
    'https://frontend-programmers.vercel.app', // Tu URL de Vercel
],

'allowed_origins_patterns' => [],

'allowed_headers' => ['*'],

'exposed_headers' => [],

'max_age' => 0,

// Cámbialo a true si vas a usar Login/Auth
'supports_credentials' => true,

];
