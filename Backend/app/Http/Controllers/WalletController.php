<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Wallet;

class WalletController extends Controller
{
    public function show(Request $request)
    {
        $wallet = $request->user()->wallet()->with('transactions')->firstOrCreate(['user_id' => $request->user()->id]);
        return response()->json($wallet);
    }

    public function recharge(Request $request)
    {
        // For Development/Demo purposes only
        $request->validate(['amount' => 'required|numeric|min:1']);
        
        $wallet = $request->user()->wallet()->firstOrCreate(['user_id' => $request->user()->id]);
        
        $wallet->increment('balance', $request->amount);
        
        $wallet->transactions()->create([
            'amount' => $request->amount,
            'type' => 'deposit',
            'description' => 'Recarga de prueba',
            'reference_type' => 'system',
            'reference_id' => 0
        ]);

        return response()->json(['message' => 'Saldo recargado', 'wallet' => $wallet]);
    }
}
