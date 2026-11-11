<?php

namespace App\Controller;

use App\Exception\NotFoundException;
use App\Model\Stuff;
use App\Service\Router;
use App\Service\Templating;

class StuffController
{
    private function validate(array $data): array
    {
        $errors = [];

        if (trim($data['name'] ?? '') === '') {
            $errors['name'] = 'No name';
        }
        if (trim($data['description'] ?? '') === '') {
            $errors['description'] = 'No description';
        }
        if (filter_var($data['quantity'] ?? null, FILTER_VALIDATE_INT) === false || (int) $data['quantity'] < 0) {
            $errors['quantity'] = 'Bad quantity';
        }
        if (! is_numeric($data['market_price'] ?? null) || (float) $data['market_price'] < 0) {
            $errors['market_price'] = 'Bad price';
        }

        return $errors;
    }

    public function indexAction(Templating $templating, Router $router): ?string
    {
        $stuffs = Stuff::findAll();
        $html = $templating->render('stuff/index.html.php', [
            'stuffs' => $stuffs,
            'router' => $router,
        ]);
        return $html;
    }

    public function createAction(?array $requestStuff, Templating $templating, Router $router): ?string
    {
        $stuff = new Stuff();
        if ($requestStuff) {
            $errors = $this->validate($requestStuff);
            $stuff->fill($requestStuff);
            if (! $errors) {
                $stuff->save();

                $router->redirect($router->generatePath('stuff-index'));
                return null;
            }
            error_log(print_r($errors, true));
        }

        return $templating->render('stuff/create.html.php', [
            'stuff' => $stuff,
            'router' => $router,
        ]);
    }

    public function editAction(int $stuffId, ?array $requestStuff, Templating $templating, Router $router): ?string
    {
        $stuff = Stuff::find($stuffId);
        if (! $stuff) {
            throw new NotFoundException("Missing stuff with id $stuffId");
        }

        if ($requestStuff) {
            $errors = $this->validate($requestStuff);
            $stuff->fill($requestStuff);
            if (! $errors) {
                $stuff->save();

                $router->redirect($router->generatePath('stuff-index'));
                return null;
            } else {
                error_log(print_r($errors, true));
            }
            $stuff = new Stuff();
        }

        $html = $templating->render('stuff/edit.html.php', [
            'stuff' => $stuff,
            'router' => $router,
        ]);
        return $html;
    }

    public function showAction(int $stuffId, Templating $templating, Router $router): ?string
    {
        $stuff = Stuff::find($stuffId);
        if (! $stuff) {
            throw new NotFoundException("Missing stuff with id $stuffId");
        }

        $html = $templating->render('stuff/show.html.php', [
            'stuff' => $stuff,
            'router' => $router,
        ]);
        return $html;
    }

    public function deleteAction(int $stuffId, Router $router): ?string
    {
        $stuff = Stuff::find($stuffId);
        if (! $stuff) {
            throw new NotFoundException("Missing stuff with id $stuffId");
        }

        $stuff->delete();
        $path = $router->generatePath('stuff-index');
        $router->redirect($path);
        return null;
    }
}