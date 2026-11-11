<?php
    /** @var $stuff ?\App\Model\Stuff */
?>

<div class="form-group">
    <label for="name">Name</label>
    <input type="text" id="name" name="post[name]" value="<?= $stuff ? $stuff->getName() : '' ?>">
</div>

<div class="form-group">
    <label for="description">Description</label>
    <textarea id="description" name="post[description]"><?= $stuff ? $stuff->getDescription() : '' ?></textarea>
</div>

<div class="form-group">
    <label for="quantity">Quantity</label>
    <input type="number" id="quantity" name="post[quantity]" min="0" step="1" value="<?= $stuff ? $stuff->getQuantity() : '' ?>">
</div>

<div class="form-group">
    <label for="market_price">Market price</label>
    <input type="number" id="market_price" name="post[market_price]" min="0" step="0.01" value="<?= $stuff ? $stuff->getMarketPrice() : '' ?>">
</div>

<div class="form-group">
    <label></label>
    <input type="submit" value="Submit">
</div>
