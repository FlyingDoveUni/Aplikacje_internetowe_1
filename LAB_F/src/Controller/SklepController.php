<?php
namespace App\Controller;

use App\Exception\NotFoundException;
use App\Model\Sklep;
use App\Service\Router;
use App\Service\Templating;

class SklepController
{
    public function indexAction(Templating $templating, Router $router): ?string
    {
        $skleps = Sklep::findAll();
        $html = $templating->render('sklep/index.html.php', [
            'skleps' => $skleps,
            'router' => $router,
        ]);
        return $html;
    }

    public function createAction(?array $requestSklep, Templating $templating, Router $router): ?string
    {
        if ($requestSklep) {
            $sklep = Sklep::fromArray($requestSklep);
            // @todo missing validation
            $sklep->save();

            $path = $router->generatePath('sklep-index');
            $router->redirect($path);
            return null;
        } else {
            $sklep = new Sklep();
        }

        $html = $templating->render('sklep/create.html.php', [
            'sklep' => $sklep,
            'router' => $router,
        ]);
        return $html;
    }

    public function editAction(int $sklepId, ?array $requestSklep, Templating $templating, Router $router): ?string
    {
        $sklep = Sklep::find($sklepId);
        if (! $sklep) {
            throw new NotFoundException("Missing sklep with id $sklepId");
        }

        if ($requestSklep) {
            $sklep->fill($requestSklep);
            // @todo missing validation
            $sklep->save();

            $path = $router->generatePath('sklep-index');
            $router->redirect($path);
            return null;
        }

        $html = $templating->render('sklep/edit.html.php', [
            'sklep' => $sklep,
            'router' => $router,
        ]);
        return $html;
    }

    public function showAction(int $sklepId, Templating $templating, Router $router): ?string
    {
        $sklep = Sklep::find($sklepId);
        if (! $sklep) {
            throw new NotFoundException("Missing sklep with id $sklepId");
        }

        $html = $templating->render('sklep/show.html.php', [
            'sklep' => $sklep,
            'router' => $router,
        ]);
        return $html;
    }

    public function deleteAction(int $sklepId, Router $router): ?string
    {
        $sklep = Sklep::find($sklepId);
        if (! $sklep) {
            throw new NotFoundException("Missing sklep with id $sklepId");
        }

        $sklep->delete();
        $path = $router->generatePath('sklep-index');
        $router->redirect($path);
        return null;
    }
}
