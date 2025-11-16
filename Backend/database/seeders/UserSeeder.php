<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Validation\ValidationException;

class UserSeeder extends Seeder
{
    /**
     * Seed de usuarios de demo para validar el flujo (login/registro frontend).
     */
    public function run(): void
    {
        $this->command->info('🧹 Limpiando usuarios de prueba...');

        
        $testEmails = [
            'demo@dev.com',          // programmer
            'demo@company.com',      // company
            'luis@gmail.co',         // válido con un solo punto tras "@"
        ];

        User::whereIn('email', $testEmails)->delete();
        $this->command->info('✓ Usuarios de prueba anteriores eliminados.');
        $this->command->newLine();

        // Programmer demo (coincide con frontend DEMO_ACCOUNTS)
        try {
            User::create([
                'name' => 'Demo Programmer',
                'lastname' => 'User',
                'email' => 'demo@dev.com',
                'password' => 'Demo1234!', // 8+ caracteres, incluye mayúscula y especial
                'user_type' => 'programmer',
            ]);
            $this->command->info('✓ Creado: demo@dev.com / demo123 (programmer)');
        } catch (\Exception $e) {
            $this->command->error('✗ Error creando demo programmer: ' . $e->getMessage());
        }

        // Company demo (coincide con frontend DEMO_ACCOUNTS)
        try {
            User::create([
                'name' => 'Demo Company',
                'lastname' => 'User',
                'email' => 'demo@company.com',
                'password' => 'Demo1234!', // 8+ caracteres, incluye mayúscula y especial
                'user_type' => 'company',
            ]);
            $this->command->info('✓ Creado: demo@company.com / demo123 (company)');
        } catch (\Exception $e) {
            $this->command->error('✗ Error creando demo company: ' . $e->getMessage());
        }

        // Usuario válido con el nuevo criterio (un solo punto tras "@")
        try {
            User::create([
                'name' => 'Luis',
                'lastname' => 'García',
                'email' => 'luis@gmail.co',
                'password' => 'MiPass123!@#',
                'user_type' => 'programmer',
            ]);
            $this->command->info('✓ Creado: luis@gmail.co (válido por regla de un solo punto)');
        } catch (\Exception $e) {
            $this->command->error('✗ Error creando luis@gmail.co: ' . $e->getMessage());
        }

        // Casos inválidos: emails con espacios (debe fallar)
        $invalidEmailsWithSpaces = [
            ' demo@dev.com',
            'demo @dev.com',
            'demo@ dev.com',
            'demo@dev .com',
            'demo@dev.com ',
        ];
        foreach ($invalidEmailsWithSpaces as $badEmail) {
            try {
                User::create([
                    'name' => 'Bad',
                    'lastname' => 'Email',
                    'email' => $badEmail,
                    'password' => 'Demo123!@',
                    'user_type' => 'programmer',
                ]);
                $this->command->error('✗ ERROR: Se creó usuario con email inválido (con espacios): "' . $badEmail . '"');
            } catch (\Exception $e) {
                $this->command->info('✓ Rechazado email con espacios: "' . $badEmail . '" -> ' . $e->getMessage());
            }
        }

        $this->command->newLine();
        $this->command->info('Seeder completado. Puedes usar las cuentas demo para validar en el frontend.');
    }
}
