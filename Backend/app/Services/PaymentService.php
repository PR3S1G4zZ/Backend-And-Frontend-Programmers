<?php

namespace App\Services;

use App\Models\User;
use App\Models\Wallet;
use App\Models\Transaction;
use Illuminate\Support\Facades\DB;
use Exception;

class PaymentService
{
    /**
     * Calculate commission rate based on amount.
     * < $500: 20%
     * >= $500: 15%
     */
    public function getCommissionRate(float $amount): float
    {
        return $amount < 500 ? 0.20 : 0.15;
    }

    /**
     * Fund a project (Initial 50% deposit or full amount).
     * Moves funds from Company Wallet to Company Held Balance (Escrow).
     */
    public function fundProject(User $company, float $amount, $project)
    {
         $wallet = $this->getWallet($company);
         if ($wallet->balance < $amount) {
             throw new Exception("Saldo insuficiente. Requerido: \${$amount}, Disponible: \${$wallet->balance}");
         }

         DB::transaction(function () use ($wallet, $amount, $project) {
             $wallet->decrement('balance', $amount);
             $wallet->increment('held_balance', $amount);

             $this->createTransaction($wallet, -$amount, 'escrow_deposit', "Depósito en Garantía Proyecto #{$project->id}", $project);
         });
    }

    /**
     * Release funds for a Milestone (or Project Completion).
     * Moves funds from Company Held Balance to Developer Wallet (minus commission).
     */
    public function releaseMilestone(User $company, User $developer, float $amount, $project)
    {
        $companyWallet = $this->getWallet($company);
        
        if ($companyWallet->held_balance < $amount) {
            throw new Exception("Fondos en garantía insuficientes. Requerido: \${$amount}, En garantía: \${$companyWallet->held_balance}");
        }

        $rate = $this->getCommissionRate($amount);
        $commission = $amount * $rate;
        $netAmount = $amount - $commission;

        DB::transaction(function () use ($companyWallet, $developer, $amount, $netAmount, $commission, $project) {
            // 1. Deduct from Held Balance
            $companyWallet->decrement('held_balance', $amount);

            // 2. Add to Developer
            $devWallet = $this->getWallet($developer);
            $devWallet->increment('balance', $netAmount);

            // 3. Add Commission to Admin
            $adminWallet = $this->getAdminWallet();
            if ($adminWallet) {
                $adminWallet->increment('balance', $commission);
                $this->createTransaction($adminWallet, $commission, 'commission', "Comisión Proyecto #{$project->id}", $project);
            }

            // Record Transactions
            // Log release from Company perspective (already deducted from held, but log the event)
            $this->createTransaction($companyWallet, 0, 'escrow_release', "Liberación de fondos Proyecto #{$project->id}", $project);

            // Log deposit to Developer
            $this->createTransaction($devWallet, $netAmount, 'payment_received', "Pago recibido Proyecto #{$project->id}", $project);
        });
    }

    // --- Legacy / Helper Methods ---

    public function holdFunds(User $company, float $amount, $reference)
    {
        $this->fundProject($company, $amount, $reference);
    }

    public function releaseFunds(User $company, User $developer, float $amount, $reference)
    {
        $this->releaseMilestone($company, $developer, $amount, $reference);
    }

    public function processProjectPayment(User $company, User $developer, float $amount, $reference)
    {
        $this->holdFunds($company, $amount, $reference);
        $this->releaseFunds($company, $developer, $amount, $reference);
    }

    public function getWallet(User $user): Wallet
    {
        return $user->wallet()->firstOrCreate(['user_id' => $user->id], ['balance' => 0]);
    }

    protected function getAdminWallet()
    {
        $admin = User::where('role', 'admin')->first();
        return $admin ? $this->getWallet($admin) : null;
    }

    protected function createTransaction(Wallet $wallet, float $amount, string $type, string $description, $reference)
    {
        $wallet->transactions()->create([
            'amount' => $amount,
            'type' => $type,
            'description' => $description,
            'reference_type' => get_class($reference),
            'reference_id' => $reference->id,
        ]);
    }
}
