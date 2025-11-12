<?php

use App\Http\Controllers\{
    AuthController,
    ProjectController,
    ApplicationController,
    DashboardController
};
use Illuminate\Support\Facades\Route;

Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login',    [AuthController::class, 'login']);

    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/me',      [AuthController::class, 'me']);
    });
});

// Resto de tus rutas protegidas
Route::middleware('auth:sanctum')->group(function () {
    // Projects (solo empresas crean/gestionan)
    Route::get('/projects', [ProjectController::class, 'index']);
    Route::post('/projects', [ProjectController::class, 'store']);            // company
    Route::get('/projects/{project}', [ProjectController::class, 'show']);
    Route::put('/projects/{project}', [ProjectController::class, 'update']);  // company
    Route::delete('/projects/{project}', [ProjectController::class, 'destroy']);

    // Applications (los dev aplican)
    Route::post('/projects/{project}/apply', [ApplicationController::class, 'apply']); // programmer
    Route::get('/applications/mine', [ApplicationController::class, 'myApplications']); // programmer

    // Dashboards (métricas rápidas)
    Route::get('/dashboard/company', [DashboardController::class, 'company']);
    Route::get('/dashboard/programmer', [DashboardController::class, 'programmer']);
});
