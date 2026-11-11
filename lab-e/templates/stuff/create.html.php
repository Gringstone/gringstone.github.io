<?php

/** @var \App\Model\Stuff $stuff */
/** @var \App\Service\Router $router */

$title = 'Create Stuff';
$bodyClass = "edit";

ob_start(); ?>
    <h1>Create Stuff</h1>
    <form action="<?= $router->generatePath('stuff-create') ?>" method="post" class="edit-form">
        <?php require __DIR__ . DIRECTORY_SEPARATOR . '_form.html.php'; ?>
        <input type="hidden" name="action" value="stuff-create">
    </form>

    <a href="<?= $router->generatePath('stuff-index') ?>">Back to list</a>
<?php $main = ob_get_clean();

include __DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'base.html.php';
