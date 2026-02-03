<?php

use App\Http\Controllers\{
    AuthController,
    ProjectController,
    ApplicationController,
    DashboardController,
    AdminController
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
    Route::delete('/projects/{project}', [ProjectController::class, 'destroy']);

    // Aplicaciones (programadores)
    Route::post('/projects/{project}/apply', [ApplicationController::class, 'apply']);
    Route::get('/applications/mine', [ApplicationController::class, 'myApplications']);

    // Dashboards
    Route::get('/dashboard/company', [DashboardController::class, 'company']);
    Route::get('/dashboard/programmer', [DashboardController::class, 'programmer']);

    // Admin routes (solo administradores)
    Route::prefix('admin')->middleware('admin')->group(function () {
        Route::get('/users', [AdminController::class, 'getUsers']);
        Route::get('/users/stats', [AdminController::class, 'getUserStats']);
        Route::get('/users/{id}', [AdminController::class, 'getUser']);
        Route::put('/users/{id}', [AdminController::class, 'updateUser']);
        Route::delete('/users/{id}', [AdminController::class, 'deleteUser']);
        Route::get('/metrics', [AdminController::class, 'metrics']);
    });

    
});
