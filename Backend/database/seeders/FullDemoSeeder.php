<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;
use App\Models\User;
use App\Models\Skill;
use App\Models\ProjectCategory;
use App\Models\DeveloperProfile;
use App\Models\CompanyProfile;
use App\Models\Wallet;
use App\Models\PaymentMethod;
use App\Models\Project;
use App\Models\Application;
use App\Models\Milestone;
use App\Models\Conversation;
use App\Models\Message;
use App\Models\Review;
use App\Models\Transaction;
use App\Models\PortfolioProject;
use App\Models\UserPreference;
use App\Models\ActivityLog;
use App\Models\SystemSetting;
use App\Models\Favorite;

class FullDemoSeeder extends Seeder
{
    public function run(): void
    {
        $this->command->info('=== INICIANDO SEEDER DE DEMOSTRACIÓN COMPLETA ===');
        
        // 1. Truncar todas las tablas
        $this->truncateTables();
        
        // 2. Crear Skills
        $skills = $this->createSkills();
        
        // 3. Crear ProjectCategories
        $categories = $this->createCategories();
        
        // 4. Crear Admins
        $admins = $this->createAdmins();
        
        // 5. Crear Companies + CompanyProfiles
        $companies = $this->createCompanies();
        
        // 6. Crear Developers + DeveloperProfiles + developer_skill
        $developers = $this->createDevelopers($skills);
        
        // 7. Crear Wallets
        $this->createWallets($admins, $companies, $developers);
        
        // 8. Crear PaymentMethods
        $this->createPaymentMethods($companies, $developers);
        
        // 9. Crear Projects
        $projects = $this->createProjects($companies, $categories, $skills, $developers);
        
        // 10. Crear Applications
        $this->createApplications($projects, $developers);
        
        // 11. Crear Milestones
        $this->createMilestones($projects);
        
        // 12. Crear Conversations + Messages
        $this->createConversationsAndMessages($projects);
        
        // 13. Crear Reviews
        $this->createReviews($projects);
        
        // 14. Crear Transactions
        $this->createTransactions($projects, $admins);
        
        // 15. Crear PortfolioProjects
        $this->createPortfolios($developers);
        
        // 16. Crear Favorites
        $this->createFavorites($companies, $developers);
        
        // 17. Crear UserPreferences
        $this->createUserPreferences(array_merge($admins, $companies, $developers));
        
        // 18. Crear ActivityLogs
        $this->createActivityLogs($admins, $companies, $developers, $projects);
        
        // 19. Crear SystemSettings
        $this->createSystemSettings();
        
        $this->command->info('=== SEEDER COMPLETADO EXITOSAMENTE ===');
    }

    private function truncateTables(): void
    {
        $this->command->info('Truncando tablas...');
        DB::statement('SET FOREIGN_KEY_CHECKS=0');
        
        DB::table('favorites')->truncate();
        DB::table('activity_logs')->truncate();
        DB::table('user_preferences')->truncate();
        DB::table('system_settings')->truncate();
        DB::table('portfolio_projects')->truncate();
        DB::table('transactions')->truncate();
        DB::table('payment_methods')->truncate();
        DB::table('messages')->truncate();
        DB::table('conversations')->truncate();
        DB::table('reviews')->truncate();
        DB::table('milestones')->truncate();
        DB::table('project_skill')->truncate();
        DB::table('project_category_project')->truncate();
        DB::table('applications')->truncate();
        DB::table('projects')->truncate();
        DB::table('developer_skill')->truncate();
        DB::table('developer_profiles')->truncate();
        DB::table('company_profiles')->truncate();
        DB::table('wallets')->truncate();
        DB::table('personal_access_tokens')->truncate();
        DB::table('users')->truncate();
        DB::table('skills')->truncate();
        DB::table('project_categories')->truncate();
        
        DB::statement('SET FOREIGN_KEY_CHECKS=1');
    }

    private function createSkills(): array
    {
        $this->command->info('Creando skills...');
        
        $skillsData = [
            'Laravel', 'React', 'Vue.js', 'Node.js', 'Docker', 'PostgreSQL', 
            'MySQL', 'AWS', 'TypeScript', 'Python', 'Figma', 'React Native', 
            'Kubernetes', 'Terraform', 'Django', 'Next.js', 'Angular', 'Flutter', 
            'Swift', 'Kotlin', 'Go', 'Rust', 'MongoDB', 'Redis', 'GraphQL', 
            'TailwindCSS', 'PHP'
        ];
        
        $skills = [];
        foreach ($skillsData as $skillName) {
            $skill = Skill::create(['name' => $skillName]);
            $skills[$skillName] = $skill->id;
        }
        
        return $skills;
    }

    private function createCategories(): array
    {
        $this->command->info('Creando categorías de proyectos...');
        
        $categoriesData = [
            ['name' => 'Desarrollo Web', 'description' => 'Proyectos de desarrollo web completo', 'color' => '#3B82F6', 'icon' => 'globe'],
            ['name' => 'Desarrollo Mobile', 'description' => 'Aplicaciones móviles para iOS y Android', 'color' => '#10B981', 'icon' => 'device-mobile'],
            ['name' => 'UI/UX Design', 'description' => 'Diseño de interfaces y experiencia de usuario', 'color' => '#8B5CF6', 'icon' => 'palette'],
            ['name' => 'Backend/APIs', 'description' => 'Desarrollo de APIs y servicios backend', 'color' => '#F59E0B', 'icon' => 'server'],
            ['name' => 'DevOps', 'description' => 'Automatización, CI/CD e infraestructura', 'color' => '#EF4444', 'icon' => 'cloud'],
            ['name' => 'Data Science', 'description' => 'Análisis de datos y business intelligence', 'color' => '#06B6D4', 'icon' => 'chart-bar'],
            ['name' => 'AI/ML', 'description' => 'Inteligencia artificial y machine learning', 'color' => '#EC4899', 'icon' => 'cpu-chip'],
            ['name' => 'Blockchain', 'description' => 'Desarrollo blockchain y Web3', 'color' => '#F97316', 'icon' => 'cube-transparent'],
            ['name' => 'E-commerce', 'description' => 'Tiendas online y plataformas de venta', 'color' => '#84CC16', 'icon' => 'shopping-cart'],
            ['name' => 'Ciberseguridad', 'description' => 'Seguridad informática y auditoría', 'color' => '#6366F1', 'icon' => 'shield-check'],
            ['name' => 'Cloud Computing', 'description' => 'Servicios en la nube y arquitectura cloud', 'color' => '#14B8A6', 'icon' => 'cloud-arrow-up'],
            ['name' => 'QA/Testing', 'description' => 'Pruebas de software y control de calidad', 'color' => '#A855F7', 'icon' => 'beaker'],
        ];
        
        $categories = [];
        foreach ($categoriesData as $cat) {
            $category = ProjectCategory::create($cat);
            $categories[$category->name] = $category->id;
        }
        
        return $categories;
    }

    private function createAdmins(): array
    {
        $this->command->info('Creando usuarios administradores...');
        
        $admins = [];
        $adminsData = [
            ['name' => 'Admin', 'lastname' => 'Principal', 'email' => 'admin@admin.com'],
            ['name' => 'Soporte', 'lastname' => 'Técnico', 'email' => 'soporte@programmers.com'],
        ];
        
        foreach ($adminsData as $adminData) {
            $user = User::create([
                'name' => $adminData['name'],
                'lastname' => $adminData['lastname'],
                'email' => $adminData['email'],
                'password' => 'Demo1234!',
                'user_type' => 'admin',
                'role' => 'admin',
            ]);
            
            DB::table('users')->where('id', $user->id)->update(['email_verified_at' => Carbon::now()]);
            $admins[] = $user->id;
        }
        
        return $admins;
    }

    private function createCompanies(): array
    {
        $this->command->info('Creando empresas y perfiles...');
        
        $companies = [];
        $companiesData = [
            ['name' => 'Carlos', 'lastname' => 'Ramírez', 'email' => 'carlos@technova.com', 'company' => 'TechNova Solutions', 'website' => 'https://technova.com', 'about' => 'Empresa líder en desarrollo de soluciones tecnológicas innovadoras para empresas Fortune 500. Especializados en transformación digital y arquitecturas cloud.', 'location' => 'Madrid', 'country' => 'España'],
            ['name' => 'Ana', 'lastname' => 'Reyes', 'email' => 'ana@byteforge.mx', 'company' => 'ByteForge Labs', 'website' => 'https://byteforge.mx', 'about' => 'Laboratorio de innovación digital enfocado en crear productos tecnológicos disruptivos. Trabajamos con startups y corporaciones en toda Latinoamérica.', 'location' => 'Ciudad de México', 'country' => 'México'],
            ['name' => 'Pablo', 'lastname' => 'Torres', 'email' => 'pablo@cloudpeak.ar', 'company' => 'CloudPeak Studios', 'website' => 'https://cloudpeak.ar', 'about' => 'Estudio de desarrollo especializado en aplicaciones cloud-native y microservicios. Nuestro equipo ha entregado más de 200 proyectos exitosos.', 'location' => 'Buenos Aires', 'country' => 'Argentina'],
            ['name' => 'Laura', 'lastname' => 'Gómez', 'email' => 'laura@datastream.co', 'company' => 'DataStream Corp', 'website' => 'https://datastream.co', 'about' => 'Corporación dedicada al procesamiento de datos y analytics empresarial. Transformamos datos en decisiones estratégicas para nuestros clientes.', 'location' => 'Bogotá', 'country' => 'Colombia'],
            ['name' => 'Juan', 'lastname' => 'Méndez', 'email' => 'juan@innocode.cl', 'company' => 'InnoCode Group', 'website' => 'https://innocode.cl', 'about' => 'Grupo de desarrollo de software con enfoque en soluciones empresariales a medida. Más de 10 años de experiencia en el mercado chileno.', 'location' => 'Santiago', 'country' => 'Chile'],
            ['name' => 'Marta', 'lastname' => 'Leiva', 'email' => 'marta@nexgen.pe', 'company' => 'NexGen Digital', 'website' => 'https://nexgen.pe', 'about' => 'Agencia digital de nueva generación especializada en e-commerce y marketing digital. Ayudamos a empresas a crecer en el mundo online.', 'location' => 'Lima', 'country' => 'Perú'],
            ['name' => 'Fernando', 'lastname' => 'Villa', 'email' => 'fernando@appventure.co', 'company' => 'AppVenture Tech', 'website' => 'https://appventure.co', 'about' => 'Compañía de tecnología enfocada en desarrollo de aplicaciones móviles y experiencias digitales. Presencia en Colombia y Centroamérica.', 'location' => 'Medellín', 'country' => 'Colombia'],
            ['name' => 'Julia', 'lastname' => 'Santos', 'email' => 'julia@codecraft.uy', 'company' => 'CodeCraft Studios', 'website' => 'https://codecraft.uy', 'about' => 'Estudio boutique de desarrollo de software con estándares de calidad excepcionales. Especialistas en fintech y soluciones blockchain.', 'location' => 'Montevideo', 'country' => 'Uruguay'],
        ];
        
        foreach ($companiesData as $data) {
            $name = $data['name'];
            $lastname = $data['lastname'];
            $email = $data['email'];
            $company = $data['company'];
            
            $user = User::create([
                'name' => $name,
                'lastname' => $lastname,
                'email' => $email,
                'password' => 'Demo1234!',
                'user_type' => 'company',
                'role' => 'company',
            ]);
            
            DB::table('users')->where('id', $user->id)->update(['email_verified_at' => Carbon::now()]);
            
            CompanyProfile::create([
                'user_id' => $user->id,
                'company_name' => $company,
                'website' => $data['website'],
                'about' => $data['about'],
                'location' => $data['location'],
                'country' => $data['country'],
            ]);
            
            $companies[] = $user->id;
        }

        // === GENERACIÓN PROGRAMÁTICA: 12 empresas adicionales ===
        $this->command->info('Generando 12 empresas adicionales...');

        $extraCompanies = [
            ['name' => 'Ricardo', 'lastname' => 'Ortega', 'email' => 'ricardo@pixelworks.mx', 'company' => 'PixelWorks Agency', 'website' => 'https://pixelworks.mx', 'about' => 'Agencia creativa digital especializada en branding, diseño web y desarrollo de aplicaciones móviles para marcas emergentes en México y Centroamérica.', 'location' => 'Guadalajara', 'country' => 'México'],
            ['name' => 'Sofía', 'lastname' => 'Delgado', 'email' => 'sofia@quantumdev.co', 'company' => 'QuantumDev Solutions', 'website' => 'https://quantumdev.co', 'about' => 'Empresa de desarrollo de software enfocada en soluciones de inteligencia artificial y machine learning para el sector salud.', 'location' => 'Bogotá', 'country' => 'Colombia'],
            ['name' => 'Diego', 'lastname' => 'Fuentes', 'email' => 'diego@novatech.ar', 'company' => 'NovaTech Argentina', 'website' => 'https://novatech.ar', 'about' => 'Compañía de consultoría tecnológica que ofrece soluciones de transformación digital y migración cloud para PyMEs argentinas.', 'location' => 'Córdoba', 'country' => 'Argentina'],
            ['name' => 'Valentina', 'lastname' => 'Herrera', 'email' => 'valentina@startuplab.pe', 'company' => 'StartupLab Perú', 'website' => 'https://startuplab.pe', 'about' => 'Incubadora y aceleradora de startups tecnológicas con un laboratorio de innovación que desarrolla MVPs y productos digitales.', 'location' => 'Lima', 'country' => 'Perú'],
            ['name' => 'Alejandro', 'lastname' => 'Medina', 'email' => 'alejandro@cyberguard.es', 'company' => 'CyberGuard Security', 'website' => 'https://cyberguard.es', 'about' => 'Empresa líder en ciberseguridad que ofrece auditorías, pentesting y soluciones de seguridad informática para empresas en España y Latinoamérica.', 'location' => 'Barcelona', 'country' => 'España'],
            ['name' => 'Gabriela', 'lastname' => 'Rojas', 'email' => 'gabriela@greencode.cl', 'company' => 'GreenCode Technologies', 'website' => 'https://greencode.cl', 'about' => 'Desarrollo de software sustentable con enfoque en eficiencia energética y aplicaciones para el sector medioambiental y agritech.', 'location' => 'Santiago', 'country' => 'Chile'],
            ['name' => 'Martín', 'lastname' => 'Aguilar', 'email' => 'martin@finflow.uy', 'company' => 'FinFlow Fintech', 'website' => 'https://finflow.uy', 'about' => 'Fintech innovadora que desarrolla soluciones de pagos digitales, billeteras virtuales y plataformas de préstamos peer-to-peer.', 'location' => 'Montevideo', 'country' => 'Uruguay'],
            ['name' => 'Carolina', 'lastname' => 'Castillo', 'email' => 'carolina@edutech.mx', 'company' => 'EduTech México', 'website' => 'https://edutech.mx', 'about' => 'Plataforma educativa que desarrolla soluciones de e-learning, gamificación y sistemas de gestión académica para instituciones educativas.', 'location' => 'Monterrey', 'country' => 'México'],
            ['name' => 'Emilio', 'lastname' => 'Vargas', 'email' => 'emilio@logismart.co', 'company' => 'LogiSmart Solutions', 'website' => 'https://logismart.co', 'about' => 'Empresa de logística inteligente que crea software de gestión de cadena de suministro, tracking y optimización de rutas.', 'location' => 'Medellín', 'country' => 'Colombia'],
            ['name' => 'Natalia', 'lastname' => 'Cruz', 'email' => 'natalia@healthdev.ar', 'company' => 'HealthDev Labs', 'website' => 'https://healthdev.ar', 'about' => 'Laboratorio de innovación en salud digital que desarrolla aplicaciones de telemedicina, wearables y sistemas de historia clínica electrónica.', 'location' => 'Buenos Aires', 'country' => 'Argentina'],
            ['name' => 'Felipe', 'lastname' => 'Salazar', 'email' => 'felipe@retailpro.pe', 'company' => 'RetailPro Digital', 'website' => 'https://retailpro.pe', 'about' => 'Consultora especializada en soluciones de comercio electrónico, punto de venta y marketing digital para el sector retail.', 'location' => 'Lima', 'country' => 'Perú'],
            ['name' => 'Lorena', 'lastname' => 'Montoya', 'email' => 'lorena@gameforge.es', 'company' => 'GameForge Studios', 'website' => 'https://gameforge.es', 'about' => 'Estudio de desarrollo de videojuegos y experiencias interactivas con Unreal Engine y Unity para plataformas móviles y consola.', 'location' => 'Madrid', 'country' => 'España'],
        ];

        foreach ($extraCompanies as $data) {
            $user = User::create([
                'name' => $data['name'],
                'lastname' => $data['lastname'],
                'email' => $data['email'],
                'password' => 'Demo1234!',
                'user_type' => 'company',
                'role' => 'company',
            ]);

            DB::table('users')->where('id', $user->id)->update(['email_verified_at' => Carbon::now()]);

            CompanyProfile::create([
                'user_id' => $user->id,
                'company_name' => $data['company'],
                'website' => $data['website'],
                'about' => $data['about'],
                'location' => $data['location'],
                'country' => $data['country'],
            ]);

            $companies[] = $user->id;
        }

        $this->command->info('Total companies created: ' . count($companies));
        
        return $companies;
    }

    private function createDevelopers(array $skills): array
    {
        $this->command->info('Creando desarrolladores y perfiles...');
        
        $developers = [];
        $developersData = [
            ['name' => 'Andrés', 'lastname' => 'García', 'email' => 'andres@devmail.com', 'headline' => 'Full Stack Developer | React + Laravel', 'bio' => 'Desarrollador Full Stack con 6 años de experiencia construyendo aplicaciones web escalables. He trabajado con startups y empresas medianas en proyectos de e-commerce, SaaS y plataformas educativas. Mi stack principal es React en el frontend y Laravel en el backend.', 'hourly_rate' => 65, 'availability' => 'available', 'experience_years' => 6, 'languages' => ['Español', 'Inglés'], 'location' => 'Bogotá', 'country' => 'Colombia', 'skill_names' => ['Laravel', 'React', 'TypeScript', 'TailwindCSS', 'MySQL']],
            ['name' => 'Valentina', 'lastname' => 'López', 'email' => 'valentina@devmail.com', 'headline' => 'Frontend Specialist | React & Next.js', 'bio' => 'Especialista en frontend con pasión por crear interfaces de usuario intuitivas y accesibles. Experiencia en diseño de sistemas y componentes reutilizables. He liderado equipos de frontend en proyectos internacionales.', 'hourly_rate' => 55, 'availability' => 'available', 'experience_years' => 4, 'languages' => ['Español', 'Inglés', 'Portugués'], 'location' => 'Buenos Aires', 'country' => 'Argentina', 'skill_names' => ['React', 'Next.js', 'TypeScript', 'TailwindCSS', 'Figma']],
            ['name' => 'Santiago', 'lastname' => 'Martínez', 'email' => 'santiago@devmail.com', 'headline' => 'Senior Backend Engineer | Node.js + Docker', 'bio' => 'Ingeniero backend senior con experiencia en arquitecturas de microservicios y sistemas distribuidos. He diseñado APIs que manejan millones de requests diarios. Apasionado por la optimización y las mejores prácticas.', 'hourly_rate' => 95, 'availability' => 'busy', 'experience_years' => 9, 'languages' => ['Español', 'Inglés'], 'location' => 'Santiago', 'country' => 'Chile', 'skill_names' => ['Node.js', 'Docker', 'Kubernetes', 'PostgreSQL', 'AWS', 'TypeScript']],
            ['name' => 'Camila', 'lastname' => 'Rodríguez', 'email' => 'camila@devmail.com', 'headline' => 'DevOps Engineer | AWS & Kubernetes', 'bio' => 'Ingeniera DevOps con experiencia en automatización de infraestructura y pipelines CI/CD. Certificada en AWS Solutions Architect y Kubernetes Administrator. He migrado múltiples empresas a arquitecturas cloud.', 'hourly_rate' => 85, 'availability' => 'available', 'experience_years' => 7, 'languages' => ['Español', 'Inglés'], 'location' => 'Lima', 'country' => 'Perú', 'skill_names' => ['Docker', 'Kubernetes', 'AWS', 'Terraform', 'Python']],
            ['name' => 'Mateo', 'lastname' => 'Hernández', 'email' => 'mateo@devmail.com', 'headline' => 'Mobile Developer | Flutter & React Native', 'bio' => 'Desarrollador móvil multiplataforma con apps publicadas que suman más de 500K descargas. Experiencia en Flutter y React Native, con conocimiento nativo en iOS y Android.', 'hourly_rate' => 70, 'availability' => 'available', 'experience_years' => 5, 'languages' => ['Español', 'Inglés'], 'location' => 'Ciudad de México', 'country' => 'México', 'skill_names' => ['Flutter', 'React Native', 'TypeScript', 'Swift', 'Kotlin']],
            ['name' => 'Isabella', 'lastname' => 'Torres', 'email' => 'isabella@devmail.com', 'headline' => 'UI/UX Developer | Figma & React', 'bio' => 'Diseñadora y desarrolladora UI/UX con un enfoque centrado en el usuario. Combino habilidades de diseño en Figma con implementación en código. He trabajado con equipos de producto en empresas de fintech y healthtech.', 'hourly_rate' => 60, 'availability' => 'busy', 'experience_years' => 5, 'languages' => ['Español', 'Inglés', 'Francés'], 'location' => 'Madrid', 'country' => 'España', 'skill_names' => ['Figma', 'React', 'TailwindCSS', 'Next.js', 'Vue.js']],
            ['name' => 'Sebastián', 'lastname' => 'Ramírez', 'email' => 'sebastian@devmail.com', 'headline' => 'Data Engineer | Python & AWS', 'bio' => 'Ingeniero de datos especializado en pipelines ETL y arquitecturas de datos en la nube. Experiencia con grandes volúmenes de datos y herramientas de Big Data. He implementado data warehouses para empresas de retail y finanzas.', 'hourly_rate' => 80, 'availability' => 'available', 'experience_years' => 6, 'languages' => ['Español', 'Inglés'], 'location' => 'Medellín', 'country' => 'Colombia', 'skill_names' => ['Python', 'AWS', 'PostgreSQL', 'MongoDB', 'Docker']],
            ['name' => 'Lucía', 'lastname' => 'Pérez', 'email' => 'lucia@devmail.com', 'headline' => 'Cloud Architect | AWS & Terraform', 'bio' => 'Arquitecta cloud con certificaciones en AWS y GCP. Especializada en diseño de infraestructura escalable y segura. He liderado migraciones cloud para empresas del sector financiero y telecomunicaciones.', 'hourly_rate' => 110, 'availability' => 'available', 'experience_years' => 10, 'languages' => ['Español', 'Inglés'], 'location' => 'Montevideo', 'country' => 'Uruguay', 'skill_names' => ['AWS', 'Terraform', 'Docker', 'Kubernetes', 'Python', 'Go']],
            ['name' => 'Daniel', 'lastname' => 'Morales', 'email' => 'daniel@devmail.com', 'headline' => 'Blockchain Developer | Solidity & Web3', 'bio' => 'Desarrollador blockchain con experiencia en smart contracts y aplicaciones descentralizadas. He trabajado en proyectos DeFi y NFT para empresas internacionales. También tengo experiencia en desarrollo web full stack.', 'hourly_rate' => 100, 'availability' => 'unavailable', 'experience_years' => 4, 'languages' => ['Español', 'Inglés'], 'location' => 'Bogotá', 'country' => 'Colombia', 'skill_names' => ['TypeScript', 'Node.js', 'React', 'MongoDB', 'GraphQL']],
            ['name' => 'Paula', 'lastname' => 'Sánchez', 'email' => 'paula@devmail.com', 'headline' => 'QA Automation Engineer', 'bio' => 'Ingeniera de QA con enfoque en automatización de pruebas end-to-end y de integración. Experiencia con Selenium, Cypress, y Jest. He implementado estrategias de testing que redujeron bugs en producción en un 80%.', 'hourly_rate' => 55, 'availability' => 'available', 'experience_years' => 5, 'languages' => ['Español', 'Inglés'], 'location' => 'Santiago', 'country' => 'Chile', 'skill_names' => ['Python', 'TypeScript', 'Docker', 'PostgreSQL', 'Node.js']],
            ['name' => 'Nicolás', 'lastname' => 'Flores', 'email' => 'nicolas@devmail.com', 'headline' => 'AI/ML Engineer | Python & TensorFlow', 'bio' => 'Ingeniero de Machine Learning con experiencia en modelos de NLP y visión por computadora. He desarrollado sistemas de recomendación y chatbots inteligentes. Publicaciones en conferencias internacionales de IA.', 'hourly_rate' => 105, 'availability' => 'busy', 'experience_years' => 7, 'languages' => ['Español', 'Inglés', 'Alemán'], 'location' => 'Buenos Aires', 'country' => 'Argentina', 'skill_names' => ['Python', 'AWS', 'PostgreSQL', 'Docker', 'MongoDB']],
            ['name' => 'María', 'lastname' => 'Vargas', 'email' => 'maria@devmail.com', 'headline' => 'Full Stack Developer | MERN Stack', 'bio' => 'Desarrolladora Full Stack con dominio del stack MERN. He construido desde MVPs para startups hasta plataformas enterprise. Experiencia en metodologías ágiles y liderazgo técnico de equipos.', 'hourly_rate' => 75, 'availability' => 'busy', 'experience_years' => 8, 'languages' => ['Español', 'Inglés'], 'location' => 'Ciudad de México', 'country' => 'México', 'skill_names' => ['React', 'Node.js', 'MongoDB', 'TypeScript', 'AWS', 'GraphQL']],
            ['name' => 'Alejandro', 'lastname' => 'Castro', 'email' => 'alejandro@devmail.com', 'headline' => 'Senior PHP Developer | Laravel Expert', 'bio' => 'Desarrollador PHP senior con más de 10 años de experiencia en Laravel. He construido CRMs, ERPs y plataformas de e-commerce de alta complejidad. Contribuidor activo de paquetes open source en Laravel.', 'hourly_rate' => 70, 'availability' => 'available', 'experience_years' => 11, 'languages' => ['Español', 'Inglés'], 'location' => 'Lima', 'country' => 'Perú', 'skill_names' => ['PHP', 'Laravel', 'MySQL', 'Vue.js', 'Docker', 'Redis']],
            ['name' => 'Sofía', 'lastname' => 'Mendoza', 'email' => 'sofia@devmail.com', 'headline' => 'React Native Developer | Mobile Expert', 'bio' => 'Desarrolladora mobile especializada en React Native con experiencia en apps de alta demanda. He trabajado en apps de delivery, fintech y redes sociales. Apasionada por las animaciones fluidas y el rendimiento.', 'hourly_rate' => 65, 'availability' => 'available', 'experience_years' => 4, 'languages' => ['Español', 'Inglés', 'Italiano'], 'location' => 'Bogotá', 'country' => 'Colombia', 'skill_names' => ['React Native', 'TypeScript', 'React', 'Node.js', 'Figma']],
            ['name' => 'Ricardo', 'lastname' => 'Navarro', 'email' => 'ricardo@devmail.com', 'headline' => 'Python Backend Developer | Django & FastAPI', 'bio' => 'Desarrollador backend Python con experiencia en Django, FastAPI y Flask. He diseñado APIs RESTful y GraphQL para plataformas con millones de usuarios. Interesado en arquitecturas serverless y microservicios.', 'hourly_rate' => 80, 'availability' => 'available', 'experience_years' => 8, 'languages' => ['Español', 'Inglés'], 'location' => 'Madrid', 'country' => 'España', 'skill_names' => ['Python', 'Django', 'PostgreSQL', 'Docker', 'Redis', 'AWS']],
        ];
        
        foreach ($developersData as $data) {
            $user = User::create([
                'name' => $data['name'],
                'lastname' => $data['lastname'],
                'email' => $data['email'],
                'password' => 'Demo1234!',
                'user_type' => 'programmer',
                'role' => 'programmer',
            ]);
            
            DB::table('users')->where('id', $user->id)->update(['email_verified_at' => Carbon::now()]);
            
            $profile = DeveloperProfile::create([
                'user_id' => $user->id,
                'headline' => $data['headline'],
                'skills' => json_encode($data['skill_names']),
                'bio' => $data['bio'],
                'links' => json_encode([]),
                'location' => $data['location'],
                'country' => $data['country'],
                'hourly_rate' => $data['hourly_rate'],
                'availability' => $data['availability'],
                'experience_years' => $data['experience_years'],
                'languages' => json_encode($data['languages']),
            ]);
            
            // Insertar en developer_skill pivot
            foreach ($data['skill_names'] as $skillName) {
                if (isset($skills[$skillName])) {
                    DB::table('developer_skill')->insert([
                        'developer_id' => $user->id,
                        'skill_id' => $skills[$skillName],
                        'proficiency' => rand(3, 5),
                        'created_at' => Carbon::now(),
                        'updated_at' => Carbon::now(),
                    ]);
                }
            }
            
            $developers[] = $user->id;
        }

        // === GENERACIÓN PROGRAMÁTICA: 85 desarrolladores adicionales ===
        $this->command->info('Generando 85 desarrolladores adicionales...');

        $firstNames = [
            'Miguel', 'Gabriel', 'Diego', 'Tomás', 'Emilio', 'Joaquín', 'Federico', 'Martín',
            'Lucas', 'Hugo', 'Óscar', 'Rafael', 'Simón', 'Adrián', 'Bruno', 'Iván',
            'Esteban', 'Rodrigo', 'Manuel', 'Gonzalo', 'Patricio', 'Álvaro', 'Javier', 'Enrique',
            'Carlos', 'Eduardo', 'Felipe', 'Francisco', 'Ignacio', 'Roberto', 'Ernesto', 'Humberto',
            'Elena', 'Claudia', 'Natalia', 'Fernanda', 'Daniela', 'Carolina', 'Mariana', 'Paola',
            'Lorena', 'Mónica', 'Patricia', 'Gabriela', 'Andrea', 'Diana', 'Silvia', 'Rosa',
            'Sara', 'Renata', 'Jimena', 'Catalina', 'Verónica', 'Alejandra', 'Teresa', 'Pilar',
            'Ximena', 'Julia', 'Alicia', 'Irene', 'Inés', 'Victoria', 'Carmen', 'Luciana',
        ];

        $lastNames = [
            'López', 'Martínez', 'González', 'Rodríguez', 'Hernández', 'Pérez', 'García', 'Sánchez',
            'Ramírez', 'Torres', 'Flores', 'Rivera', 'Gómez', 'Díaz', 'Cruz', 'Morales',
            'Ortiz', 'Gutiérrez', 'Chávez', 'Ramos', 'Vásquez', 'Castillo', 'Jiménez', 'Vargas',
            'Rojas', 'Herrera', 'Medina', 'Aguilar', 'Peña', 'Reyes', 'Salazar', 'Delgado',
            'Fuentes', 'Navarro', 'Montoya', 'Cardenas', 'Molina', 'Arias', 'Silva', 'Orozco',
        ];

        $locations = [
            ['location' => 'Bogotá', 'country' => 'Colombia'],
            ['location' => 'Medellín', 'country' => 'Colombia'],
            ['location' => 'Cali', 'country' => 'Colombia'],
            ['location' => 'Ciudad de México', 'country' => 'México'],
            ['location' => 'Guadalajara', 'country' => 'México'],
            ['location' => 'Monterrey', 'country' => 'México'],
            ['location' => 'Buenos Aires', 'country' => 'Argentina'],
            ['location' => 'Córdoba', 'country' => 'Argentina'],
            ['location' => 'Santiago', 'country' => 'Chile'],
            ['location' => 'Valparaíso', 'country' => 'Chile'],
            ['location' => 'Lima', 'country' => 'Perú'],
            ['location' => 'Arequipa', 'country' => 'Perú'],
            ['location' => 'Madrid', 'country' => 'España'],
            ['location' => 'Barcelona', 'country' => 'España'],
            ['location' => 'Montevideo', 'country' => 'Uruguay'],
            ['location' => 'Quito', 'country' => 'Ecuador'],
            ['location' => 'San José', 'country' => 'Costa Rica'],
            ['location' => 'Panamá', 'country' => 'Panamá'],
            ['location' => 'Santo Domingo', 'country' => 'República Dominicana'],
            ['location' => 'Asunción', 'country' => 'Paraguay'],
        ];

        $skillNames = array_keys($skills);

        $headlineTemplates = [
            'Full Stack Developer | %s + %s',
            'Senior %s Developer',
            '%s Engineer | Cloud & DevOps',
            'Frontend Specialist | %s & %s',
            'Backend Developer | %s + %s',
            'Mobile Developer | %s & %s',
            '%s Architect | Enterprise Solutions',
            'Software Engineer | %s Stack',
            '%s Developer | Agile & Scrum',
            'Tech Lead | %s + %s',
        ];

        $bioTemplates = [
            'Desarrollador con %d años de experiencia especializado en %s. He trabajado en proyectos de alta escalabilidad para empresas de tecnología en Latinoamérica. Apasionado por las arquitecturas limpias y el código de calidad.',
            'Ingeniero de software con %d años creando soluciones con %s. Experiencia en startups y empresas consolidadas. Enfoque en desarrollo ágil y entrega continua de valor al cliente.',
            'Profesional con %d años en desarrollo de software, experto en %s. He liderado equipos técnicos y entregado más de 30 proyectos exitosos. Contribuidor activo en comunidades open source.',
            'Desarrollador experimentado con %d años usando %s. Especializado en aplicaciones web y móviles de alto rendimiento. Certificaciones en tecnologías cloud y metodologías ágiles.',
            'Con %d años de experiencia en %s, me especializo en crear soluciones escalables y mantenibles. He colaborado con equipos distribuidos internacionalmente y domino las mejores prácticas de la industria.',
            'Ingeniero con %d años de trayectoria en %s. Experiencia en fintech, healthtech y edtech. Apasionado por la innovación tecnológica y el impacto social a través del software.',
        ];

        $languageOptions = [
            ['Español', 'Inglés'],
            ['Español', 'Inglés', 'Portugués'],
            ['Español', 'Inglés', 'Francés'],
            ['Español', 'Inglés', 'Alemán'],
            ['Español'],
            ['Español', 'Inglés', 'Italiano'],
        ];

        $availabilities = ['available', 'available', 'available', 'available', 'busy', 'busy', 'unavailable'];

        $usedEmails = [];

        for ($i = 0; $i < 85; $i++) {
            $firstName = $firstNames[array_rand($firstNames)];
            $lastName = $lastNames[array_rand($lastNames)];

            // Generate unique email
            $baseEmail = strtolower(str_replace(['á','é','í','ó','ú','ñ','ü'], ['a','e','i','o','u','n','u'], $firstName)) . '.' . strtolower(str_replace(['á','é','í','ó','ú','ñ','ü'], ['a','e','i','o','u','n','u'], $lastName));
            $email = $baseEmail . ($i + 1) . '@devmail.com';

            $loc = $locations[array_rand($locations)];
            $expYears = rand(1, 15);
            $hourlyRate = rand(30, 150);
            $availability = $availabilities[array_rand($availabilities)];

            // Pick 3-6 random skills
            $numSkills = rand(3, 6);
            $shuffledSkills = $skillNames;
            shuffle($shuffledSkills);
            $devSkills = array_slice($shuffledSkills, 0, $numSkills);

            // Generate headline
            $headlineTemplate = $headlineTemplates[array_rand($headlineTemplates)];
            $headline = sprintf($headlineTemplate, $devSkills[0], $devSkills[1] ?? $devSkills[0]);

            // Generate bio
            $bioTemplate = $bioTemplates[array_rand($bioTemplates)];
            $bio = sprintf($bioTemplate, $expYears, implode(', ', array_slice($devSkills, 0, 3)));

            $langs = $languageOptions[array_rand($languageOptions)];

            $user = User::create([
                'name' => $firstName,
                'lastname' => $lastName,
                'email' => $email,
                'password' => 'Demo1234!',
                'user_type' => 'programmer',
                'role' => 'programmer',
            ]);

            DB::table('users')->where('id', $user->id)->update(['email_verified_at' => Carbon::now()]);

            DeveloperProfile::create([
                'user_id' => $user->id,
                'headline' => $headline,
                'skills' => json_encode($devSkills),
                'bio' => $bio,
                'links' => json_encode([]),
                'location' => $loc['location'],
                'country' => $loc['country'],
                'hourly_rate' => $hourlyRate,
                'availability' => $availability,
                'experience_years' => $expYears,
                'languages' => json_encode($langs),
            ]);

            foreach ($devSkills as $skillName) {
                if (isset($skills[$skillName])) {
                    DB::table('developer_skill')->insert([
                        'developer_id' => $user->id,
                        'skill_id' => $skills[$skillName],
                        'proficiency' => rand(2, 5),
                        'created_at' => Carbon::now(),
                        'updated_at' => Carbon::now(),
                    ]);
                }
            }

            $developers[] = $user->id;
        }

        $this->command->info('Total developers created: ' . count($developers));
        
        return $developers;
    }

    private function createWallets(array $admins, array $companies, array $developers): void
    {
        $this->command->info('Creando wallets...');
        
        // Wallets para admins
        foreach ($admins as $adminId) {
            Wallet::create([
                'user_id' => $adminId,
                'balance' => 0.00,
                'held_balance' => 0.00,
            ]);
        }
        
        // Wallets para companies
        foreach ($companies as $index => $companyId) {
            $balance = rand(2000, 15000);
            $heldBalance = in_array($index, [0, 1, 2, 3, 4]) ? rand(1000, 5000) : 0.00;
            
            Wallet::create([
                'user_id' => $companyId,
                'balance' => $balance,
                'held_balance' => $heldBalance,
            ]);
        }
        
        // Wallets para developers
        foreach ($developers as $index => $developerId) {
            $balance = in_array($index, [0, 1, 10, 12, 14]) ? rand(2000, 5000) : rand(0, 1500);
            
            Wallet::create([
                'user_id' => $developerId,
                'balance' => $balance,
                'held_balance' => 0.00,
            ]);
        }
    }

    private function createPaymentMethods(array $companies, array $developers): void
    {
        $this->command->info('Creando métodos de pago...');
        
        $banks = ['Banco Santander', 'Banco BBVA', 'Banco HSBC', 'Banco Citibank', 'Banco Scotiabank'];
        $brands = ['Visa', 'Mastercard', 'American Express'];
        
        // Payment methods para companies
        foreach ($companies as $companyId) {
            // Bank account
            PaymentMethod::create([
                'user_id' => $companyId,
                'type' => 'bank_account',
                'details' => json_encode([
                    'bank' => $banks[array_rand($banks)],
                    'last_four' => str_pad(rand(1000, 9999), 4, '0', STR_PAD_LEFT),
                    'holder' => 'Empresa S.A.S.'
                ]),
                'is_default' => true,
            ]);
            
            // A veces agregar tarjeta
            if (rand(0, 1)) {
                PaymentMethod::create([
                    'user_id' => $companyId,
                    'type' => 'credit_card',
                    'details' => json_encode([
                        'brand' => $brands[array_rand($brands)],
                        'last_four' => str_pad(rand(1000, 9999), 4, '0', STR_PAD_LEFT),
                        'exp' => rand(1, 12) . '/' . rand(26, 30)
                    ]),
                    'is_default' => false,
                ]);
            }
        }
        
        // Payment methods para developers
        foreach ($developers as $developerId) {
            PaymentMethod::create([
                'user_id' => $developerId,
                'type' => 'paypal',
                'details' => json_encode(['email' => 'dev' . $developerId . '@paypal.com']),
                'is_default' => true,
            ]);
            
            if (rand(0, 1)) {
                PaymentMethod::create([
                    'user_id' => $developerId,
                    'type' => 'bank_account',
                    'details' => json_encode([
                        'bank' => $banks[array_rand($banks)],
                        'last_four' => str_pad(rand(1000, 9999), 4, '0', STR_PAD_LEFT),
                        'holder' => 'Desarrollador'
                    ]),
                    'is_default' => false,
                ]);
            }
        }
    }

    private function createProjects(array $companies, array $categories, array $skills, array $developers): array
    {
        $this->command->info('Creando proyectos...');
        
        $projects = [];
        
        // Proyectos Open (P1-P5)
        $openProjects = [
            [
                'company_id' => $companies[0], // TechNova
                'title' => 'Desarrollo de Plataforma E-commerce con React',
                'description' => 'Necesitamos desarrollar una plataforma de e-commerce completa con React en el frontend y Node.js en el backend. La plataforma debe incluir catálogo de productos, carrito de compras, pasarela de pagos, panel de administración y sistema de inventario.',
                'budget_min' => 8000, 'budget_max' => 12000, 'budget_type' => 'fixed',
                'duration_value' => 3, 'duration_unit' => 'months',
                'level' => 'senior', 'priority' => 'high', 'remote' => true,
                'tags' => json_encode(['e-commerce', 'react', 'node.js']),
                'status' => 'open',
                'category_names' => ['Desarrollo Web', 'E-commerce'],
                'skill_names' => ['React', 'Node.js', 'TypeScript', 'PostgreSQL'],
            ],
            [
                'company_id' => $companies[1], // ByteForge
                'title' => 'API REST para App de Delivery',
                'description' => 'Desarrollar una API REST robusta para una aplicación de delivery de comida. Debe incluir autenticación, geolocalización, gestión de pedidos, notificaciones push y integración con múltiples restaurantes.',
                'budget_min' => 5000, 'budget_max' => 8000, 'budget_type' => 'fixed',
                'duration_value' => 6, 'duration_unit' => 'weeks',
                'level' => 'mid', 'priority' => 'medium', 'remote' => true,
                'tags' => json_encode(['api', 'delivery', 'backend']),
                'status' => 'open',
                'category_names' => ['Backend/APIs'],
                'skill_names' => ['Node.js', 'PostgreSQL', 'Docker', 'Redis'],
            ],
            [
                'company_id' => $companies[2], // CloudPeak
                'title' => 'Diseño UI/UX para App de Fitness',
                'description' => 'Diseño completo de interfaz de usuario y experiencia para una aplicación móvil de fitness. Incluye diseño de pantallas, sistema de diseño, prototipos interactivos y especificación para desarrollo.',
                'budget_min' => 3000, 'budget_max' => 5000, 'budget_type' => 'fixed',
                'duration_value' => 4, 'duration_unit' => 'weeks',
                'level' => 'mid', 'priority' => 'medium', 'remote' => true,
                'tags' => json_encode(['ui/ux', 'mobile', 'fitness']),
                'status' => 'open',
                'category_names' => ['UI/UX Design', 'Desarrollo Mobile'],
                'skill_names' => ['Figma', 'React Native', 'TailwindCSS'],
            ],
            [
                'company_id' => $companies[4], // InnoCode
                'title' => 'Sistema de Gestión Empresarial ERP',
                'description' => 'Desarrollo de un sistema ERP completo para gestión empresarial. Módulos de contabilidad, inventario, RRHH, clientes y proyectos. Debe ser escalable y modular.',
                'budget_min' => 15000, 'budget_max' => 25000, 'budget_type' => 'fixed',
                'duration_value' => 4, 'duration_unit' => 'months',
                'level' => 'senior', 'priority' => 'high', 'remote' => true, 'featured' => true,
                'tags' => json_encode(['erp', 'enterprise', 'laravel']),
                'status' => 'open',
                'category_names' => ['Desarrollo Web', 'Backend/APIs'],
                'skill_names' => ['Laravel', 'Vue.js', 'MySQL', 'Docker'],
            ],
            [
                'company_id' => $companies[6], // AppVenture
                'title' => 'Chatbot con IA para Soporte al Cliente',
                'description' => 'Desarrollo de un chatbot inteligente con procesamiento de lenguaje natural para atención al cliente. Debe integrarse con sistemas existentes y manejar consultas frecuentes.',
                'budget_min' => 6000, 'budget_max' => 10000, 'budget_type' => 'fixed',
                'duration_value' => 2, 'duration_unit' => 'months',
                'level' => 'senior', 'priority' => 'medium', 'remote' => true,
                'tags' => json_encode(['chatbot', 'ia', 'nlp']),
                'status' => 'open',
                'category_names' => ['AI/ML'],
                'skill_names' => ['Python', 'Node.js', 'TypeScript', 'MongoDB'],
            ],
        ];
        
        foreach ($openProjects as $i => $projectData) {
            $project = Project::create([
                'company_id' => $projectData['company_id'],
                'title' => $projectData['title'],
                'description' => $projectData['description'],
                'budget_min' => $projectData['budget_min'],
                'budget_max' => $projectData['budget_max'],
                'budget_type' => $projectData['budget_type'],
                'duration_value' => $projectData['duration_value'],
                'duration_unit' => $projectData['duration_unit'],
                'location' => null,
                'remote' => $projectData['remote'],
                'level' => $projectData['level'],
                'priority' => $projectData['priority'],
                'featured' => $projectData['featured'] ?? false,
                'deadline' => Carbon::now()->addMonths(rand(1, 3)),
                'max_applicants' => rand(10, 30),
                'tags' => $projectData['tags'],
                'status' => $projectData['status'],
            ]);
            
            $projects[$i + 1] = ['id' => $project->id, 'status' => 'open'];
            
            // Category relations
            foreach ($projectData['category_names'] as $catName) {
                if (isset($categories[$catName])) {
                    DB::table('project_category_project')->insert([
                        'project_id' => $project->id,
                        'project_category_id' => $categories[$catName],
                        'created_at' => Carbon::now(),
                        'updated_at' => Carbon::now(),
                    ]);
                }
            }
            
            // Skill relations
            foreach ($projectData['skill_names'] as $skillName) {
                if (isset($skills[$skillName])) {
                    DB::table('project_skill')->insert([
                        'project_id' => $project->id,
                        'skill_id' => $skills[$skillName],
                        'created_at' => Carbon::now(),
                        'updated_at' => Carbon::now(),
                    ]);
                }
            }
        }
        
        // Proyectos In Progress (P6-P10)
        $inProgressProjects = [
            [
                'company_id' => $companies[0], // TechNova
                'developer_id' => 22, // Santiago (third developer)
                'title' => 'Implementación de Microservicios con Docker',
                'description' => 'Migración de arquitectura monolítica a microservicios usando Docker y Kubernetes. Diseño de APIs, message queues y service mesh.',
                'budget_min' => 10000, 'budget_max' => 15000, 'budget_type' => 'fixed',
                'duration_value' => 3, 'duration_unit' => 'months',
                'level' => 'senior', 'priority' => 'high', 'remote' => true,
                'tags' => json_encode(['microservicios', 'docker', 'kubernetes']),
                'status' => 'in_progress',
                'category_names' => ['DevOps', 'Backend/APIs'],
                'skill_names' => ['Docker', 'Kubernetes', 'Node.js', 'AWS'],
            ],
            [
                'company_id' => $companies[1], // ByteForge
                'developer_id' => 27, // María (12th developer)
                'title' => 'Dashboard de Analytics en Tiempo Real',
                'description' => 'Desarrollo de dashboard interactivo con visualizaciones en tiempo real usando WebSockets, MongoDB y GraphQL.',
                'budget_min' => 7000, 'budget_max' => 11000, 'budget_type' => 'fixed',
                'duration_value' => 2, 'duration_unit' => 'months',
                'level' => 'senior', 'priority' => 'high', 'remote' => true,
                'tags' => json_encode(['dashboard', 'analytics', 'react']),
                'status' => 'in_progress',
                'category_names' => ['Desarrollo Web', 'Data Science'],
                'skill_names' => ['React', 'Node.js', 'MongoDB', 'GraphQL'],
            ],
            [
                'company_id' => $companies[3], // DataStream
                'developer_id' => 21, // Isabella (6th developer)
                'title' => 'Rediseño UI/UX para App Bancaria',
                'description' => 'Rediseño completo de aplicación bancaria mobile, enfocándose en experiencia de usuario y accesibilidad.',
                'budget_min' => 5000, 'budget_max' => 8000, 'budget_type' => 'fixed',
                'duration_value' => 6, 'duration_unit' => 'weeks',
                'level' => 'mid', 'priority' => 'medium', 'remote' => true,
                'tags' => json_encode(['ui/ux', 'fintech', 'redesign']),
                'status' => 'in_progress',
                'category_names' => ['UI/UX Design'],
                'skill_names' => ['Figma', 'React', 'TailwindCSS'],
            ],
            [
                'company_id' => $companies[2], // CloudPeak
                'developer_id' => 19, // Camila (4th developer)
                'title' => 'Pipeline CI/CD con Kubernetes',
                'description' => 'Implementación de pipeline de CI/CD completo con Kubernetes, incluyendo testing automatizado y despliegues.',
                'budget_min' => 8000, 'budget_max' => 12000, 'budget_type' => 'fixed',
                'duration_value' => 2, 'duration_unit' => 'months',
                'level' => 'senior', 'priority' => 'high', 'remote' => true,
                'tags' => json_encode(['ci/cd', 'kubernetes', 'devops']),
                'status' => 'in_progress',
                'category_names' => ['DevOps', 'Cloud Computing'],
                'skill_names' => ['Kubernetes', 'Docker', 'AWS', 'Terraform'],
            ],
            [
                'company_id' => $companies[7], // CodeCraft
                'developer_id' => 28, // Alejandro (13th developer)
                'title' => 'API de Pagos Multi-gateway',
                'description' => 'Desarrollo de API unificada para múltiples pasarelas de pago (Stripe, PayPal, MercadoPago).',
                'budget_min' => 6000, 'budget_max' => 9000, 'budget_type' => 'fixed',
                'duration_value' => 8, 'duration_unit' => 'weeks',
                'level' => 'senior', 'priority' => 'urgent', 'remote' => true,
                'tags' => json_encode(['pagos', 'api', 'stripe']),
                'status' => 'in_progress',
                'category_names' => ['Backend/APIs', 'E-commerce'],
                'skill_names' => ['PHP', 'Laravel', 'MySQL', 'Redis'],
            ],
        ];
        
        foreach ($inProgressProjects as $i => $projectData) {
            $project = Project::create([
                'company_id' => $projectData['company_id'],
                'title' => $projectData['title'],
                'description' => $projectData['description'],
                'budget_min' => $projectData['budget_min'],
                'budget_max' => $projectData['budget_max'],
                'budget_type' => $projectData['budget_type'],
                'duration_value' => $projectData['duration_value'],
                'duration_unit' => $projectData['duration_unit'],
                'location' => null,
                'remote' => $projectData['remote'],
                'level' => $projectData['level'],
                'priority' => $projectData['priority'],
                'featured' => false,
                'deadline' => Carbon::now()->addWeeks(rand(2, 6)),
                'max_applicants' => rand(10, 20),
                'tags' => $projectData['tags'],
                'status' => $projectData['status'],
            ]);
            
            $projects[6 + $i] = ['id' => $project->id, 'status' => 'in_progress', 'developer_id' => $projectData['developer_id']];
            
            foreach ($projectData['category_names'] as $catName) {
                if (isset($categories[$catName])) {
                    DB::table('project_category_project')->insert([
                        'project_id' => $project->id,
                        'project_category_id' => $categories[$catName],
                        'created_at' => Carbon::now(),
                        'updated_at' => Carbon::now(),
                    ]);
                }
            }
            
            foreach ($projectData['skill_names'] as $skillName) {
                if (isset($skills[$skillName])) {
                    DB::table('project_skill')->insert([
                        'project_id' => $project->id,
                        'skill_id' => $skills[$skillName],
                        'created_at' => Carbon::now(),
                        'updated_at' => Carbon::now(),
                    ]);
                }
            }
        }
        
        // Proyectos Completed (P11-P14)
        $completedProjects = [
            [
                'company_id' => $companies[0], // TechNova
                'developer_id' => 17, // Valentina
                'title' => 'Tienda Online con WooCommerce Personalizado',
                'description' => 'Desarrollo de tienda online con WooCommerce customization y plugins a medida.',
                'budget_min' => 4000, 'budget_max' => 6000, 'budget_type' => 'fixed',
                'duration_value' => 2, 'duration_unit' => 'months',
                'level' => 'mid', 'priority' => 'medium', 'remote' => true,
                'tags' => json_encode(['woocommerce', 'ecommerce', 'wordpress']),
                'status' => 'completed',
                'category_names' => ['E-commerce', 'Desarrollo Web'],
                'skill_names' => ['React', 'TypeScript', 'TailwindCSS', 'PHP'],
            ],
            [
                'company_id' => $companies[1], // ByteForge
                'developer_id' => 16, // Andrés
                'title' => 'Sistema de Autenticación OAuth2',
                'description' => 'Implementación de sistema de autenticación seguro con OAuth2, JWT y 2FA.',
                'budget_min' => 3000, 'budget_max' => 5000, 'budget_type' => 'fixed',
                'duration_value' => 6, 'duration_unit' => 'weeks',
                'level' => 'mid', 'priority' => 'medium', 'remote' => true,
                'tags' => json_encode(['auth', 'oauth', 'security']),
                'status' => 'completed',
                'category_names' => ['Backend/APIs', 'Ciberseguridad'],
                'skill_names' => ['Laravel', 'PHP', 'MySQL', 'TypeScript'],
            ],
            [
                'company_id' => $companies[4], // InnoCode
                'developer_id' => 29, // Sofía
                'title' => 'App Móvil de Fitness React Native',
                'description' => 'Desarrollo de app de fitness completa con tracking de ejercicios y alimentación.',
                'budget_min' => 7000, 'budget_max' => 10000, 'budget_type' => 'fixed',
                'duration_value' => 3, 'duration_unit' => 'months',
                'level' => 'mid', 'priority' => 'medium', 'remote' => true,
                'tags' => json_encode(['mobile', 'fitness', 'react-native']),
                'status' => 'completed',
                'category_names' => ['Desarrollo Mobile'],
                'skill_names' => ['React Native', 'TypeScript', 'Node.js', 'Figma'],
            ],
            [
                'company_id' => $companies[3], // DataStream
                'developer_id' => 23, // Lucía
                'title' => 'Infraestructura Cloud AWS',
                'description' => 'Diseño e implementación de infraestructura completa en AWS con Terraform.',
                'budget_min' => 9000, 'budget_max' => 14000, 'budget_type' => 'fixed',
                'duration_value' => 2, 'duration_unit' => 'months',
                'level' => 'senior', 'priority' => 'high', 'remote' => true,
                'tags' => json_encode(['aws', 'cloud', 'terraform']),
                'status' => 'completed',
                'category_names' => ['Cloud Computing', 'DevOps'],
                'skill_names' => ['AWS', 'Terraform', 'Docker', 'Kubernetes', 'Python'],
            ],
        ];
        
        foreach ($completedProjects as $i => $projectData) {
            $project = Project::create([
                'company_id' => $projectData['company_id'],
                'title' => $projectData['title'],
                'description' => $projectData['description'],
                'budget_min' => $projectData['budget_min'],
                'budget_max' => $projectData['budget_max'],
                'budget_type' => $projectData['budget_type'],
                'duration_value' => $projectData['duration_value'],
                'duration_unit' => $projectData['duration_unit'],
                'location' => null,
                'remote' => $projectData['remote'],
                'level' => $projectData['level'],
                'priority' => $projectData['priority'],
                'featured' => false,
                'deadline' => Carbon::now()->subWeeks(rand(1, 4)),
                'max_applicants' => rand(10, 20),
                'tags' => $projectData['tags'],
                'status' => $projectData['status'],
            ]);
            
            $projects[11 + $i] = ['id' => $project->id, 'status' => 'completed', 'developer_id' => $projectData['developer_id']];
            
            foreach ($projectData['category_names'] as $catName) {
                if (isset($categories[$catName])) {
                    DB::table('project_category_project')->insert([
                        'project_id' => $project->id,
                        'project_category_id' => $categories[$catName],
                        'created_at' => Carbon::now(),
                        'updated_at' => Carbon::now(),
                    ]);
                }
            }
            
            foreach ($projectData['skill_names'] as $skillName) {
                if (isset($skills[$skillName])) {
                    DB::table('project_skill')->insert([
                        'project_id' => $project->id,
                        'skill_id' => $skills[$skillName],
                        'created_at' => Carbon::now(),
                        'updated_at' => Carbon::now(),
                    ]);
                }
            }
        }
        
        // Proyectos Cancelled (P15-P16)
        $cancelledProjects = [
            [
                'company_id' => $companies[5], // NexGen
                'title' => 'Desarrollo de Wallet Crypto',
                'description' => 'Desarrollo de wallet de criptomonedas con integración a múltiples blockchains.',
                'budget_min' => 12000, 'budget_max' => 20000, 'budget_type' => 'fixed',
                'duration_value' => 4, 'duration_unit' => 'months',
                'level' => 'senior', 'priority' => 'high', 'remote' => true,
                'tags' => json_encode(['crypto', 'wallet', 'blockchain']),
                'status' => 'cancelled',
                'category_names' => ['Blockchain'],
                'skill_names' => ['TypeScript', 'React', 'Node.js'],
            ],
            [
                'company_id' => $companies[7], // CodeCraft
                'title' => 'Plataforma de Streaming de Video',
                'description' => 'Plataforma de streaming de video en tiempo real con capacidad de millones de usuarios.',
                'budget_min' => 20000, 'budget_max' => 35000, 'budget_type' => 'fixed',
                'duration_value' => 6, 'duration_unit' => 'months',
                'level' => 'lead', 'priority' => 'medium', 'remote' => true,
                'tags' => json_encode(['streaming', 'video', 'aws']),
                'status' => 'cancelled',
                'category_names' => ['Desarrollo Web', 'Cloud Computing'],
                'skill_names' => ['React', 'Node.js', 'AWS', 'Docker'],
            ],
        ];
        
        foreach ($cancelledProjects as $i => $projectData) {
            $project = Project::create([
                'company_id' => $projectData['company_id'],
                'title' => $projectData['title'],
                'description' => $projectData['description'],
                'budget_min' => $projectData['budget_min'],
                'budget_max' => $projectData['budget_max'],
                'budget_type' => $projectData['budget_type'],
                'duration_value' => $projectData['duration_value'],
                'duration_unit' => $projectData['duration_unit'],
                'location' => null,
                'remote' => $projectData['remote'],
                'level' => $projectData['level'],
                'priority' => $projectData['priority'],
                'featured' => false,
                'deadline' => null,
                'max_applicants' => rand(15, 30),
                'tags' => $projectData['tags'],
                'status' => $projectData['status'],
            ]);
            
            $projects[15 + $i] = ['id' => $project->id, 'status' => 'cancelled'];
            
            foreach ($projectData['category_names'] as $catName) {
                if (isset($categories[$catName])) {
                    DB::table('project_category_project')->insert([
                        'project_id' => $project->id,
                        'project_category_id' => $categories[$catName],
                        'created_at' => Carbon::now(),
                        'updated_at' => Carbon::now(),
                    ]);
                }
            }
            
            foreach ($projectData['skill_names'] as $skillName) {
                if (isset($skills[$skillName])) {
                    DB::table('project_skill')->insert([
                        'project_id' => $project->id,
                        'skill_id' => $skills[$skillName],
                        'created_at' => Carbon::now(),
                        'updated_at' => Carbon::now(),
                    ]);
                }
            }
        }
        
        // Proyectos Draft (P17-P18)
        $draftProjects = [
            [
                'company_id' => $companies[5], // NexGen
                'title' => 'Sistema de Recomendaciones con ML',
                'description' => 'Sistema de recomendaciones personalizado usando machine learning.',
                'budget_min' => 8000, 'budget_max' => 15000, 'budget_type' => 'fixed',
                'duration_value' => 3, 'duration_unit' => 'months',
                'level' => 'senior', 'priority' => 'medium', 'remote' => true,
                'tags' => json_encode(['ml', 'recommendations', 'ai']),
                'status' => 'draft',
                'category_names' => ['AI/ML', 'Data Science'],
                'skill_names' => ['Python', 'AWS', 'MongoDB'],
            ],
            [
                'company_id' => $companies[6], // AppVenture
                'title' => 'Portal de Gestión de RRHH',
                'description' => 'Portal completo de gestión de recursos humanos con nóminas y evaluaciones.',
                'budget_min' => 10000, 'budget_max' => 18000, 'budget_type' => 'fixed',
                'duration_value' => 4, 'duration_unit' => 'months',
                'level' => 'senior', 'priority' => 'low', 'remote' => false,
                'location' => 'Medellín, Colombia',
                'tags' => json_encode(['rrhh', 'portal', 'laravel']),
                'status' => 'draft',
                'category_names' => ['Desarrollo Web', 'Backend/APIs'],
                'skill_names' => ['Laravel', 'Vue.js', 'MySQL', 'Docker'],
            ],
        ];
        
        foreach ($draftProjects as $i => $projectData) {
            $project = Project::create([
                'company_id' => $projectData['company_id'],
                'title' => $projectData['title'],
                'description' => $projectData['description'],
                'budget_min' => $projectData['budget_min'],
                'budget_max' => $projectData['budget_max'],
                'budget_type' => $projectData['budget_type'],
                'duration_value' => $projectData['duration_value'],
                'duration_unit' => $projectData['duration_unit'],
                'location' => $projectData['location'] ?? null,
                'remote' => $projectData['remote'],
                'level' => $projectData['level'],
                'priority' => $projectData['priority'],
                'featured' => false,
                'deadline' => null,
                'max_applicants' => rand(10, 25),
                'tags' => $projectData['tags'],
                'status' => $projectData['status'],
            ]);
            
            $projects[17 + $i] = ['id' => $project->id, 'status' => 'draft'];
            
            foreach ($projectData['category_names'] as $catName) {
                if (isset($categories[$catName])) {
                    DB::table('project_category_project')->insert([
                        'project_id' => $project->id,
                        'project_category_id' => $categories[$catName],
                        'created_at' => Carbon::now(),
                        'updated_at' => Carbon::now(),
                    ]);
                }
            }
            
            foreach ($projectData['skill_names'] as $skillName) {
                if (isset($skills[$skillName])) {
                    DB::table('project_skill')->insert([
                        'project_id' => $project->id,
                        'skill_id' => $skills[$skillName],
                        'created_at' => Carbon::now(),
                        'updated_at' => Carbon::now(),
                    ]);
                }
            }
        }
        
        // Proyectos Pending Payment (P19-P20)
        $pendingPaymentProjects = [
            [
                'company_id' => $companies[4], // InnoCode
                'developer_id' => 30, // Ricardo
                'title' => 'Migración de Base de Datos a PostgreSQL',
                'description' => 'Migración completa de MySQL a PostgreSQL con optimización de queries.',
                'budget_min' => 4000, 'budget_max' => 6000, 'budget_type' => 'fixed',
                'duration_value' => 4, 'duration_unit' => 'weeks',
                'level' => 'senior', 'priority' => 'urgent', 'remote' => true,
                'tags' => json_encode(['migration', 'postgresql', 'database']),
                'status' => 'pending_payment',
                'category_names' => ['Backend/APIs', 'DevOps'],
                'skill_names' => ['PostgreSQL', 'Python', 'Docker', 'AWS'],
            ],
            [
                'company_id' => $companies[5], // NexGen
                'developer_id' => 18, // Sebastián
                'title' => 'Dashboard de Business Intelligence',
                'description' => 'Dashboard de BI con visualizaciones interactivas y reportes automáticos.',
                'budget_min' => 8000, 'budget_max' => 13000, 'budget_type' => 'fixed',
                'duration_value' => 2, 'duration_unit' => 'months',
                'level' => 'senior', 'priority' => 'high', 'remote' => true,
                'tags' => json_encode(['bi', 'dashboard', 'analytics']),
                'status' => 'pending_payment',
                'category_names' => ['Data Science', 'Desarrollo Web'],
                'skill_names' => ['React', 'Python', 'PostgreSQL', 'AWS'],
            ],
        ];
        
        foreach ($pendingPaymentProjects as $i => $projectData) {
            $project = Project::create([
                'company_id' => $projectData['company_id'],
                'title' => $projectData['title'],
                'description' => $projectData['description'],
                'budget_min' => $projectData['budget_min'],
                'budget_max' => $projectData['budget_max'],
                'budget_type' => $projectData['budget_type'],
                'duration_value' => $projectData['duration_value'],
                'duration_unit' => $projectData['duration_unit'],
                'location' => null,
                'remote' => $projectData['remote'],
                'level' => $projectData['level'],
                'priority' => $projectData['priority'],
                'featured' => false,
                'deadline' => Carbon::now()->subWeeks(1),
                'max_applicants' => rand(10, 20),
                'tags' => $projectData['tags'],
                'status' => $projectData['status'],
            ]);
            
            $projects[19 + $i] = ['id' => $project->id, 'status' => 'pending_payment', 'developer_id' => $projectData['developer_id']];
            
            foreach ($projectData['category_names'] as $catName) {
                if (isset($categories[$catName])) {
                    DB::table('project_category_project')->insert([
                        'project_id' => $project->id,
                        'project_category_id' => $categories[$catName],
                        'created_at' => Carbon::now(),
                        'updated_at' => Carbon::now(),
                    ]);
                }
            }
            
            foreach ($projectData['skill_names'] as $skillName) {
                if (isset($skills[$skillName])) {
                    DB::table('project_skill')->insert([
                        'project_id' => $project->id,
                        'skill_id' => $skills[$skillName],
                        'created_at' => Carbon::now(),
                        'updated_at' => Carbon::now(),
                    ]);
                }
            }
        }

        // === GENERACIÓN PROGRAMÁTICA: 15 proyectos adicionales ===
        $this->command->info('Generando 15 proyectos adicionales...');

        $projectTitles = [
            'Plataforma de Gestión de Inventarios',
            'App de Reservas de Restaurantes',
            'Sistema de Tracking GPS para Flotas',
            'Portal de Telemedicina',
            'Marketplace de Servicios Freelance',
            'Sistema de Gestión de Documentos',
            'App de Educación Interactiva',
            'Plataforma de Crowdfunding',
            'Sistema CRM Personalizado',
            'App de Delivery con IA',
            'Plataforma de Gestión de Eventos',
            'Sistema de Facturación Electrónica',
            'Red Social para Profesionales',
            'Plataforma de Video Conferencias',
            'Sistema de Control de Acceso IoT',
        ];

        $projectDescriptions = [
            'Desarrollo completo de la plataforma con frontend responsive, backend escalable y panel de administración. Incluye integración con servicios de terceros y documentación técnica.',
            'Proyecto full stack que requiere diseño UI/UX moderno, API REST robusta, sistema de notificaciones en tiempo real y panel de métricas avanzado.',
            'Aplicación empresarial con autenticación multi-factor, reportes personalizados, exportación de datos y soporte multi-idioma.',
            'Solución tecnológica integral con arquitectura de microservicios, base de datos distribuida y sistema de caché para alto rendimiento.',
            'Desarrollo de plataforma digital con funcionalidades avanzadas de búsqueda, filtrado, pagos integrados y sistema de recomendaciones.',
        ];

        $statuses = ['open', 'open', 'open', 'in_progress', 'in_progress', 'in_progress', 'completed', 'completed', 'draft', 'pending_payment'];
        $levels = ['entry', 'mid', 'senior', 'lead'];
        $priorities = ['low', 'medium', 'high', 'urgent'];
        $categoryNames = array_keys($categories);
        $skillNameKeys = array_keys($skills);

        $projectIndex = 21; // Continue after existing projects
        for ($p = 0; $p < 15; $p++) {
            $status = $statuses[array_rand($statuses)];
            $companyId = $companies[array_rand($companies)];
            $budgetMin = rand(2, 20) * 1000;
            $budgetMax = $budgetMin + rand(2, 10) * 1000;
            $durationValue = rand(1, 6);
            $durationUnit = rand(0, 1) ? 'weeks' : 'months';

            // Pick random categories and skills
            shuffle($categoryNames);
            shuffle($skillNameKeys);
            $projCats = array_slice($categoryNames, 0, rand(1, 3));
            $projSkills = array_slice($skillNameKeys, 0, rand(3, 6));

            $tags = array_map(fn($s) => strtolower($s), array_slice($projSkills, 0, 3));

            $project = Project::create([
                'company_id' => $companyId,
                'title' => $projectTitles[$p],
                'description' => $projectDescriptions[array_rand($projectDescriptions)],
                'budget_min' => $budgetMin,
                'budget_max' => $budgetMax,
                'budget_type' => rand(0, 1) ? 'fixed' : 'hourly',
                'duration_value' => $durationValue,
                'duration_unit' => $durationUnit,
                'location' => null,
                'remote' => rand(0, 4) > 0, // 80% remote
                'level' => $levels[array_rand($levels)],
                'priority' => $priorities[array_rand($priorities)],
                'featured' => rand(0, 5) === 0, // ~17% featured
                'deadline' => in_array($status, ['completed', 'cancelled']) ? Carbon::now()->subWeeks(rand(1, 8)) : Carbon::now()->addWeeks(rand(2, 12)),
                'max_applicants' => rand(5, 30),
                'tags' => json_encode($tags),
                'status' => $status,
            ]);

            $projectData = ['id' => $project->id, 'status' => $status];

            // Assign developer for in_progress, completed, pending_payment
            if (in_array($status, ['in_progress', 'completed', 'pending_payment'])) {
                $devId = $developers[array_rand($developers)];
                $projectData['developer_id'] = $devId;
            }

            $projects[$projectIndex + $p] = $projectData;

            foreach ($projCats as $catName) {
                if (isset($categories[$catName])) {
                    DB::table('project_category_project')->insert([
                        'project_id' => $project->id,
                        'project_category_id' => $categories[$catName],
                        'created_at' => Carbon::now(),
                        'updated_at' => Carbon::now(),
                    ]);
                }
            }

            foreach ($projSkills as $sName) {
                if (isset($skills[$sName])) {
                    DB::table('project_skill')->insert([
                        'project_id' => $project->id,
                        'skill_id' => $skills[$sName],
                        'created_at' => Carbon::now(),
                        'updated_at' => Carbon::now(),
                    ]);
                }
            }
        }

        $this->command->info('Total projects created: ' . count($projects));
        
        return $projects;
    }

    private function createApplications(array $projects, array $developers): void
    {
        $this->command->info('Creando aplicaciones...');
        
        $coverLetters = [
            "Hola, me interesa mucho este proyecto. Tengo experiencia directa con las tecnologías requeridas y he trabajado en proyectos similares. Me encantaría poder contribuir con mi experiencia.",
            "Buenos días. He revisado los requisitos del proyecto y creo que mi perfil es ideal. En mi último empleo desarrollé un sistema similar con excelentes resultados.",
            "¡Hola! Este proyecto me parece muy interesante. Cuento con años de experiencia en las tecnologías mencionadas y estoy disponible para comenzar de inmediato.",
            "Estimado cliente. He analizado su proyecto y estoy muy motivado para participar. Tengo experiencia sólida en el stack tecnológico que requieren.",
            "Me interesa participar en este proyecto. He desarrollado aplicaciones similares y puedo aportar valor desde el primer día.",
            "Buenos días. After reviewing your requirements, I believe I am an excellent fit for this project. I have extensive experience with the needed technologies.",
            "¡Hola! Este proyecto es exactamente lo que busco. Tengo las habilidades técnicas que necesitan y puedo entregar resultados de alta calidad.",
            "Saludos. Me especializo en proyectos similares y puedo ofrecerles una solución robusta y escalable. Quedo a sus órdenes.",
            "He revisado detalladamente los requisitos y estoy seguro de poder completar el proyecto con éxito. Tengo experiencia en todos los tecnologías solicitadas.",
            "Buen día. Me encantaría formar parte de este proyecto. Mi enfoque en la calidad y los tiempos de entrega se ajusta a lo que buscan.",
            "Hola equipo. Tengo más de 5 años de experiencia en proyectos similares y me fascina la propuesta. Podemos conversar sobre los detalles.",
            "Estimados. He construido soluciones parecidas anteriormente y entiendo perfectamente lo que necesitan. Estoy listo para empezar.",
            "¡Buen día! Este proyecto me llama la atención especialmente porque coincide con mi expertise. Ofrezco código limpio y bien documentado.",
            "After analyzing your project requirements, I'm confident I can deliver an excellent result. Let's discuss the details.",
            "Me interesa mucho este tipo de trabajo. Tengo un enfoque proactivo y siempre busco superar las expectativas del cliente.",
        ];
        
        $applicationId = 1;
        
        // Aplicaciones para proyectos Open (P1-P5)
        for ($i = 1; $i <= 5; $i++) {
            $project = $projects[$i];
            $numApplications = rand(3, 5);
            $availableDevelopers = $developers;
            shuffle($availableDevelopers);
            
            for ($j = 0; $j < $numApplications; $j++) {
                $developerId = $availableDevelopers[$j];
                $status = ($j === 0) ? 'pending' : 'pending';
                
                Application::create([
                    'project_id' => $project['id'],
                    'developer_id' => $developerId,
                    'cover_letter' => $coverLetters[array_rand($coverLetters)],
                    'status' => $status,
                ]);
                $applicationId++;
            }
        }
        
        // Aplicaciones para proyectos In Progress (P6-P10)
        for ($i = 6; $i <= 10; $i++) {
            $project = $projects[$i];
            $assignedDeveloperId = $project['developer_id'];
            $numApplications = rand(3, 5);
            $availableDevelopers = array_filter($developers, fn($d) => $d !== $assignedDeveloperId);
            $availableDevelopers = array_values($availableDevelopers);
            shuffle($availableDevelopers);
            
            // Aplicación aceptada
            Application::create([
                'project_id' => $project['id'],
                'developer_id' => $assignedDeveloperId,
                'cover_letter' => $coverLetters[array_rand($coverLetters)],
                'status' => 'accepted',
            ]);
            
            // Aplicaciones rechazadas
            for ($j = 0; $j < min($numApplications - 1, 2); $j++) {
                Application::create([
                    'project_id' => $project['id'],
                    'developer_id' => $availableDevelopers[$j],
                    'cover_letter' => $coverLetters[array_rand($coverLetters)],
                    'status' => 'rejected',
                ]);
            }
        }
        
        
        // Aplicaciones para proyectos Completed (P11-P14)
        for ($i = 11; $i <= 14; $i++) {
            $project = $projects[$i];
            $assignedDeveloperId = $project['developer_id'];
            $availableDevelopers = array_filter($developers, fn($d) => $d !== $assignedDeveloperId);
            $availableDevelopers = array_values($availableDevelopers);
            shuffle($availableDevelopers);
            
            // Aplicación aceptada
            Application::create([
                'project_id' => $project['id'],
                'developer_id' => $assignedDeveloperId,
                'cover_letter' => $coverLetters[array_rand($coverLetters)],
                'status' => 'accepted',
            ]);
            
            // Aplicaciones rechazadas
            for ($j = 0; $j < 2; $j++) {
                Application::create([
                    'project_id' => $project['id'],
                    'developer_id' => $availableDevelopers[$j],
                    'cover_letter' => $coverLetters[array_rand($coverLetters)],
                    'status' => 'rejected',
                ]);
            }
        }
        
        // Aplicaciones para proyectos Cancelled (P15-P16)
        for ($i = 15; $i <= 16; $i++) {
            $project = $projects[$i];
            $numApplications = rand(2, 3);
            $availableDevelopers = $developers;
            shuffle($availableDevelopers);
            
            for ($j = 0; $j < $numApplications; $j++) {
                $status = ($j === 0) ? 'pending' : 'rejected';
                
                Application::create([
                    'project_id' => $project['id'],
                    'developer_id' => $availableDevelopers[$j],
                    'cover_letter' => $coverLetters[array_rand($coverLetters)],
                    'status' => $status,
                ]);
            }
        }
        
        // Aplicaciones para proyectos Pending Payment (P19-P20)
        for ($i = 19; $i <= 20; $i++) {
            $project = $projects[$i];
            $assignedDeveloperId = $project['developer_id'];
            
            // Aplicación aceptada
            Application::create([
                'project_id' => $project['id'],
                'developer_id' => $assignedDeveloperId,
                'cover_letter' => $coverLetters[array_rand($coverLetters)],
                'status' => 'accepted',
            ]);
        }
    }

    private function createMilestones(array $projects): void
    {
        $this->command->info('Creando milestones...');
        
        // Milestones para proyectos In Progress (P6-P10)
        $inProgressMilestones = [
            6 => [ // Microservicios
                ['title' => 'Análisis y diseño de arquitectura', 'amount' => 2500, 'status' => 'funded', 'progress_status' => 'completed', 'order' => 1, 'deliverables' => ['Documento de arquitectura', 'Diagrama de microservicios', 'Definición de APIs']],
                ['title' => 'Desarrollo de servicios core', 'amount' => 3000, 'status' => 'funded', 'progress_status' => 'review', 'order' => 2, 'deliverables' => ['Código fuente servicios', 'Tests unitarios', 'Documentación técnica']],
                ['title' => 'Integración y comunicación entre servicios', 'amount' => 2500, 'status' => 'funded', 'progress_status' => 'in_progress', 'order' => 3, 'deliverables' => ['Service mesh configurado', 'Message queue implementado', 'Logs centralizados']],
                ['title' => 'Testing integral y despliegue', 'amount' => 2000, 'status' => 'pending', 'progress_status' => 'todo', 'order' => 4, 'deliverables' => ['Tests de integración', 'Pipeline CI/CD', 'Manual de despliegue']],
            ],
            7 => [ // Dashboard Analytics
                ['title' => 'Setup de infraestructura y base de datos', 'amount' => 1750, 'status' => 'funded', 'progress_status' => 'completed', 'order' => 1, 'deliverables' => ['MongoDB configurado', 'Schemas definidos', 'APIs base']],
                ['title' => 'Desarrollo de componentes del dashboard', 'amount' => 2800, 'status' => 'funded', 'progress_status' => 'completed', 'order' => 2, 'deliverables' => ['Gráficos principales', 'Filtros implementados', 'Responsive design']],
                ['title' => 'WebSockets y tiempo real', 'amount' => 1750, 'status' => 'funded', 'progress_status' => 'in_progress', 'order' => 3, 'deliverables' => ['WebSocket configurado', 'Updates en tiempo real', 'Notificaciones']],
                ['title' => 'Testing, optimización y entrega', 'amount' => 700, 'status' => 'pending', 'progress_status' => 'todo', 'order' => 4, 'deliverables' => ['Tests completos', 'Optimización performance', 'Documentación']],
            ],
            8 => [ // UI/UX App Bancaria
                ['title' => 'Investigación y wireframes', 'amount' => 1250, 'status' => 'funded', 'progress_status' => 'completed', 'order' => 1, 'deliverables' => ['User research', 'Wireframes', 'User personas']],
                ['title' => 'Diseño de UI completo', 'amount' => 2000, 'status' => 'funded', 'progress_status' => 'review', 'order' => 2, 'deliverables' => ['Prototipo alta fidelidad', 'Design system', 'Animaciones']],
                ['title' => 'Especificaciones para desarrollo', 'amount' => 1250, 'status' => 'funded', 'progress_status' => 'in_progress', 'order' => 3, 'deliverables' => ['Specs técnicas', 'Componentes documentados', 'Assets exportados']],
                ['title' => 'Validación y ajustes finales', 'amount' => 500, 'status' => 'pending', 'progress_status' => 'todo', 'order' => 4, 'deliverables' => ['Pruebas usuarios', 'Ajustes finales', 'Entrega documentos']],
            ],
            9 => [ // CI/CD Pipeline
                ['title' => 'Análisis de infraestructura actual', 'amount' => 2000, 'status' => 'funded', 'progress_status' => 'completed', 'order' => 1, 'deliverables' => ['Auditoría infraestructura', 'Plan de migración', 'Diseño pipeline']],
                ['title' => 'Implementación de CI/CD', 'amount' => 4000, 'status' => 'funded', 'progress_status' => 'in_progress', 'order' => 2, 'deliverables' => ['GitHub Actions configurado', 'Tests automatizados', 'Artifact registry']],
                ['title' => 'Configuración de Kubernetes', 'amount' => 3000, 'status' => 'pending', 'progress_status' => 'todo', 'order' => 3, 'deliverables' => ['Clusters configurados', 'Deployments automatizados', 'Monitoring']],
                ['title' => 'Documentación y capacitación', 'amount' => 3000, 'status' => 'pending', 'progress_status' => 'todo', 'order' => 4, 'deliverables' => ['Manuales', 'Capacitación equipo', 'Soporte post-lanzamiento']],
            ],
            10 => [ // API Pagos
                ['title' => 'Diseño de arquitectura de pagos', 'amount' => 1500, 'status' => 'funded', 'progress_status' => 'completed', 'order' => 1, 'deliverables' => ['Arquitectura API', 'Modelos de datos', 'Flujos de pago']],
                ['title' => 'Integración con Stripe', 'amount' => 2250, 'status' => 'funded', 'progress_status' => 'completed', 'order' => 2, 'deliverables' => ['Stripe integrado', 'Webhooks configurados', 'Tests']],
                ['title' => 'Integración con PayPal y MercadoPago', 'amount' => 2250, 'status' => 'funded', 'progress_status' => 'in_progress', 'order' => 3, 'deliverables' => ['PayPal integrado', 'MercadoPago integrado', 'Fallbacks configurados']],
                ['title' => 'Testing, seguridad y entrega', 'amount' => 0, 'status' => 'pending', 'progress_status' => 'todo', 'order' => 4, 'deliverables' => ['Tests de seguridad', 'Documentación API', 'Soporte']],
            ],
        ];
        
        foreach ($inProgressMilestones as $projectNum => $milestones) {
            $project = $projects[$projectNum];
            foreach ($milestones as $m) {
                Milestone::create([
                    'project_id' => $project['id'],
                    'title' => $m['title'],
                    'description' => null,
                    'amount' => $m['amount'],
                    'status' => $m['status'],
                    'progress_status' => $m['progress_status'],
                    'order' => $m['order'],
                    'due_date' => $m['order'] <= 2 ? Carbon::now()->subWeeks(rand(1, 2)) : ($m['progress_status'] === 'in_progress' ? Carbon::now()->addWeeks(1) : Carbon::now()->addWeeks(2)),
                    'deliverables' => json_encode($m['deliverables']),
                ]);
            }
        }
        
        // Milestones para proyectos Completed (P11-P14)
        $completedMilestones = [
            11 => [ // WooCommerce
                ['title' => 'Diseño y maquetación', 'amount' => 1200, 'status' => 'released', 'progress_status' => 'completed', 'order' => 1],
                ['title' => 'Desarrollo e integración de pagos', 'amount' => 1600, 'status' => 'released', 'progress_status' => 'completed', 'order' => 2],
                ['title' => 'Testing y lanzamiento', 'amount' => 1200, 'status' => 'released', 'progress_status' => 'completed', 'order' => 3],
            ],
            12 => [ // OAuth2
                ['title' => 'Diseño del sistema de autenticación', 'amount' => 1000, 'status' => 'released', 'progress_status' => 'completed', 'order' => 1],
                ['title' => 'Implementación de OAuth2 y JWT', 'amount' => 2000, 'status' => 'released', 'progress_status' => 'completed', 'order' => 2],
                ['title' => 'Integración de 2FA y pruebas', 'amount' => 2000, 'status' => 'released', 'progress_status' => 'completed', 'order' => 3],
            ],
            13 => [ // App Fitness
                ['title' => 'Diseño de arquitectura y UI', 'amount' => 2000, 'status' => 'released', 'progress_status' => 'completed', 'order' => 1],
                ['title' => 'Desarrollo de funcionalidades core', 'amount' => 4000, 'status' => 'released', 'progress_status' => 'completed', 'order' => 2],
                ['title' => 'Pruebas y publicación', 'amount' => 3000, 'status' => 'released', 'progress_status' => 'completed', 'order' => 3],
            ],
            14 => [ // AWS Infrastructure
                ['title' => 'Diseño de arquitectura cloud', 'amount' => 2500, 'status' => 'released', 'progress_status' => 'completed', 'order' => 1],
                ['title' => 'Implementación con Terraform', 'amount' => 5500, 'status' => 'released', 'progress_status' => 'completed', 'order' => 2],
                ['title' => 'Documentación y transferencia', 'amount' => 3000, 'status' => 'released', 'progress_status' => 'completed', 'order' => 3],
            ],
        ];
        
        foreach ($completedMilestones as $projectNum => $milestones) {
            $project = $projects[$projectNum];
            foreach ($milestones as $m) {
                Milestone::create([
                    'project_id' => $project['id'],
                    'title' => $m['title'],
                    'description' => null,
                    'amount' => $m['amount'],
                    'status' => $m['status'],
                    'progress_status' => $m['progress_status'],
                    'order' => $m['order'],
                    'due_date' => Carbon::now()->subWeeks(rand(1, 4)),
                    'deliverables' => null,
                ]);
            }
        }
        
        // Milestones para proyectos Pending Payment (P19-P20)
        $pendingPaymentMilestones = [
            19 => [ // Migración DB
                ['title' => 'Análisis y planificación', 'amount' => 1000, 'status' => 'released', 'progress_status' => 'completed', 'order' => 1],
                ['title' => 'Migración de datos', 'amount' => 2000, 'status' => 'released', 'progress_status' => 'completed', 'order' => 2],
                ['title' => 'Optimización y testing', 'amount' => 1000, 'status' => 'funded', 'progress_status' => 'completed', 'order' => 3],
            ],
            20 => [ // Dashboard BI
                ['title' => 'Diseño de arquitectura', 'amount' => 2000, 'status' => 'released', 'progress_status' => 'completed', 'order' => 1],
                ['title' => 'Desarrollo de visualizaciones', 'amount' => 4000, 'status' => 'released', 'progress_status' => 'completed', 'order' => 2],
                ['title' => 'Reportes y entrega', 'amount' => 2000, 'status' => 'funded', 'progress_status' => 'completed', 'order' => 3],
            ],
        ];
        
        foreach ($pendingPaymentMilestones as $projectNum => $milestones) {
            $project = $projects[$projectNum];
            foreach ($milestones as $m) {
                Milestone::create([
                    'project_id' => $project['id'],
                    'title' => $m['title'],
                    'description' => null,
                    'amount' => $m['amount'],
                    'status' => $m['status'],
                    'progress_status' => $m['progress_status'],
                    'order' => $m['order'],
                    'due_date' => Carbon::now()->subWeeks(1),
                    'deliverables' => null,
                ]);
            }
        }
    }

    private function createConversationsAndMessages(array $projects): void
    {
        $this->command->info('Creando conversaciones y mensajes...');
        
        // Conversaciones para proyectos in_progress (P6-P10)
        $inProgressConversations = [
            6 => [ // Microservicios - Carlos (company 1) + Santiago (dev 3)
                ['company_id' => 9, 'developer_id' => 22],
                [
                    "¡Hola! Bienvenido al proyecto. Me alegra mucho que te hayas unido al equipo.",
                    "¡Hola! Muchas gracias por la oportunidad. Estoy muy motivado con este proyecto.",
                    "Perfecto. Te comparto los requisitos detallados del primer módulo en el repositorio.",
                    "Ya los revisé. Tengo algunas preguntas sobre la arquitectura propuesta.",
                    "Claro, cuéntame. Estoy disponible para resolver cualquier duda.",
                    "Sobre la integración con la base de datos, ¿prefieren PostgreSQL o MySQL?",
                    "PostgreSQL definitivamente. Necesitamos soporte para datos JSON.",
                    "Perfecto. Ya tengo avance en el primer milestone. Subo el código hoy.",
                    "Excelente. Lo reviso esta tarde y te doy feedback.",
                    "Acabo de hacer push al repositorio. El primer módulo está listo para review."
                ]
            ],
            7 => [ // Dashboard - Ana (company 2) + María (dev 12)
                ['company_id' => 10, 'developer_id' => 27],
                [
                    "¡Bienvenida! Gracias por aceptar el proyecto.",
                    "Gracias a ustedes por la oportunidad. Ya revisé los requisitos iniciales.",
                    "Excelente. El dashboard de analytics es muy importante para nosotros.",
                    "Entiendo. ¿Tienen preferencia por alguna librería de gráficos específica?",
                    "Preferimos Chart.js o ApexCharts, pero estamos abiertos a sugerencias.",
                    "Perfecto, usaré ApexCharts. Ya tengo el diseño preliminar listo.",
                    "Muy bien. ¿Cuándo puedes tener el primer mockup?",
                    "Lo tendré mañana. Agregaré también algunas animaciones suaves.",
                    "Genial. El equipo está ansioso por verlo.",
                    "Aquí está el link al prototipo en Figma."
                ]
            ],
            8 => [ // UI/UX - Laura (company 4) + Isabella (dev 6)
                ['company_id' => 12, 'developer_id' => 21],
                [
                    "¡Hola! Estamos muy emocionados con el redesign.",
                    "¡Gracias! He analizado la app actual y tengo varias ideas de mejora.",
                    "Perfecto. ¿Qué aspectos crees que necesitan más atención?",
                    "El flujo de pagos y la navegación. Hay beberapa puntos de fricción.",
                    "Exacto, eso mismo nos han dicho los usuarios. ¿Tienes propuestas?",
                    "Sí, te preparé un documento conwireframes de mejora.",
                    "Lo revisé, muy profesional. Me gusta especialmente el nuevo dashboard.",
                    "Gracias. También propongo un sistema de diseño más moderno.",
                    "Excelente. Sigamos adelante con ese enfoque.",
                    "Perfecto. Empiezo con los prototipos de alta fidelidad."
                ]
            ],
            9 => [ // CI/CD - Pablo (company 3) + Camila (dev 4)
                ['company_id' => 11, 'developer_id' => 19],
                [
                    "¡Hola! Thank you for joining this infrastructure project.",
                    "Hello! I'm excited to work on the CI/CD pipeline modernization.",
                    "Great. We need to migrate from our current Jenkins setup to GitHub Actions.",
                    "That makes sense. I've done several similar migrations successfully.",
                    "Perfect. What's your approach for the Kubernetes cluster?",
                    "I'll use EKS with proper node pools and cluster autoscaler.",
                    "Excellent. We need to ensure zero downtime during deployment.",
                    "I'll implement blue-green deployments with proper health checks.",
                    "That's exactly what we need. Let's proceed with the planning.",
                    "I've already prepared a detailed migration plan."
                ]
            ],
            10 => [ // API Pagos - Julia (company 8) + Alejandro (dev 13)
                ['company_id' => 16, 'developer_id' => 28],
                [
                    "¡Bienvenido al proyecto de API de pagos!",
                    "¡Gracias! Ya tengo experiencia con Stripe y PayPal, serápan com.",
                    "Perfecto. Necesitamos integración también con MercadoPago.",
                    "Lo incluyo en el plan. ¿Tienen cuenta de MercadoPago configurada?",
                    "Sí, te paso las credenciales por otro canal seguro.",
                    "Excelente. ¿Hay algún requerimiento específico de seguridad?",
                    "PCI compliance es obligatorio. Tarjetas nunca deben tocar nuestro servidor.",
                    "Entendido. Usaré tokens y payment intents deStripe.",
                    "Perfecto. También necesitamos webhooks para confirmar pagos.",
                    "Ya lo tengo contemplado. Todos los eventos estarán manejados."
                ]
            ],
        ];
        
        foreach ($inProgressConversations as $projectNum => $convData) {
            $projectInfo = $convData[0];
            $messages = $convData[1];
            $project = $projects[$projectNum];
            
            $conversation = Conversation::create([
                'type' => 'project',
                'project_id' => $project['id'],
                'initiator_id' => $projectInfo['company_id'],
                'participant_id' => $projectInfo['developer_id'],
            ]);
            
            $isCompany = true;
            foreach ($messages as $index => $content) {
                Message::create([
                    'conversation_id' => $conversation->id,
                    'sender_id' => $isCompany ? $projectInfo['company_id'] : $projectInfo['developer_id'],
                    'content' => $content,
                    'type' => 'text',
                    'file_path' => null,
                    'is_read' => $index < 8,
                ]);
                $isCompany = !$isCompany;
            }
        }
        
        // Conversaciones para proyectos completed (P11-P14)
        $completedConversations = [
            11 => [ // WooCommerce - Carlos (company 1) + Valentina (dev 2)
                ['company_id' => 9, 'developer_id' => 17],
                [
                    "¡Hola! Gracias por unirte al proyecto de e-commerce.",
                    "¡Gracias! Ya he trabajado con WooCommerce, serápan com.",
                    "Excelente. Necesitamos una tienda muy personalizada.",
                    "Entiendo. ¿Tienen mockups o es自由 diseño?",
                    "Te comparto el diseño que我们有 en Figma.",
                    "Perfecto, ya lo revisé. Queda muy profesional.",
                    "We need integration with a local payment gateway.",
                    "Lo incluyo. ¿Tienen documentación de la API?",
                    "Sí, te la paso. Also, we need inventory management.",
                    "Incluiré un sistema de inventario completo.",
                    "Excelente trabajo, la tienda quedó perfect.",
                    "Muchas gracias. Quedo atento a cualquier ajuste."
                ]
            ],
            12 => [ // OAuth2 - Ana (company 2) + Andrés (dev 1)
                ['company_id' => 10, 'developer_id' => 16],
                [
                    "¡Hola! El proyecto de autenticación es muy importante.",
                    "Entiendo. ¿Qué proveedor de OAuth necesitan?",
                    "Principalmente Google y Microsoft, pero necesitamos poder agregar más.",
                    "Diseñaré una arquitectura modular para eso.",
                    "Perfecto. Also need JWT tokens for our mobile app.",
                    "Lo tengo cubierto. Usaré access y refresh tokens.",
                    "Excelente. ¿Cuándo tendrías el primer milestone?",
                    "En dos semanas tendrás el sistema básico funcionando.",
                    "Perfecto. We'll test it thoroughly.",
                    "El sistema está listo para pruebas.",
                    "¡Excelente trabajo! Todo funcionando perfect.",
                    "Gracias. Fue un placer trabajar con ustedes."
                ]
            ],
            13 => [ // App Fitness - Juan (company 5) + Sofía (dev 14)
                ['company_id' => 13, 'developer_id' => 29],
                [
                    "¡Bienvenida! La app de fitness es nuestro proyecto más ambicioso.",
                    "¡Gracias! Tengo experiencia con apps de este tipo.",
                    "Great. We need tracking de ejercicios y alimentación.",
                    "Usaré AsyncStorage para persistencia local y API para sync.",
                    "Perfecto. También necesitamos notificaciones push.",
                    "Ya lo tengo implementado. ¿Qué tipo de recordatorios?",
                    "Ejercicios, hydration y meals.",
                    "Entendido. Configuraré un sistema de recordatorios completo.",
                    "La app está lista para submission a stores.",
                    "Excelente. El diseño quedó increible.",
                    "¡Muchas gracias! Fue un proyecto muy divertido.",
                    "Totally. We'll work together again soon."
                ]
            ],
            14 => [ // AWS - Laura (company 4) + Lucía (dev 8)
                ['company_id' => 12, 'developer_id' => 23],
                [
                    "¡Hola! El proyecto de migración cloud es crítico.",
                    "Entiendo. ¿Cuál es el estado actual de su infraestructura?",
                    "Tenemos servidores on-premise que queremos migrar.",
                    "Diseñaré una arquitectura AWS completamente nueva.",
                    "We need to ensure high availability.",
                    "Usaré múltiples AZs y Auto Scaling Groups.",
                    "Perfecto. Also need proper monitoring.",
                    "Implementaré CloudWatch con alertas personalizadas.",
                    "La infraestructura está lista para producción.",
                    "Excelente. El equipo está muy impresionado.",
                    "Gracias. Dejo toda la documentación necesaria.",
                    "Perfect. It was great working with you."
                ]
            ],
        ];
        
        foreach ($completedConversations as $projectNum => $convData) {
            $projectInfo = $convData[0];
            $messages = $convData[1];
            $project = $projects[$projectNum];
            
            $conversation = Conversation::create([
                'type' => 'project',
                'project_id' => $project['id'],
                'initiator_id' => $projectInfo['company_id'],
                'participant_id' => $projectInfo['developer_id'],
            ]);
            
            $isCompany = true;
            foreach ($messages as $index => $content) {
                Message::create([
                    'conversation_id' => $conversation->id,
                    'sender_id' => $isCompany ? $projectInfo['company_id'] : $projectInfo['developer_id'],
                    'content' => $content,
                    'type' => 'text',
                    'file_path' => null,
                    'is_read' => true,
                ]);
                $isCompany = !$isCompany;
            }
        }
    }

    private function createReviews(array $projects): void
    {
        $this->command->info('Creando reseñas...');
        
        $reviewsData = [
            11 => ['rating' => 5, 'comment' => 'Valentina hizo un trabajo excepcional en nuestra tienda online. Entregó antes del plazo y la calidad del código es sobresaliente. Totalmente recomendada.'],
            12 => ['rating' => 4, 'comment' => 'Andrés implementó el sistema de autenticación de forma sólida y segura. Buena comunicación durante todo el proyecto. Solo sugeriría más documentación.'],
            13 => ['rating' => 5, 'comment' => 'Sofía superó nuestras expectativas con la app de fitness. Diseño impecable y rendimiento excelente. Definitivamente volveremos a trabajar juntos.'],
            14 => ['rating' => 5, 'comment' => 'Lucía es una experta en infraestructura cloud. Migró toda nuestra infraestructura sin downtime y nos dejó una documentación muy completa.'],
        ];
        
        foreach ($reviewsData as $projectNum => $reviewData) {
            $project = $projects[$projectNum];
            
            Review::create([
                'project_id' => $project['id'],
                'company_id' => Project::find($project['id'])->company_id,
                'developer_id' => $project['developer_id'],
                'rating' => $reviewData['rating'],
                'comment' => $reviewData['comment'],
            ]);
        }
    }

    private function createTransactions(array $projects, array $admins): void
    {
        $this->command->info('Creando transacciones...');
        
        // Proyectos completed (P11-P14) - transacciones completas
        $completedProjectIds = [11, 12, 13, 14];
        
        foreach ($completedProjectIds as $projectNum) {
            $project = $projects[$projectNum];
            $projectModel = Project::find($project['id']);
            $companyId = $projectModel->company_id;
            $developerId = $project['developer_id'];
            
            $companyWallet = Wallet::firstOrCreate(
                ['user_id' => $companyId],
                ['balance' => 0, 'held_balance' => 0]
            );
            $developerWallet = Wallet::firstOrCreate(
                ['user_id' => $developerId],
                ['balance' => 0, 'held_balance' => 0]
            );
            $adminWallet = Wallet::firstOrCreate(
                ['user_id' => $admins[0]],
                ['balance' => 0, 'held_balance' => 0]
            );
            
            // Depósito inicial de la company
            Transaction::create([
                'wallet_id' => $companyWallet->id,
                'amount' => $projectModel->budget_min,
                'type' => 'deposit',
                'description' => 'Depósito inicial para proyecto: ' . $projectModel->title,
                'reference_type' => 'project',
                'reference_id' => $project['id'],
            ]);
            
            $companyWallet->balance += $projectModel->budget_min;
            $companyWallet->save();
            
            // Milestones
            $milestones = Milestone::where('project_id', $project['id'])->orderBy('order')->get();
            foreach ($milestones as $milestone) {
                // Escrow deposit
                Transaction::create([
                    'wallet_id' => $companyWallet->id,
                    'amount' => -$milestone->amount,
                    'type' => 'escrow_deposit',
                    'description' => 'Depósito en escrow para milestone: ' . $milestone->title,
                    'reference_type' => 'milestone',
                    'reference_id' => $milestone->id,
                ]);
                
                $companyWallet->held_balance += $milestone->amount;
                $companyWallet->balance -= $milestone->amount;
                $companyWallet->save();
                
                // Payment al developer (90% después de commission)
                $developerAmount = $milestone->amount * 0.90;
                $commissionAmount = $milestone->amount * 0.10;
                
                Transaction::create([
                    'wallet_id' => $developerWallet->id,
                    'amount' => $developerAmount,
                    'type' => 'payment_received',
                    'description' => 'Pago recibido por milestone: ' . $milestone->title,
                    'reference_type' => 'milestone',
                    'reference_id' => $milestone->id,
                ]);
                
                $developerWallet->balance += $developerAmount;
                $developerWallet->save();
                
                // Commission al admin
                Transaction::create([
                    'wallet_id' => $adminWallet->id,
                    'amount' => $commissionAmount,
                    'type' => 'commission',
                    'description' => 'Comisión del proyecto: ' . $projectModel->title,
                    'reference_type' => 'project',
                    'reference_id' => $project['id'],
                ]);
                
                $adminWallet->balance += $commissionAmount;
                $adminWallet->save();
                
                // Release del escrow
                Transaction::create([
                    'wallet_id' => $companyWallet->id,
                    'amount' => 0,
                    'type' => 'escrow_release',
                    'description' => 'Liberación de escrow para milestone: ' . $milestone->title,
                    'reference_type' => 'milestone',
                    'reference_id' => $milestone->id,
                ]);
                
                $companyWallet->held_balance -= $milestone->amount;
                $companyWallet->save();
            }
        }
        
        // Proyectos in_progress (P6-P10) - solo escrow deposits
        $inProgressProjectIds = [6, 7, 8, 9, 10];
        
        foreach ($inProgressProjectIds as $projectNum) {
            $project = $projects[$projectNum];
            $projectModel = Project::find($project['id']);
            $companyId = $projectModel->company_id;
            
            $companyWallet = Wallet::where('user_id', $companyId)->first();
            
            // Depósito inicial
            Transaction::create([
                'wallet_id' => $companyWallet->id,
                'amount' => $projectModel->budget_min * 0.5,
                'type' => 'deposit',
                'description' => 'Depósito inicial para proyecto: ' . $projectModel->title,
                'reference_type' => 'project',
                'reference_id' => $project['id'],
            ]);
            
            $companyWallet->balance += $projectModel->budget_min * 0.5;
            $companyWallet->save();
            
            // Escrow deposits para milestones funded
            $fundedMilestones = Milestone::where('project_id', $project['id'])
                ->where('status', 'funded')
                ->get();
            
            foreach ($fundedMilestones as $milestone) {
                Transaction::create([
                    'wallet_id' => $companyWallet->id,
                    'amount' => -$milestone->amount,
                    'type' => 'escrow_deposit',
                    'description' => 'Depósito en escrow para milestone: ' . $milestone->title,
                    'reference_type' => 'milestone',
                    'reference_id' => $milestone->id,
                ]);
                
                $companyWallet->held_balance += $milestone->amount;
                $companyWallet->balance -= $milestone->amount;
                $companyWallet->save();
            }
        }
        
        // Proyectos pending payment (P19-P20)
        $pendingPaymentProjectIds = [19, 20];
        
        foreach ($pendingPaymentProjectIds as $projectNum) {
            $project = $projects[$projectNum];
            $projectModel = Project::find($project['id']);
            $companyId = $projectModel->company_id;
            
            $companyWallet = Wallet::where('user_id', $companyId)->first();
            
            // Depósito inicial
            Transaction::create([
                'wallet_id' => $companyWallet->id,
                'amount' => $projectModel->budget_min,
                'type' => 'deposit',
                'description' => 'Depósito para proyecto: ' . $projectModel->title,
                'reference_type' => 'project',
                'reference_id' => $project['id'],
            ]);
            
            $companyWallet->balance += $projectModel->budget_min;
            $companyWallet->save();
            
            // Todos los milestones en escrow
            $milestones = Milestone::where('project_id', $project['id'])->get();
            foreach ($milestones as $milestone) {
                Transaction::create([
                    'wallet_id' => $companyWallet->id,
                    'amount' => -$milestone->amount,
                    'type' => 'escrow_deposit',
                    'description' => 'Depósito en escrow para milestone: ' . $milestone->title,
                    'reference_type' => 'milestone',
                    'reference_id' => $milestone->id,
                ]);
                
                $companyWallet->held_balance += $milestone->amount;
                $companyWallet->balance -= $milestone->amount;
                $companyWallet->save();
            }
        }
    }

    private function createPortfolios(array $developers): void
    {
        $this->command->info('Creando portfolios...');
        
        $portfolioData = [
            16 => [ // Andrés (dev 1)
                [
                    'title' => 'Plataforma de E-learning Interactiva',
                    'description' => 'Plataforma educativa con videoconferencias en tiempo real y gamificación',
                    'project_url' => 'https://elearning-demo.com',
                    'github_url' => 'https://github.com/andresgarcia/elearning',
                    'technologies' => ['React', 'Laravel', 'PostgreSQL', 'WebRTC'],
                    'completion_date' => 'Enero 2026',
                    'client' => 'EduTech Solutions',
                    'featured' => true,
                    'views' => 234,
                    'likes' => 45,
                ],
                [
                    'title' => 'API de Gestión de Inventarios',
                    'description' => 'Sistema REST API para gestión de inventarios con múltiples almacenes',
                    'project_url' => null,
                    'github_url' => 'https://github.com/andresgarcia/inventory-api',
                    'technologies' => ['Laravel', 'MySQL', 'Redis', 'Docker'],
                    'completion_date' => 'Octubre 2025',
                    'client' => 'LogiStorage S.A.',
                    'featured' => false,
                    'views' => 156,
                    'likes' => 33,
                ],
            ],
            17 => [ // Valentina (dev 2)
                [
                    'title' => 'Dashboard SaaS para Marketing',
                    'description' => 'Dashboard interactivo para análisis de campañas de marketing digital',
                    'project_url' => 'https://marketdash.io',
                    'github_url' => null,
                    'technologies' => ['Next.js', 'TypeScript', 'TailwindCSS', 'PostgreSQL'],
                    'completion_date' => 'Noviembre 2025',
                    'client' => 'DigitalFirst Agency',
                    'featured' => true,
                    'views' => 312,
                    'likes' => 67,
                ],
            ],
            19 => [ // Camila (dev 4)
                [
                    'title' => 'Plataforma de Despliegue Continuo',
                    'description' => 'Plataforma interna de CI/CD para múltiples equipos de desarrollo',
                    'project_url' => null,
                    'github_url' => 'https://github.com/camilardz/cicd-platform',
                    'technologies' => ['Kubernetes', 'Docker', 'GitHub Actions', 'AWS'],
                    'completion_date' => 'Diciembre 2025',
                    'client' => 'TechCorp International',
                    'featured' => true,
                    'views' => 189,
                    'likes' => 42,
                ],
                [
                    'title' => 'Infraestructura Multi-Cloud',
                    'description' => 'Arquitectura multi-cloud con Terraform para empresa fintech',
                    'project_url' => null,
                    'github_url' => 'https://github.com/camilardz/multicloud-infra',
                    'technologies' => ['AWS', 'GCP', 'Terraform', 'Ansible'],
                    'completion_date' => 'Septiembre 2025',
                    'client' => 'FinSecure',
                    'featured' => false,
                    'views' => 145,
                    'likes' => 28,
                ],
            ],
            21 => [ // Isabella (dev 6)
                [
                    'title' => 'Rediseño App de Banca Móvil',
                    'description' => 'Rediseño completo de app de banca móvil para banco regional',
                    'project_url' => null,
                    'github_url' => null,
                    'technologies' => ['Figma', 'Principle', 'After Effects'],
                    'completion_date' => 'Agosto 2025',
                    'client' => 'Banco Regional',
                    'featured' => true,
                    'views' => 456,
                    'likes' => 89,
                ],
            ],
            22 => [ // Santiago (dev 3)
                [
                    'title' => 'Sistema de Mensajería Empresarial',
                    'description' => 'Plataforma de mensajería en tiempo real para empresas',
                    'project_url' => 'https://bizchat.io',
                    'github_url' => 'https://github.com/santiagomtz/enterprise-chat',
                    'technologies' => ['Node.js', 'Socket.io', 'MongoDB', 'Redis'],
                    'completion_date' => 'Julio 2025',
                    'client' => 'CommsPro',
                    'featured' => true,
                    'views' => 278,
                    'likes' => 54,
                ],
            ],
            23 => [ // Lucía (dev 8)
                [
                    'title' => 'Migración Cloud para Retail',
                    'description' => 'Migración completa de infraestructura on-premise a AWS',
                    'project_url' => null,
                    'github_url' => null,
                    'technologies' => ['AWS', 'Terraform', 'Kubernetes', 'CloudWatch'],
                    'completion_date' => 'Octubre 2025',
                    'client' => 'RetailMax',
                    'featured' => true,
                    'views' => 345,
                    'likes' => 72,
                ],
            ],
            27 => [ // María (dev 12)
                [
                    'title' => 'Plataforma de Análisis en Tiempo Real',
                    'description' => 'Dashboard de analytics con procesamiento de millones de eventos',
                    'project_url' => 'https://realtimeanalytics.io',
                    'github_url' => 'https://github.com/mariavargas/analytics-platform',
                    'technologies' => ['React', 'Node.js', 'MongoDB', 'GraphQL', 'Redis'],
                    'completion_date' => 'Noviembre 2025',
                    'client' => 'DataDriven Inc',
                    'featured' => true,
                    'views' => 289,
                    'likes' => 61,
                ],
            ],
            28 => [ // Alejandro (dev 13)
                [
                    'title' => 'ERP para PYMES',
                    'description' => 'Sistema ERP completo para pequeñas y medianas empresas',
                    'project_url' => 'https://pymeerp.com',
                    'github_url' => 'https://github.com/alejandrocastro/pyme-erp',
                    'technologies' => ['Laravel', 'Vue.js', 'MySQL', 'Docker'],
                    'completion_date' => 'Junio 2025',
                    'client' => 'PymeSolutions',
                    'featured' => true,
                    'views' => 412,
                    'likes' => 85,
                ],
            ],
            29 => [ // Sofía (dev 14)
                [
                    'title' => 'App de Meditation y Bienestar',
                    'description' => 'Aplicación móvil de meditación con tracking de hábitos',
                    'project_url' => 'https://mindfulapp.io',
                    'github_url' => 'https://github.com/sofiamendoza/wellness-app',
                    'technologies' => ['React Native', 'TypeScript', 'Node.js', 'Firebase'],
                    'completion_date' => 'Enero 2026',
                    'client' => 'WellnessCo',
                    'featured' => true,
                    'views' => 523,
                    'likes' => 112,
                ],
            ],
            30 => [ // Ricardo (dev 15)
                [
                    'title' => 'API de Predicciones Deportivas',
                    'description' => 'API de machine learning para predicciones de eventos deportivos',
                    'project_url' => null,
                    'github_url' => 'https://github.com/ricardonavarro/sports-predictions',
                    'technologies' => ['Python', 'Django', 'PostgreSQL', 'TensorFlow'],
                    'completion_date' => 'Diciembre 2025',
                    'client' => 'BetAnalytics',
                    'featured' => false,
                    'views' => 198,
                    'likes' => 39,
                ],
            ],
        ];
        
        foreach ($portfolioData as $developerId => $portfolios) {
            foreach ($portfolios as $portfolio) {
                PortfolioProject::create([
                    'user_id' => $developerId,
                    'title' => $portfolio['title'],
                    'description' => $portfolio['description'],
                    'image_url' => null,
                    'project_url' => $portfolio['project_url'],
                    'github_url' => $portfolio['github_url'],
                    'technologies' => json_encode($portfolio['technologies']),
                    'completion_date' => $portfolio['completion_date'],
                    'client' => $portfolio['client'],
                    'featured' => $portfolio['featured'],
                    'views' => $portfolio['views'],
                    'likes' => $portfolio['likes'],
                ]);
            }
        }
    }

    private function createFavorites(array $companies, array $developers): void
    {
        $this->command->info('Creando favoritos...');
        
        $favorites = [
            [9, 16],   // TechNova favoritea a Andrés
            [9, 22],   // TechNova favoritea a Santiago
            [9, 17],   // TechNova favoritea a Valentina
            [10, 27],  // ByteForge favoritea a María
            [10, 23],  // ByteForge favoritea a Lucía
            [11, 19],  // CloudPeak favoritea a Camila
            [11, 23],  // CloudPeak favoritea a Lucía
            [12, 21],  // DataStream favoritea a Isabella
            [12, 16],  // DataStream favoritea a Andrés
            [13, 29],  // InnoCode favoritea a Sofía
            [13, 17],  // InnoCode favoritea a Valentina
            [14, 16],  // NexGen favoritea a Andrés
            [14, 27],  // NexGen favoritea a María
            [15, 23],  // AppVenture favoritea a Lucía
            [16, 28],  // CodeCraft favoritea a Alejandro
            [16, 16],  // CodeCraft favoritea a Andrés
        ];
        
        foreach ($favorites as $favorite) {
            Favorite::create([
                'company_id' => $favorite[0],
                'developer_id' => $favorite[1],
            ]);
        }
    }

    private function createUserPreferences(array $allUsers): void
    {
        $this->command->info('Creando preferencias de usuario...');
        
        $themes = ['dark', 'dark', 'dark', 'dark', 'dark', 'dark', 'light', 'light', 'light', 'light'];
        $colors = ['#00FF85', '#00FF85', '#00FF85', '#3B82F6', '#EF4444', '#F59E0B', '#8B5CF6', '#10B981'];
        $languages = ['es', 'es', 'es', 'es', 'es', 'es', 'es', 'en', 'en', 'en', 'en'];
        
        foreach ($allUsers as $userId) {
            UserPreference::create([
                'user_id' => $userId,
                'theme' => $themes[array_rand($themes)],
                'language' => $languages[array_rand($languages)],
                'accent_color' => $colors[array_rand($colors)],
                'two_factor_enabled' => rand(0, 1) === 1,
            ]);
        }
    }

    private function createActivityLogs(array $admins, array $companies, array $developers, array $projects): void
    {
        $this->command->info('Creando logs de actividad...');
        
        $allUsers = array_merge($admins, $companies, $developers);
        $ips = ['192.168.1.10', '192.168.1.15', '10.0.0.5', '10.0.0.12', '181.50.10.5', '181.70.20.15', '200.50.30.25'];
        $userAgents = [
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0',
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Safari/605.1.15',
            'Mozilla/5.0 (X11; Linux x86_64) Firefox/121.0',
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Edge/120.0.0.0',
        ];
        
        // Login logs
        foreach ($allUsers as $userId) {
            for ($i = 0; $i < rand(1, 3); $i++) {
                ActivityLog::create([
                    'user_id' => $userId,
                    'action' => 'login',
                    'details' => 'Inicio de sesión exitoso',
                    'ip_address' => $ips[array_rand($ips)],
                    'user_agent' => $userAgents[array_rand($userAgents)],
                ]);
            }
        }
        
        // Project created logs
        foreach ($projects as $projectNum => $project) {
            $projectModel = Project::find($project['id']);
            ActivityLog::create([
                'user_id' => $projectModel->company_id,
                'action' => 'project_created',
                'details' => 'Proyecto creado: ' . $projectModel->title,
                'ip_address' => $ips[array_rand($ips)],
                'user_agent' => $userAgents[array_rand($userAgents)],
            ]);
        }
        
        // Application accepted logs
        $acceptedApplications = Application::where('status', 'accepted')->get();
        foreach ($acceptedApplications as $application) {
            ActivityLog::create([
                'user_id' => $application->developer_id,
                'action' => 'application_accepted',
                'details' => 'Postulación aceptada para proyecto ID: ' . $application->project_id,
                'ip_address' => $ips[array_rand($ips)],
                'user_agent' => $userAgents[array_rand($userAgents)],
            ]);
        }
        
        // Milestone completed logs
        $completedMilestones = Milestone::where('progress_status', 'completed')->get();
        foreach ($completedMilestones as $milestone) {
            $project = Project::find($milestone->project_id);
            ActivityLog::create([
                'user_id' => $project->company_id,
                'action' => 'milestone_completed',
                'details' => 'Milestone completado: ' . $milestone->title . ' (Proyecto: ' . $project->title . ')',
                'ip_address' => $ips[array_rand($ips)],
                'user_agent' => $userAgents[array_rand($userAgents)],
            ]);
        }
        
        // Profile updated logs para algunos developers
        $selectedDevelopers = array_rand(array_flip($developers), 5);
        foreach ($selectedDevelopers as $developerId) {
            ActivityLog::create([
                'user_id' => $developerId,
                'action' => 'profile_updated',
                'details' => 'Perfil actualizado',
                'ip_address' => $ips[array_rand($ips)],
                'user_agent' => $userAgents[array_rand($userAgents)],
            ]);
        }
    }

    private function createSystemSettings(): void
    {
        $this->command->info('Creando settings del sistema...');
        
        $settings = [
            ['key' => 'commission_rate', 'value' => '10', 'type' => 'integer', 'group' => 'marketplace'],
            ['key' => 'platform_name', 'value' => 'Programmers', 'type' => 'string', 'group' => 'general'],
            ['key' => 'platform_email', 'value' => 'info@programmers.com', 'type' => 'string', 'group' => 'general'],
            ['key' => 'min_project_budget', 'value' => '100', 'type' => 'integer', 'group' => 'marketplace'],
            ['key' => 'max_project_budget', 'value' => '100000', 'type' => 'integer', 'group' => 'marketplace'],
            ['key' => 'max_applications_per_project', 'value' => '50', 'type' => 'integer', 'group' => 'marketplace'],
            ['key' => 'allow_registration', 'value' => 'true', 'type' => 'boolean', 'group' => 'general'],
            ['key' => 'maintenance_mode', 'value' => 'false', 'type' => 'boolean', 'group' => 'general'],
            ['key' => 'default_currency', 'value' => 'USD', 'type' => 'string', 'group' => 'marketplace'],
            ['key' => 'escrow_enabled', 'value' => 'true', 'type' => 'boolean', 'group' => 'marketplace'],
        ];
        
        foreach ($settings as $setting) {
            SystemSetting::create($setting);
        }
    }
}
