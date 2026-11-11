<?php

/** @var \App\Model\Stuff $stuff */
/** @var \App\Service\Router $router */

$title = "{$stuff->getName()} ({$stuff->getId()})";
$bodyClass = 'show';

ob_start(); ?>
    <h1><?= $stuff->getName() ?></h1>
    <article>
        <?= $stuff->getDescription(); ?>
    </article>

    <dl>
        <dt>Quantity</dt>
        <dd><?= $stuff->getQuantity() ?></dd>
        <dt>Market price</dt>
        <dd><?= $stuff->getMarketPrice() ?></dd>
        <dt>Last price update</dt>
        <dd><?= $stuff->getLastPriceUpdate() ?? '—' ?></dd>
    </dl>

    <ul class="action-list">
        <li> <a href="<?= $router->generatePath('stuff-index') ?>">Back to list</a></li>
        <li><a href="<?= $router->generatePath('stuff-edit', ['id'=> $stuff->getId()]) ?>">Edit</a></li>
    </ul>
<?php $main = ob_get_clean();

include __DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'base.html.php';
