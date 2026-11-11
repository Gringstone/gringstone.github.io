<?php

namespace App\Model;

use App\Service\Config;

class Stuff
{
    private ?int $id = null;
    private ?string $name = null;
    private ?string $description = null;
    private ?int $quantity = null;
    private ?float $marketPrice = null;
    private ?string $lastPriceUpdate = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function setId(?int $id): void
    {
        $this->id = $id;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): self
    {
        $this->name = $name;
        return $this;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }
    public function setDescription(string $description): self
    {
        $this->description = $description;
        return $this;
    }
    public function getQuantity(): ?int
    {
        return $this->quantity;
    }
    public function setQuantity(int $quantity): self
    {
        $this->quantity = $quantity;
        return $this;
    }
    public function getMarketPrice(): ?float
    {
        return $this->marketPrice;
    }
    public function setMarketPrice(float $marketPrice): self
    {
        $this->marketPrice = $marketPrice;
        return $this;
    }
    public function getLastPriceUpdate(): ?string
    {
        return $this->lastPriceUpdate;
    }
    public function setLastPriceUpdate(string $lastPriceUpdate): self
    {
        $this->lastPriceUpdate = $lastPriceUpdate;
        return $this;
    }

    public static function fromArray($array): Stuff
    {
        $stuff = new self();
        $stuff->fill($array);

        return $stuff;
    }

    public function fill($array): Stuff
    {
        if (isset($array['id']) && ! $this->getId()) {
            $this->setId($array['id']);
        }
        if (isset($array['name'])) {
            $this->setName($array['name']);
        }
        if (isset($array['description'])) {
            $this->setDescription($array['description']);
        }
        if (isset($array['quantity'])) {
            $this->setQuantity($array['quantity']);
        }
        if (isset($array['market_price'])) {
            $this->setMarketPrice($array['market_price']);
        }
        if (isset($array['last_price_update'])) {
            $this->setLastPriceUpdate($array['last_price_update']);
        }

        return $this;
    }

    public static function findAll(): array
    {
        $pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
        $sql = 'SELECT * FROM stuff';
        $statement = $pdo->prepare($sql);
        $statement->execute();

        $stuffs = [];
        $stuffsArray = $statement->fetchAll(\PDO::FETCH_ASSOC);
        foreach ($stuffsArray as $stuffArray) {
            $stuffs[] = self::fromArray($stuffArray);
        }

        return $stuffs;
    }

    public static function find($id): ?Stuff
    {
        $pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
        $sql = 'SELECT * FROM stuff WHERE id = :id';
        $statement = $pdo->prepare($sql);
        $statement->execute(['id' => $id]);

        $stuffArray = $statement->fetch(\PDO::FETCH_ASSOC);
        if (! $stuffArray) {
            return null;
        }

        return Stuff::fromArray($stuffArray);
    }

    public function save(): void
    {
        $pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
        if (! $this->getId()) {
            $sql = "INSERT INTO stuff (name, description, quantity, market_price) VALUES (:name, :description, :quantity, :marketPrice)";
            $statement = $pdo->prepare($sql);
            $statement->execute([
                'name' => $this->getName(),
                'description' => $this->getDescription(),
                'quantity' => $this->getQuantity(),
                'marketPrice' => $this->getMarketPrice(),
            ]);

            $this->setId($pdo->lastInsertId());
        } else {
            $sql = "UPDATE stuff 
                SET name = :name, 
                    description = :description, 
                    quantity = :quantity, 
                    market_price = :marketPrice, 
                    last_price_update = CASE WHEN market_price <> :marketPrice
                    THEN current_date ELSE last_price_update END
                    WHERE id = :id";
            $statement = $pdo->prepare($sql);
            $statement->execute([
                ':name' => $this->getName(),
                ':description' => $this->getDescription(),
                ':quantity' => $this->getQuantity(),
                ':marketPrice' => $this->getMarketPrice(),
                ':id' => $this->getId(),
            ]);
        }
    }

    public function delete(): void
    {
        $pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
        $sql = "DELETE FROM stuff WHERE id = :id";
        $statement = $pdo->prepare($sql);
        $statement->execute([
            ':id' => $this->getId(),
        ]);

        $this->setId(null);
        $this->setName(null);
        $this->setDescription(null);
        $this->setQuantity(0);
        $this->setMarketPrice(0.0);
        $this->setLastPriceUpdate(null);
    }
}