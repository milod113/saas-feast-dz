<?php

namespace App\Http\Controllers\Tenant;

use App\Http\Controllers\Controller;
use App\Models\Tenant;
use App\Models\TenantPhoto;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class TenantProfileController extends Controller
{
    public function edit(): Response
    {
        $tenant = $this->currentTenant()->load('photos');

        return Inertia::render('Tenant/Profile/EditTenantProfile', [
            'tenant' => $this->tenantPayload($tenant),
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $tenant = $this->currentTenant()->load('photos');
        $data = $this->validateTenantProfile($request);
        $photoFiles = $request->file('photos', []);
        $deletePhotoIds = collect($data['delete_photo_ids'] ?? [])->map(fn ($id) => (int) $id)->all();

        unset($data['photos'], $data['delete_photo_ids']);

        DB::transaction(function () use ($tenant, $data, $photoFiles, $deletePhotoIds): void {
            $tenant->update($data);

            if ($deletePhotoIds !== []) {
                $photosToDelete = $tenant->photos()->whereIn('id', $deletePhotoIds)->get();

                foreach ($photosToDelete as $photo) {
                    Storage::disk('public')->delete($photo->path);
                    $photo->delete();
                }
            }

            $nextSortOrder = (int) ($tenant->photos()->max('sort_order') ?? -1) + 1;

            foreach ($photoFiles as $photoFile) {
                $path = $photoFile->store("tenant-photos/{$tenant->id}", 'public');

                $tenant->photos()->create([
                    'path' => $path,
                    'sort_order' => $nextSortOrder++,
                ]);
            }
        });

        return redirect()
            ->route('tenant.profile.edit')
            ->with('success', 'Profil de la salle mis a jour avec succes.');
    }

    protected function currentTenant(): Tenant
    {
        return Tenant::query()->findOrFail(tenant('id'));
    }

    protected function validateTenantProfile(Request $request): array
    {
        return $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'wilaya' => ['nullable', 'string', 'max:255'],
            'commune' => ['nullable', 'string', 'max:255'],
            'address' => ['nullable', 'string', 'max:2000'],
            'gps_latitude' => ['nullable', 'string', 'max:255'],
            'gps_longitude' => ['nullable', 'string', 'max:255'],
            'phone_primary' => ['nullable', 'string', 'max:50'],
            'phone_secondary' => ['nullable', 'string', 'max:50'],
            'capacity_max' => ['nullable', 'integer', 'min:0'],
            'has_separated_spaces' => ['boolean'],
            'parking_capacity' => ['nullable', 'integer', 'min:0'],
            'has_generator' => ['boolean'],
            'has_air_conditioning' => ['boolean'],
            'allow_outside_caterer' => ['boolean'],
            'instagram_url' => ['nullable', 'url', 'max:255'],
            'tiktok_url' => ['nullable', 'url', 'max:255'],
            'photos' => ['nullable', 'array'],
            'photos.*' => ['image', 'max:5120'],
            'delete_photo_ids' => ['nullable', 'array'],
            'delete_photo_ids.*' => [
                'integer',
                Rule::exists('tenant_photos', 'id')->where('tenant_id', tenant('id')),
            ],
        ]);
    }

    protected function tenantPayload(Tenant $tenant): array
    {
        return [
            'id' => $tenant->id,
            'name' => $tenant->name,
            'plan' => $tenant->plan,
            'status' => $tenant->status,
            'domain' => request()->getHost(),
            'wilaya' => $tenant->wilaya,
            'commune' => $tenant->commune,
            'address' => $tenant->address,
            'gps_latitude' => $tenant->gps_latitude,
            'gps_longitude' => $tenant->gps_longitude,
            'phone_primary' => $tenant->phone_primary,
            'phone_secondary' => $tenant->phone_secondary,
            'capacity_max' => $tenant->capacity_max,
            'has_separated_spaces' => $tenant->has_separated_spaces,
            'parking_capacity' => $tenant->parking_capacity,
            'has_generator' => $tenant->has_generator,
            'has_air_conditioning' => $tenant->has_air_conditioning,
            'allow_outside_caterer' => $tenant->allow_outside_caterer,
            'instagram_url' => $tenant->instagram_url,
            'tiktok_url' => $tenant->tiktok_url,
            'photos' => $tenant->photos->map(fn (TenantPhoto $photo) => [
                'id' => $photo->id,
                'url' => Storage::disk('public')->url($photo->path),
                'path' => $photo->path,
            ])->values(),
        ];
    }
}
