<?php

namespace App\Repository;

use App\Entity\Account;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;
use Doctrine\ORM\EntityManagerInterface;

class AccountRepository extends ServiceEntityRepository
{
    private EntityManagerInterface $entityManager;

    public function __construct(ManagerRegistry $registry, EntityManagerInterface $entityManager)
    {
        parent::__construct($registry, Account::class);
        $this->entityManager = $entityManager;
    }

    public function create(Account $account): void
    {
        $this->entityManager->persist($account);
        $this->entityManager->flush();
    }

    public function findAll(): array
    {
        return $this->findAll();
    }

    public function update(Account $account): void
    {
        $this->entityManager->flush();
    }

    public function delete(Account $account): void
    {
        $this->entityManager->remove($account);
        $this->entityManager->flush();
    }
}
