<?php

/** @var \App\Model\Sklep[] $skleps */
/** @var \App\Service\Router $router */

$title = 'sklep List';
$bodyClass = 'index';

ob_start(); ?>
    <h1>skleps List</h1>

    <a href="<?= $router->generatePath('sklep-create') ?>">Create new</a>

    <ul class="index-list">
        <?php foreach ($skleps as $sklep): ?>
            <li><h3><?= $sklep->getNazwa() ?></h3>
                <ul class="action-list">
                    <li><a href="<?= $router->generatePath('sklep-show', ['id' => $sklep->getId()]) ?>">Details</a></li>
                    <li><a href="<?= $router->generatePath('sklep-edit', ['id' => $sklep->getId()]) ?>">Edit</a></li>
                </ul>
            </li>
        <?php endforeach; ?>
    </ul>
<?php $main = ob_get_clean();

include __DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'base.html.php';
