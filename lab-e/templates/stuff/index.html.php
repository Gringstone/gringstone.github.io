<?php

/** @var \App\Model\Stuff[] $stuffs  */
/** @var \App\Service\Router $router */

$title = 'Stuff List';
$bodyClass = 'index';

ob_start(); ?>
    <h1>Stuff List</h1>

    <a href="<?= $router->generatePath('stuff-create') ?>">Create new</a>

    <ul class="index-list">
        <?php foreach ($stuffs as $stuff): ?>
            <li><h3><?= $stuff->getName() ?></h3>
                <ul class="action-list">
                    <li><a href="<?= $router->generatePath('stuff-show', ['id' => $stuff->getId()]) ?>">Details</a></li>
                    <li><a href="<?= $router->generatePath('stuff-edit', ['id' => $stuff->getId()]) ?>">Edit</a></li>
                </ul>
            </li>
        <?php endforeach; ?>
    </ul>

<?php $main = ob_get_clean();

include __DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'base.html.php';
