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

-- [2] params: [3,"add-test-product"]
UPDATE `main`.`BagItem`
SET
  `count` = ?
WHERE
  (
    `main`.`BagItem`.`productId` = ?
    AND 1 = 1
  )
RETURNING
  `id` AS `id`,
  `productId` AS `productId`,
  `specs` AS `specs`,
  `count` AS `count`

-- [3] params: [-1,"0"]
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
