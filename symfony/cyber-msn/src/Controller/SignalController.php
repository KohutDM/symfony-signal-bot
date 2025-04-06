<?php
namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

class SignalController extends AbstractController
{
    #[Route('/signal/message', name: 'signal_message', methods: ['POST'])]
    public function message(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $responseMessage = $this->processSignalMessage($data);

        return new JsonResponse(['response' => $responseMessage]);
    }

    protected function processSignalMessage(array $data): ?string
    {
        if (isset($data['envelope']['dataMessage']['message']) && strtolower($data['envelope']['dataMessage']['message']) === 'hello') {
            return 'World from Symfony!';
        }

        return null;
    }
}
