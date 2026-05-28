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
        ]);

        Setting::updateOrCreate(['key' => 'office_lat'], ['value' => $request->office_lat]);
        Setting::updateOrCreate(['key' => 'office_lng'], ['value' => $request->office_lng]);
        Setting::updateOrCreate(['key' => 'office_radius'], ['value' => $request->office_radius]);

        return redirect()->back()->with('success', 'Pengaturan berhasil diperbarui!');
    }
}
