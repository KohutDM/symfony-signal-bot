<?php

namespace App\Service;

use App\Entity\Account;
use App\Repository\AccountRepository;

class AccountProcessor
{
    private AccountRepository $accountRepository;

    public function __construct(AccountRepository $accountRepository)
    {
        $this->accountRepository = $accountRepository;
    }

    public function processAccountCommand(string $message): ?string
    {
        $command = explode('_', explode('/', $message)[0])[1];
        switch ($command) {
            case 'create':
                return $this->createAccount(
                    explode('/', $message)[1],
                    explode('/', $message)[2]
                );
            case 'get':
                return $this->getAccount(explode('/', $message)[1]);
            case 'update':
                return $this->updateAccount(
                    explode('/', $message)[1],
                    explode('/', $message)[2]
                );
            case 'delete':
                return $this->deleteAccount(explode('/', $message)[1]);
        }

        return null;
    }

    private function createAccount(string $nickname, string $phone): string
    {
        $existingAccount = $this->accountRepository->findOneBy(['phone' => $phone]);

        if ($existingAccount) {
            return "Акаунт з таким номером існує";
        }

        $account = new Account();
        $account->setPhone($phone);
        $account->setNickname($nickname);

        $this->accountRepository->create($account);

        return 'Акаунт успішно створено';
    }

    private function getAccount(string $phone): string
    {
        $account = $this->accountRepository->findOneBy(['phone' => $phone]);

        if ($account) {
            return $account->getNickname();
        }

        return 'Такого акаунта не існує';
    }

    private function updateAccount(string $nickname, string $phone): string
    {
        $account = $this->accountRepository->findOneBy(['phone' => $phone]);

        if ($account) {
            $account->setPhone($phone);
            $account->setNickname($nickname);
            $this->accountRepository->update($account);

            return 'Акаунт успішно оновлено';
        }

        return 'Такого акаунта не існує';
    }

    private function deleteAccount(string $phone): string
    {
        $account = $this->accountRepository->findOneBy(['phone' => $phone]);

        if ($account) {
            $this->accountRepository->delete($account);

            return 'Акаунт успішно видалено';
        }

        return 'Такого акаунта не існує';
    }
}
