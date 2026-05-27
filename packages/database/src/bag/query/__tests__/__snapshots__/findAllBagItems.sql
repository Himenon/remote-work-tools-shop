-- [1] params: [-1,"0"]
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
