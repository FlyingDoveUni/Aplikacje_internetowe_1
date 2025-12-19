<?php

/** @var \App\Model\Sklep $sklep */
/** @var \App\Service\Router $router */

$title = "{$sklep->getNazwa()} ({$sklep->getId()})";
$bodyClass = 'show';

ob_start(); ?>
    <h1><?= $sklep->getNazwa() ?></h1>
    <article>
        <?= $sklep->getOpis();?>
    </article>

    <ul class="action-list">
        <li> <a href="<?= $router->generatePath('sklep-index') ?>">Back to list</a></li>
        <li><a href="<?= $router->generatePath('sklep-edit', ['id'=> $sklep->getId()]) ?>">Edit</a></li>
    </ul>
<?php $main = ob_get_clean();

include __DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'base.html.php';
