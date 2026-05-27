-- [1] params: ["add-test-product","1","0"]
SELECT
  `main`.`BagItem`.`id`,
  `main`.`BagItem`.`productId`,
  `main`.`BagItem`.`specs`,
  `main`.`BagItem`.`count`
FROM
  `main`.`BagItem`
WHERE
  (
    `main`.`BagItem`.`productId` = ?
    AND 1 = 1
  )
LIMIT
  ?
OFFSET
  ?

-- [2] params: [-1,"0"]
SELECT
  COUNT(*) AS `_count$_all`
FROM
  (
    SELECT
      `main`.`BagItem`.`id`
    FROM
      `main`.`BagItem`
    WHERE
      1 = 1
    LIMIT
      ?
    OFFSET
      ?
  ) AS `sub`

-- [3] params: ["add-test-product","{\"color\":\"silver\"}",2]
INSERT INTO
  `main`.`BagItem` (`productId`, `specs`, `count`)
VALUES
  (?, ?, ?)
RETURNING
  `id` AS `id`,
  `productId` AS `productId`,
  `specs` AS `specs`,
  `count` AS `count`

-- [4] params: [-1,"0"]
SELECT
  `main`.`BagItem`.`id`,
  `main`.`BagItem`.`productId`,
  `main`.`BagItem`.`specs`,
  `main`.`BagItem`.`count`
FROM
  `main`.`BagItem`
WHERE
  1 = 1
LIMIT
  ?
OFFSET
  ?
