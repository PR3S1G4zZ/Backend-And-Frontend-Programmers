<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, HasApiTokens;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'lastname',
        'email',
        'password',
        'user_type',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            // No usar el cast 'hashed' aquí, usaremos un mutator personalizado
        ];
    }

    /**
     * Almacena el password original antes de que se hashee.
     */
    protected $originalPassword = null;

    /**
     * Mutator para el password: captura el valor original y lo hashea.
     *
     * @param string $value
     * @return void
     */
    public function setPasswordAttribute($value)
    {
        $isHashed = is_string($value) && (
            str_starts_with($value, '$2y$') || str_starts_with($value, '$2a$') || str_starts_with($value, '$2b$')
        );

        // Guardar el password original solo si NO está hasheado
        $this->originalPassword = $isHashed ? null : ($value === null ? '' : $value);

        // Hashear el password antes de guardarlo si no está hasheado
        if (!empty($value) && !$isHashed) {
            $this->attributes['password'] = \Illuminate\Support\Facades\Hash::make($value);
        } else {
            // Si ya está hasheado o está vacío, guardarlo tal cual
            $this->attributes['password'] = $value;
        }
    }

    /**
     * Boot the model.
     * Valida los datos antes de crear o actualizar un usuario.
     */
    protected static function boot()
    {
        parent::boot();

        // El mutator setPasswordAttribute ya captura el password original

        static::creating(function ($user) {
            // Validar primero con los datos tal cual fueron provistos (sin trim),
            // para detectar espacios iniciales/finales en email y nombres
            static::validateUserData($user, false);

            // Luego sanitizar datos antes de guardar
            $user->name = strip_tags(trim($user->name));
            $user->lastname = strip_tags(trim($user->lastname));
            $user->email = strtolower(trim($user->email));
        });

        static::updating(function ($user) {
            static::validateUserData($user, true);
            // Sanitizar datos antes de actualizar
            if ($user->isDirty('name')) {
                $user->name = strip_tags(trim($user->name));
            }
            if ($user->isDirty('lastname')) {
                $user->lastname = strip_tags(trim($user->lastname));
            }
            if ($user->isDirty('email')) {
                $user->email = strtolower(trim($user->email));
            }
        });
    }

    /**
     * Validar datos del usuario.
     *
     * @param \App\Models\User $user
     * @param bool $isUpdate
     * @return void
     * @throws \Illuminate\Validation\ValidationException
     */
    protected static function validateUserData($user, $isUpdate = false)
    {
        $rules = [
            'name' => 'required|string|max:255|regex:/^(?!\s)[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+(?<!\s)$/',
            'lastname' => 'required|string|max:255|regex:/^(?!\s)[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+(?<!\s)$/',
            'email' => [
                'required',
                'string',
                'email',
                'max:255',
                'regex:/^[^@\s]+@[^@\.\s]+\.[^@\.\s]+$/i', // Debe tener "@" y exactamente un punto tras el "@"
                'regex:/^\S+$/' // Sin espacios en todo el correo
            ],
            'user_type' => 'required|in:programmer,company'
        ];

        // Para actualización, usar unique con excepción del usuario actual
        if ($isUpdate) {
            $rules['email'][] = 'unique:users,email,' . $user->id;
        } else {
            $rules['email'][] = 'unique:users';
        }

        // Validar contraseña solo si está presente o es creación
        if (!$isUpdate || !empty($user->password)) {
            $rules['password'] = [
                'required',
                'string',
                'regex:/^\S+$/', // Sin espacios
                function ($attribute, $value, $fail) {
                    // Rechazar espacios
                    if (preg_match('/\s/', $value)) {
                        $fail('La contraseña no debe contener espacios.');
                        return;
                    }
                    // Validar longitud con mb_strlen para contar correctamente caracteres especiales
                    $length = mb_strlen($value);
                    if ($length < 8) {
                        $fail('La contraseña debe tener al menos 8 caracteres.');
                        return;
                    }
                    if ($length > 15) {
                        $fail('La contraseña no puede tener más de 15 caracteres.');
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
            ];
        }

        $messages = [
            'name.regex' => 'El nombre solo puede contener letras y espacios, sin espacios al inicio/fin.',
            'lastname.regex' => 'El apellido solo puede contener letras y espacios, sin espacios al inicio/fin.',
            'email.regex' => 'El correo debe contener "@", un solo punto en el dominio y no debe tener espacios.',
        ];

        // Obtener atributos originales (sin procesar por casts) para validar el password en texto plano
        $attributes = $user->getAttributes();
        
        // Si tenemos el password original guardado por el mutator, usarlo para la validación
        // El mutator siempre debería establecer originalPassword cuando se asigna el atributo
        if ($user->originalPassword !== null) {
            // Usar el password original capturado por el mutator
            $attributes['password'] = $user->originalPassword;
        } elseif (isset($attributes['password'])) {
            $passwordValue = $attributes['password'];
            // Si el password ya está hasheado (empieza con $2y$, $2a$, $2b$), no podemos validar el original
            if (str_starts_with($passwordValue, '$2y$') || str_starts_with($passwordValue, '$2a$') || str_starts_with($passwordValue, '$2b$')) {
                // El password ya está hasheado y no tenemos el original, saltar validación
                // Esto puede pasar si se actualiza un usuario sin cambiar el password
                unset($rules['password']);
            }
            // Si no está hasheado, es el password original y podemos validarlo
        } else {
            // No hay password, la validación 'required' fallará correctamente
        }

        $validator = Validator::make($attributes, $rules, $messages);

        if ($validator->fails()) {
            throw ValidationException::withMessages($validator->errors()->toArray());
        }
    }
}
