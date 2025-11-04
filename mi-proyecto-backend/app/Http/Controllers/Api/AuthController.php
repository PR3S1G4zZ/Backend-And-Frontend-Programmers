<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use Illuminate\Validation\ValidationException;

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
                    'confirmed',
                    function ($attribute, $value, $fail) {
                        // Rechazar espacios en cualquier parte
                        if (preg_match('/\s/', $value)) {
                            $fail('La contraseña no debe contener espacios.');
                            return;
                        }
                        // Validar longitud con mb_strlen para contar correctamente caracteres especiales
                        $length = mb_strlen($value);
                        $lengthStrlen = strlen($value);
                        
                        // Log para depuración
                        \Log::info('Validando contraseña', [
                            'longitud_mb' => $length,
                            'longitud_strlen' => $lengthStrlen,
                            'valor_length' => $length,
                            'primeros_20_caracteres' => substr($value, 0, 20),
                            'bytes' => strlen($value)
                        ]);
                        
                        // Usar mb_strlen que cuenta caracteres correctamente
                        if ($length < 8) {
                            $fail('La contraseña debe tener al menos 8 caracteres. (Tienes: ' . $length . ')');
                            return;
                        }
                        if ($length > 15) {
                            $fail('La contraseña no puede tener más de 15 caracteres. (Tienes: ' . $length . ')');
                            return;
                        }
                        
                        // Validar que tenga al menos una mayúscula
                        if (!preg_match('/[A-Z]/', $value)) {
                            $fail('La contraseña debe tener al menos una mayúscula.');
                            return;
                        }
                        
                        // Validar que tenga al menos una minúscula
                        if (!preg_match('/[a-z]/', $value)) {
                            $fail('La contraseña debe tener al menos una minúscula.');
                            return;
                        }
                        
                        // Validar que tenga al menos un número
                        if (!preg_match('/[0-9]/', $value)) {
                            $fail('La contraseña debe tener al menos un número.');
                            return;
                        }
                        
                        // Validar que tenga al menos un carácter especial
                        if (!preg_match('/[@$!%*?&#]/', $value)) {
                            $fail('La contraseña debe tener al menos un carácter especial (@$!%*?&#).');
                            return;
                        }
                    },
                ],
                'user_type' => 'required|in:programmer,company'
            ], [
                'name.regex' => 'El nombre solo puede contener letras y espacios, sin espacios al inicio/fin.',
                'lastname.regex' => 'El apellido solo puede contener letras y espacios, sin espacios al inicio/fin.',
                'email.regex' => 'El correo debe contener "@" y exactamente un punto en el dominio (ej: usuario@dominio.tld).',
            ]);

            // Sanitización adicional de datos antes de crear el usuario
            $user = User::create([
                'name' => strip_tags(trim($validated['name'])),
                'lastname' => strip_tags(trim($validated['lastname'])),
                'email' => strtolower(trim($validated['email'])), // Normalizar email a minúsculas
                'password' => Hash::make($validated['password']), // Laravel ya usa bcrypt que es seguro
                'user_type' => $validated['user_type'],
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
            $token = $user->createToken('auth_token')->plainTextToken;

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
}