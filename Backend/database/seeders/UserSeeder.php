<?php

namespace Database\Seeders;

use App\Models\Application;
use App\Models\CompanyProfile;
use App\Models\DeveloperProfile;
use App\Models\Project;
use App\Models\User;
use Faker\Factory as Faker;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class UserSeeder extends Seeder
{
    /**
     * Seed de usuarios, perfiles, proyectos y aplicaciones de demo.
     */
    public function run(): void
    {
        $this->command->info('🧹 Limpiando datos de demo...');

        DB::statement('SET FOREIGN_KEY_CHECKS=0');
        Application::truncate();
        Project::truncate();
        DeveloperProfile::truncate();
        CompanyProfile::truncate();
        User::truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1');

        $faker = Faker::create('es_ES');
        $password = 'Demo1234!';

        $this->command->info('👥 Creando 40 usuarios variados...');

        $firstNames = [
            'Ana', 'Luis', 'Carlos', 'María', 'Jorge', 'Lucía', 'Sofía', 'Miguel', 'Camila', 'Andrés',
            'Valeria', 'Pablo', 'Diego', 'Laura', 'Daniel', 'Paula', 'Fernando', 'Elena', 'Ricardo', 'Natalia',
        ];
        $lastNames = [
            'García', 'López', 'Martínez', 'Rodríguez', 'González', 'Pérez', 'Sánchez', 'Ramírez', 'Torres', 'Flores',
            'Díaz', 'Vargas', 'Morales', 'Castro', 'Ortega', 'Rojas', 'Navarro', 'Cruz', 'Mendoza', 'Silva',
        ];
        $domains = ['example.com', 'devmail.com', 'empresa.co', 'talento.dev'];
        $usedEmails = [];

        $makeEmail = function (string $first, string $last) use (&$usedEmails, $domains): string {
            $base = Str::slug($first . '.' . $last, '.');
            $domain = $domains[array_rand($domains)];
            $email = $base . '@' . $domain;
            $suffix = 1;

            while (in_array($email, $usedEmails, true)) {
                $email = $base . $suffix . '@' . $domain;
                $suffix++;
            }

            $usedEmails[] = $email;

            return $email;
        };

        $admins = [
            [
                'name' => 'Admin',
                'lastname' => 'Principal',
                'email' => 'admin@admin.com',
            ],
            [
                'name' => 'Carla',
                'lastname' => 'Suárez',
                'email' => 'carla.admin@devmail.com',
            ],
        ];

        $companies = [
            [
                'name' => 'Demo',
                'lastname' => 'Company',
                'email' => 'demo@company.com',
                'company_name' => 'Demo Company',
            ],
        ];

        $developers = [
            [
                'name' => 'Demo',
                'lastname' => 'Programmer',
                'email' => 'demo@dev.com',
            ],
            [
                'name' => 'Luis',
                'lastname' => 'García',
                'email' => 'luis@gmail.co',
            ],
        ];

        $companyTarget = 10;
        while (count($companies) < $companyTarget) {
            $first = $firstNames[array_rand($firstNames)];
            $last = $lastNames[array_rand($lastNames)];
            $companies[] = [
                'name' => $first,
                'lastname' => $last,
                'email' => $makeEmail($first, $last),
                'company_name' => 'Tech ' . $last . ' ' . $faker->randomElement(['Labs', 'Solutions', 'Studio', 'Group']),
            ];
        }

        $developerTarget = 28;
        while (count($developers) < $developerTarget) {
            $first = $firstNames[array_rand($firstNames)];
            $last = $lastNames[array_rand($lastNames)];
            $developers[] = [
                'name' => $first,
                'lastname' => $last,
                'email' => $makeEmail($first, $last),
            ];
        }

        foreach ($admins as $admin) {
            User::create([
                'name' => $admin['name'],
                'lastname' => $admin['lastname'],
                'email' => $admin['email'],
                'password' => $password,
                'user_type' => 'admin',
                'role' => 'admin',
            ]);
        }

        $companyUsers = collect();
        foreach ($companies as $company) {
            $user = User::create([
                'name' => $company['name'],
                'lastname' => $company['lastname'],
                'email' => $company['email'],
                'password' => $password,
                'user_type' => 'company',
                'role' => 'company',
            ]);

            CompanyProfile::create([
                'user_id' => $user->id,
                'company_name' => $company['company_name'],
                'website' => 'https://' . Str::slug($company['company_name']) . '.com',
                'about' => $faker->sentence(18),
            ]);

            $companyUsers->push($user);
        }

        $developerUsers = collect();
        $skillPool = ['Laravel', 'React', 'Vue', 'Node.js', 'Docker', 'PostgreSQL', 'MySQL', 'AWS', 'TypeScript', 'Python'];
        foreach ($developers as $developer) {
            $user = User::create([
                'name' => $developer['name'],
                'lastname' => $developer['lastname'],
                'email' => $developer['email'],
                'password' => $password,
                'user_type' => 'programmer',
                'role' => 'programmer',
            ]);

            DeveloperProfile::create([
                'user_id' => $user->id,
                'headline' => $faker->randomElement(['Full Stack Developer', 'Backend Developer', 'Frontend Specialist', 'DevOps Engineer']),
                'skills' => $faker->randomElements($skillPool, rand(3, 5)),
                'bio' => $faker->paragraph(2),
                'links' => [
                    'github' => 'https://github.com/' . Str::slug($user->name . $user->lastname),
                    'linkedin' => 'https://linkedin.com/in/' . Str::slug($user->name . '-' . $user->lastname),
                ],
            ]);

            $developerUsers->push($user);
        }

        $this->command->info('🧩 Creando proyectos para empresas...');

        $projectTitles = [
            'Plataforma de gestión de talento',
            'Dashboard financiero en tiempo real',
            'Marketplace de servicios digitales',
            'Sistema de reservas multiciudad',
            'App de seguimiento de entregas',
            'Portal de onboarding corporativo',
        ];

        $projects = collect();
        foreach ($companyUsers as $companyUser) {
            $projectCount = rand(1, 3);
            for ($i = 0; $i < $projectCount; $i++) {
                $budgetMin = rand(800, 2500);
                $budgetMax = $budgetMin + rand(500, 3000);

                $projects->push(Project::create([
                    'company_id' => $companyUser->id,
                    'title' => $faker->randomElement($projectTitles),
                    'description' => $faker->paragraph(3),
                    'budget_min' => $budgetMin,
                    'budget_max' => $budgetMax,
                    'status' => $faker->randomElement(['open', 'in_progress', 'completed']),
                ]));
            }
        }

        $this->command->info('📨 Creando aplicaciones de desarrolladores...');

        foreach ($projects as $project) {
            $applicants = $developerUsers->random(rand(1, min(5, $developerUsers->count())));
            foreach ($applicants as $developer) {
                Application::create([
                    'project_id' => $project->id,
                    'developer_id' => $developer->id,
                    'cover_letter' => $faker->sentence(20),
                    'status' => $faker->randomElement(['sent', 'reviewed', 'accepted', 'rejected']),
                ]);
            }
        }

        $totalUsers = User::count();
        $this->command->info("✅ Seeder completado. Total usuarios creados: {$totalUsers}.");
    }
}
