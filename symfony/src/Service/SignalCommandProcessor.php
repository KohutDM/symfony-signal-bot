<?php

namespace App\Service;

class SignalCommandProcessor
{
    private AccountProcessor $accountProcessor;
    private array $signalCommands;

    public function __construct(AccountProcessor $accountProcessor, array $signalCommands)
    {
        $this->accountProcessor = $accountProcessor;
        $this->signalCommands = $signalCommands;
    }

    public function process(array $data): string
    {
        $message = $data['envelope']['dataMessage']['message'];
        $command = explode('/', $message)[0];
        if (!$command) {
            return '';
        }

        $processor = explode('_', $message)[0];
        if (!$processor) {
            return '';
        }

        foreach ($this->signalCommands as $commandGroup) {
            if (in_array($command, $commandGroup['command']) && $processor == 'account') {
                return $this->accountProcessor->processAccountCommand($message);
            }
        }

        return '';
    }
}