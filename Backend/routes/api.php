<?php

use App\Http\Controllers\{
    AuthController,
    ProjectController,
    ApplicationController,
    DashboardController,
    AdminController,
    ConversationController,
    DeveloperController,
    ProfileController,
    TaxonomyController,
    PaymentMethodController,
    WalletController
};
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| AUTH ROUTES
|--------------------------------------------------------------------------
*/

Route::prefix('auth')->group(function () {

    // Registro y Login
    Route::post('/register', [AuthController::class, 'register'])->middleware('throttle:6,1');
    Route::post('/login',    [AuthController::class, 'login'])->middleware('throttle:6,1');
    // recuperar contraseña
    Route::post('/forgot-password', [AuthController::class, 'sendResetLink'])->middleware('throttle:5,1');
    Route::post('/reset-password', [AuthController::class, 'resetPassword'])->middleware('throttle:5,1');

    // Rutas protegidas
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/me',      [AuthController::class, 'me']);
        Route::post('/change-password', [AuthController::class, 'changePassword']);
    });
});


/*
|--------------------------------------------------------------------------
| RUTAS PROTEGIDAS (PROYECTOS, APLICACIONES, DASHBOARD)
|--------------------------------------------------------------------------
*/

Route::middleware('auth:sanctum')->group(function () {

    // Projects (solo empresas)
    Route::get('/projects', [ProjectController::class, 'index']);
    Route::post('/projects', [ProjectController::class, 'store']);
    Route::get('/projects/{project}', [ProjectController::class, 'show']);
    Route::put('/projects/{project}', [ProjectController::class, 'update']);
    Route::post('/projects/{project}/fund', [ProjectController::class, 'fund']);
    Route::delete('/projects/{project}', [ProjectController::class, 'destroy']);

    // Aplicaciones (programadores)
    Route::post('/projects/{project}/apply', [ApplicationController::class, 'apply']);
    Route::get('/applications/mine', [ApplicationController::class, 'myApplications']);
    
    // Gestión de Candidatos (Empresa)
    Route::get('/projects/{project}/applications', [ApplicationController::class, 'index']); // Listar candidatos
    Route::post('/applications/{application}/accept', [ApplicationController::class, 'accept']); // Aceptar candidato
    Route::post('/applications/{application}/reject', [ApplicationController::class, 'reject']); // Rechazar candidato

    // Wallet
    Route::get('/wallet', [\App\Http\Controllers\WalletController::class, 'show']);
    Route::post('/wallet/recharge', [\App\Http\Controllers\WalletController::class, 'recharge']);

    // Dashboards
    Route::get('/dashboard/company', [DashboardController::class, 'company']);
    Route::get('/dashboard/programmer', [DashboardController::class, 'programmer']);

    // Profile
    Route::get('/profile', [ProfileController::class, 'show']);
    Route::put('/profile', [ProfileController::class, 'update']);

    // Taxonomies
    Route::get('/taxonomies/skills', [TaxonomyController::class, 'skills']);
    Route::get('/taxonomies/categories', [TaxonomyController::class, 'categories']);

    // Developers
    Route::get('/developers', [DeveloperController::class, 'index']);

    // Conversations
    Route::get('/conversations', [ConversationController::class, 'index']);
    Route::get('/conversations/{conversation}/messages', [ConversationController::class, 'messages']);
    Route::post('/conversations/{conversation}/messages', [ConversationController::class, 'storeMessage']);

    // Company projects
    Route::get('/company/projects', [ProjectController::class, 'companyProjects']);

    // Admin routes (solo administradores)
    Route::prefix('admin')->middleware('admin')->group(function () {
        Route::post('/users', [AdminController::class, 'createUser']);
        Route::get('/users', [AdminController::class, 'getUsers']);
        Route::get('/users/stats', [AdminController::class, 'getUserStats']);
        Route::get('/users/{id}', [AdminController::class, 'getUser']);
        Route::put('/users/{id}', [AdminController::class, 'updateUser']);
        Route::delete('/users/{id}', [AdminController::class, 'deleteUser']);
        
        // Admin Projects
        Route::get('/projects', [AdminController::class, 'getProjects']);
        Route::put('/projects/{id}', [AdminController::class, 'updateProject']);
        Route::delete('/projects/{id}', [AdminController::class, 'deleteProject']);
        Route::post('/projects/{id}/restore', [AdminController::class, 'restoreProject']);

        Route::get('/metrics', [AdminController::class, 'metrics']);
    });

    // Payment Methods
    Route::get('/payment-methods', [PaymentMethodController::class, 'index']);
    Route::post('/payment-methods', [PaymentMethodController::class, 'store']);
    Route::put('/payment-methods/{paymentMethod}', [PaymentMethodController::class, 'update']);
    Route::delete('/payment-methods/{paymentMethod}', [PaymentMethodController::class, 'destroy']);
    
});
