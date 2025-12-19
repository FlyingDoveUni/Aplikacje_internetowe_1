<?php
namespace App\Model;

use App\Service\Config;

class Sklep
{
    private ?int $id = null;
    private ?string $nazwa = null;
    private ?string $opis = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function setId(?int $id): Sklep
    {
        $this->id = $id;

        return $this;
    }

    public function getNazwa(): ?string
    {
        return $this->nazwa;
    }

    public function setNazwa(?string $nazwa): Sklep
    {
        $this->nazwa = $nazwa;

        return $this;
    }

    public function getOpis(): ?string
    {
        return $this->opis;
    }

    public function setOpis(?string $opis): Sklep
    {
        $this->opis = $opis;

        return $this;
    }

    public static function fromArray($array): Sklep
    {
        $sklep = new self();
        $sklep->fill($array);

        return $sklep;
    }

    public function fill($array): Sklep
    {
        if (isset($array['id']) && ! $this->getId()) {
            $this->setId($array['id']);
        }
        if (isset($array['nazwa'])) {
            $this->setNazwa($array['nazwa']);
        }
        if (isset($array['opis'])) {
            $this->setOpis($array['opis']);
        }

        return $this;
    }

    public static function findAll(): array
    {
        $pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
        $sql = 'SELECT * FROM sklep';
        $statement = $pdo->prepare($sql);
        $statement->execute();

        $skleps = [];
        $sklepsArray = $statement->fetchAll(\PDO::FETCH_ASSOC);
        foreach ($sklepsArray as $sklepArray) {
            $skleps[] = self::fromArray($sklepArray);
        }

        return $skleps;
    }

    public static function find($id): ?Sklep
    {
        $pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
        $sql = 'SELECT * FROM sklep WHERE id = :id';
        $statement = $pdo->prepare($sql);
        $statement->execute(['id' => $id]);

        $sklepArray = $statement->fetch(\PDO::FETCH_ASSOC);
        if (! $sklepArray) {
            return null;
        }
        $sklep = Sklep::fromArray($sklepArray);

        return $sklep;
    }

    public function save(): void
    {
        $pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
        if (! $this->getId()) {
            $sql = "INSERT INTO sklep (nazwa, opis) VALUES (:nazwa, :opis)";
            $statement = $pdo->prepare($sql);
            $statement->execute([
                'nazwa' => $this->getNazwa(),
                'opis' => $this->getOpis(),
            ]);

            $this->setId($pdo->lastInsertId());
        } else {
            $sql = "UPDATE sklep SET nazwa = :nazwa, opis = :opis WHERE id = :id";
            $statement = $pdo->prepare($sql);
            $statement->execute([
                ':nazwa' => $this->getNazwa(),
                ':opis' => $this->getOpis(),
                ':id' => $this->getId(),
            ]);
        }
    }

    public function delete(): void
    {
        $pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
        $sql = "DELETE FROM sklep WHERE id = :id";
        $statement = $pdo->prepare($sql);
        $statement->execute([
            ':id' => $this->getId(),
        ]);

        $this->setId(null);
        $this->setNazwa(null);
        $this->setOpis(null);
    }
}
