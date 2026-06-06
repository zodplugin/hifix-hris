<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Setting;
use Illuminate\Support\Facades\Auth;

class SettingsController extends Controller
{
    public function index()
    {
        // Protect for admin only
        if (Auth::user()->role !== 'admin') {
            abort(403, 'Unauthorized action.');
        }

        $settings = Setting::pluck('value', 'key')->toArray();
        if (isset($settings['company_signature'])) {
            $settings['company_signature_url'] = asset('storage/' . $settings['company_signature']);
        } else {
            $settings['company_signature_url'] = null;
        }

        return Inertia::render('Settings/Index', [
            'settings' => $settings,
        ]);
    }

    public function update(Request $request)
    {
        // Protect for admin only
        if (Auth::user()->role !== 'admin') {
            abort(403, 'Unauthorized action.');
        }

        $request->validate([
            'office_lat' => 'required|numeric',
            'office_lng' => 'required|numeric',
            'office_radius' => 'required|numeric|min:10',
            'clock_in_limit' => 'required|string',
            'company_signature_file' => 'nullable|file|image|max:1024',
            'company_signature_base64' => 'nullable|string',
        ]);

        Setting::updateOrCreate(['key' => 'office_lat'], ['value' => $request->office_lat]);
        Setting::updateOrCreate(['key' => 'office_lng'], ['value' => $request->office_lng]);
        Setting::updateOrCreate(['key' => 'office_radius'], ['value' => $request->office_radius]);
        Setting::updateOrCreate(['key' => 'clock_in_limit'], ['value' => $request->clock_in_limit]);

        if ($request->filled('company_signature_base64')) {
            $photoData = $request->input('company_signature_base64');
            $photoData = str_replace('data:image/png;base64,', '', $photoData);
            $photoData = str_replace(' ', '+', $photoData);
            $photoData = base64_decode($photoData);

            $path = 'company/sig_' . time() . '.png';
            \Illuminate\Support\Facades\Storage::disk('public')->put($path, $photoData);
            Setting::updateOrCreate(['key' => 'company_signature'], ['value' => $path]);
        } elseif ($request->hasFile('company_signature_file')) {
            $path = $request->file('company_signature_file')->store('company', 'public');
            Setting::updateOrCreate(['key' => 'company_signature'], ['value' => $path]);
        }

        return redirect()->back()->with('success', 'Pengaturan berhasil diperbarui!');
    }
}
