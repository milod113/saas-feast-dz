<?php

namespace Database\Seeders;

use App\Models\Client;
use App\Models\Reservation;
use App\Models\Tenant;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Stancl\Tenancy\Database\Models\Domain;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        DB::transaction(function () {
            User::updateOrCreate(
                ['email' => 'admin@feast-dz.test'],
                [
                    'tenant_id' => null,
                    'name' => 'Administrateur Feast DZ',
                    'role' => 'admin',
                    'password' => 'password',
                    'email_verified_at' => now(),
                ],
            );

            foreach ($this->tenants() as $tenantData) {
                $tenant = Tenant::updateOrCreate(
                    ['id' => $tenantData['id']],
                    [
                        'name' => $tenantData['name'],
                        'plan' => $tenantData['plan'],
                        'status' => $tenantData['status'],
                    ],
                );

                Domain::updateOrCreate(
                    ['domain' => $tenantData['domain']],
                    ['tenant_id' => $tenant->id],
                );

                User::updateOrCreate(
                    ['email' => $tenantData['owner']['email']],
                    [
                        'tenant_id' => $tenant->id,
                        'name' => $tenantData['owner']['name'],
                        'role' => 'owner',
                        'password' => 'password',
                        'email_verified_at' => now(),
                    ],
                );

                $clients = collect($tenantData['clients'])
                    ->mapWithKeys(function (array $clientData) use ($tenant) {
                        $client = Client::withoutTenancy()->updateOrCreate(
                            [
                                'tenant_id' => $tenant->id,
                                'email' => $clientData['email'],
                            ],
                            [
                                'name' => $clientData['name'],
                                'phone' => $clientData['phone'],
                                'notes' => $clientData['notes'],
                            ],
                        );

                        return [$clientData['key'] => $client];
                    });

                foreach ($tenantData['reservations'] as $reservationData) {
                    $client = $clients->get($reservationData['client']);

                    Reservation::withoutTenancy()->updateOrCreate(
                        [
                            'tenant_id' => $tenant->id,
                            'client_id' => $client->id,
                        ],
                        [
                            'client_name' => $client->name,
                            'event_date' => $reservationData['event_date'],
                            'status' => $reservationData['status'],
                            'total_price' => $reservationData['total_price'],
                            'advance_amount' => $reservationData['advance_amount'],
                        ],
                    );
                }
            }
        });
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    private function tenants(): array
    {
        $baseDomain = config('tenancy.tenant_base_domain');

        return [
            [
                'id' => 'palais-nour',
                'name' => 'Palais Nour',
                'domain' => 'palais-nour.' . $baseDomain,
                'plan' => 'pro',
                'status' => 'active',
                'owner' => [
                    'name' => 'Amina Benali',
                    'email' => 'amina@palais-nour.test',
                ],
                'clients' => [
                    [
                        'key' => 'hadjer',
                        'name' => 'Hadjer Saadi',
                        'email' => 'hadjer.saadi@example.com',
                        'phone' => '+213 555 10 20 30',
                        'notes' => 'Prefere une decoration florale blanche et doree.',
                    ],
                    [
                        'key' => 'karim',
                        'name' => 'Karim Meziane',
                        'email' => 'karim.meziane@example.com',
                        'phone' => '+213 560 40 50 60',
                        'notes' => 'Evenement familial avec service traiteur complet.',
                    ],
                    [
                        'key' => 'sarah',
                        'name' => 'Sarah Bouchama',
                        'email' => 'sarah.bouchama@example.com',
                        'phone' => '+213 770 11 22 33',
                        'notes' => 'Demande une visite technique avant confirmation.',
                    ],
                ],
                'reservations' => [
                    [
                        'client' => 'hadjer',
                        'event_date' => Carbon::today()->addDays(9)->toDateString(),
                        'status' => 'confirmed',
                        'total_price' => 380000,
                        'advance_amount' => 120000,
                    ],
                    [
                        'client' => 'karim',
                        'event_date' => Carbon::today()->addDays(18)->toDateString(),
                        'status' => 'pending',
                        'total_price' => 260000,
                        'advance_amount' => 50000,
                    ],
                    [
                        'client' => 'sarah',
                        'event_date' => Carbon::today()->subDays(4)->toDateString(),
                        'status' => 'cancelled',
                        'total_price' => 180000,
                        'advance_amount' => 0,
                    ],
                ],
            ],
            [
                'id' => 'dar-elyas',
                'name' => 'Dar Elyas Events',
                'domain' => 'dar-elyas.' . $baseDomain,
                'plan' => 'standard',
                'status' => 'active',
                'owner' => [
                    'name' => 'Yacine Rahmani',
                    'email' => 'yacine@dar-elyas.test',
                ],
                'clients' => [
                    [
                        'key' => 'nour',
                        'name' => 'Nour Haddad',
                        'email' => 'nour.haddad@example.com',
                        'phone' => '+213 661 45 67 89',
                        'notes' => 'Souhaite une formule mariage pour 250 invites.',
                    ],
                    [
                        'key' => 'ines',
                        'name' => 'Ines Kaci',
                        'email' => 'ines.kaci@example.com',
                        'phone' => '+213 550 98 76 54',
                        'notes' => 'Anniversaire professionnel en soiree.',
                    ],
                ],
                'reservations' => [
                    [
                        'client' => 'nour',
                        'event_date' => Carbon::today()->addDays(6)->toDateString(),
                        'status' => 'confirmed',
                        'total_price' => 310000,
                        'advance_amount' => 100000,
                    ],
                    [
                        'client' => 'ines',
                        'event_date' => Carbon::today()->addDays(28)->toDateString(),
                        'status' => 'pending',
                        'total_price' => 145000,
                        'advance_amount' => 25000,
                    ],
                ],
            ],
            [
                'id' => 'riad-safir',
                'name' => 'Riad Safir',
                'domain' => 'riad-safir.' . $baseDomain,
                'plan' => 'standard',
                'status' => 'suspended',
                'owner' => [
                    'name' => 'Meriem Ouali',
                    'email' => 'meriem@riad-safir.test',
                ],
                'clients' => [
                    [
                        'key' => 'lyes',
                        'name' => 'Lyes Hamdi',
                        'email' => 'lyes.hamdi@example.com',
                        'phone' => '+213 699 12 34 56',
                        'notes' => 'Contrat a verifier avant remise en service.',
                    ],
                ],
                'reservations' => [
                    [
                        'client' => 'lyes',
                        'event_date' => Carbon::today()->addDays(35)->toDateString(),
                        'status' => 'pending',
                        'total_price' => 220000,
                        'advance_amount' => 30000,
                    ],
                ],
            ],
        ];
    }
}
