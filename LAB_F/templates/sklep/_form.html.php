<?php
    /** @var $sklep ?\App\Model\Sklep */
?>

<div class="form-group">
    <label for="nazwa">Nazwa</label>
    <input type="text" id="nazwa" name="sklep[nazwa]" value="<?= $sklep ? $sklep->getNazwa() : '' ?>">
</div>

<div class="form-group">
    <label for="opis">Opis</label>
    <textarea id="opis" name="sklep[opis]"><?= $sklep? $sklep->getOpis() : '' ?></textarea>
</div>

<div class="form-group">
    <label></label>
    <input type="submit" value="Submit">
</div>
