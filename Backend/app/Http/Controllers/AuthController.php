<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Mail;
use App\Mail\ResetPasswordMail;
use Illuminate\Support\Str;

class AuthController extends Controller
{
    /**
     * Registrar un nuevo usuario
     */
    public function register(Request $request)
    {
        try {
            // Validación reforzada con sanitización de datos
            $validated = $request->validate([
                'name' => 'required|string|max:255|regex:/^(?!\s)[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+(?<!\s)$/',
                'lastname' => 'required|string|max:255|regex:/^(?!\s)[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+(?<!\s)$/',
                'email' => [
                    'required',
                    'string',
                    'email',
                    'max:255',
                    'unique:users',
                    'regex:/^[^@\s]+@[^@\.\s]+\.[^@\.\s]+$/i', // Debe tener "@" y un solo punto después del "@"
                    'regex:/^\S+$/' // Sin espacios en todo el correo
                ],
                'password' => [
                    'required',
                    'string',
                    'min:8',
                    'max:15',
                    'confirmed',
                    'regex:/^\S+$/', // Sin espacios
                    'regex:/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,15}$/' // Mínimo 8, máximo 15, 1 mayúscula, 1 minúscula, 1 número, 1 carácter especial
                ],
                'user_type' => 'required|in:programmer,company,admin'
            ], [
                'name.regex' => 'El nombre solo puede contener letras y espacios, sin espacios al inicio/fin.',
                'lastname.regex' => 'El apellido solo puede contener letras y espacios, sin espacios al inicio/fin.',
                'email.regex' => 'El correo debe contener "@", un solo punto en el dominio y no debe tener espacios.',
                'password.min' => 'La contraseña debe tener al menos 8 caracteres.',
                'password.max' => 'La contraseña no puede tener más de 15 caracteres.',
                'password.regex' => 'La contraseña debe tener entre 8 y 15 caracteres, sin espacios, con al menos una mayúscula, una minúscula, un número y un carácter especial (@$!%*?&#).',
            ]);

            // Sanitización adicional de datos antes de crear el usuario
            $user = User::create([
                'name' => strip_tags(trim($validated['name'])),
                'lastname' => strip_tags(trim($validated['lastname'])),
                'email' => strtolower(trim($validated['email'])), // Normalizar email a minúsculas
                'password' => Hash::make($validated['password']), // hashear la contraseña
                'user_type' => $validated['user_type'],
                'role' => $validated['user_type'], // Para compatibilidad con la tabla
            ]);

            $token = $user->createToken('auth_token')->plainTextToken;

            return response()->json([
                'success' => true,
                'message' => 'Usuario registrado exitosamente',
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'lastname' => $user->lastname,
                    'email' => $user->email,
                    'user_type' => $user->user_type,
                ],
                'token' => $token
            ], 201);

        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error de validación',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error interno del servidor',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Iniciar sesión
     */
    public function login(Request $request)
    {
        try {
            // Validación reforzada con sanitización de datos
            $validated = $request->validate([
                'email' => [
                    'required',
                    'email',
                    'regex:/^[^@\s]+@[^@\.\s]+\.[^@\.\s]+$/i', // Debe tener "@" y un solo punto después del "@"
                    'regex:/^\S+$/' // Sin espacios en todo el correo
                ],
                'password' => [
                    'required',
                    'string',
                    'max:255',
                    'regex:/^\S+$/', // Sin espacios
                ]
            ], [
                'email.regex' => 'El correo debe contener "@", un solo punto en el dominio y no debe tener espacios.',
                'password.regex' => 'La contraseña no debe contener espacios.',
            ]);

            // Sanitización del email antes de la autenticación
            $email = strtolower(trim($validated['email']));
            $password = $validated['password'];

            // Laravel usa consultas preparadas automáticamente, pero verificamos credenciales de forma segura
            if (!Auth::attempt(['email' => $email, 'password' => $password])) {
                return response()->json([
                    'success' => false,
                    'message' => 'Credenciales incorrectas'
                ], 401);
            }

            $user = Auth::user();
            $token = $user->createToken('auth_token')->plainTextToken; // crear token de autenticación

            return response()->json([
                'success' => true,
                'message' => 'Inicio de sesión exitoso',
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'lastname' => $user->lastname,
                    'email' => $user->email,
                    'user_type' => $user->user_type,
                ],
                'token' => $token
            ], 200);

        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error de validación',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error interno del servidor',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Cerrar sesión
     */
    public function logout(Request $request)
    {
        try {
            $request->user()->currentAccessToken()->delete();

            return response()->json([
                'success' => true,
                'message' => 'Sesión cerrada exitosamente'
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al cerrar sesión',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Obtener información del usuario autenticado
     */
    public function me(Request $request)
    {
        try {
            $user = $request->user();

            return response()->json([
                'success' => true,
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'lastname' => $user->lastname,
                    'email' => $user->email,
                    'user_type' => $user->user_type,
                ]
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener información del usuario',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function sendResetLink(Request $request)
{
    $request->validate([
        'email' => 'required|email'
    ]);

    $user = User::where('email', $request->email)->first();

    if (!$user) {
        return response()->json([
            'success' => false,
            'message' => 'No existe un usuario con este correo'
        ], 404);
    }

    // Generar token de reseteo
    $token = Password::createToken($user);

    // URL del frontend
    $resetUrl = "http://localhost:5174/reset-password?token={$token}&email={$user->email}";

    // Enviar correo
    Mail::to($user->email)->send(new ResetPasswordMail($resetUrl));

    return response()->json([
        'success' => true,
        'message' => 'Correo enviado correctamente'
    ], 200);
}


/**
 * Resetear contraseña desde el frontend
 */
public function resetPassword(Request $request)
{
    $request->validate([
        'token' => 'required',
        'email' => 'required|email',
        'password' => [
            'required',
            'string',
            'min:8',
            'max:15',
            'confirmed',
            'regex:/^\S+$/'
        ]
    ]);

    $status = Password::reset(
        $request->only('email', 'password', 'password_confirmation', 'token'),
        function ($user) use ($request) {
            $user->forceFill([
                'password' => Hash::make($request->password)
            ])->save();
        }
    );

    if ($status === Password::PASSWORD_RESET) {
        return response()->json([
            'success' => true,
            'message' => 'Contraseña actualizada correctamente'
        ], 200);
    }

    return response()->json([
        'success' => false,
        'message' => 'Error al restablecer la contraseña'
    ], 400);
    }
}
