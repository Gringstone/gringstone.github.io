<?php

/** @var \App\Model\Stuff $stuff */
/** @var \App\Service\Router $router */

$title = "Edit Stuff {$stuff->getName()} ({$stuff->getId()})";
$bodyClass = "edit";

ob_start(); ?>
    <h1><?= $title ?></h1>
    <form action="<?= $router->generatePath('stuff-edit') ?>" method="post" class="edit-form">
        <?php require __DIR__ . DIRECTORY_SEPARATOR . '_form.html.php'; ?>
        <input type="hidden" name="action" value="stuff-edit">
        <input type="hidden" name="id" value="<?= $stuff->getId() ?>">
    </form>

    <ul class="action-list">
        <li>
            <a href="<?= $router->generatePath('stuff-index') ?>">Back to list</a></li>
        <li>
            <form action="<?= $router->generatePath('stuff-delete') ?>" method="post">
                <input type="submit" value="Delete" onclick="return confirm('Are you sure?')">
                <input type="hidden" name="action" value="stuff-delete">
                <input type="hidden" name="id" value="<?= $stuff->getId() ?>">
            </form>
        </li>
    </ul>

<?php $main = ob_get_clean();

include __DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'base.html.php';
