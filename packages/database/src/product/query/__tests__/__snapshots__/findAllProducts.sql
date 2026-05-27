-- [1] params: [-1,"0"]
SELECT
  `main`.`Product`.`productId`,
  `main`.`Product`.`name`,
  `main`.`Product`.`price`,
  `main`.`Product`.`catchCopy`
FROM
  `main`.`Product`
WHERE
  1 = 1
LIMIT
  ?
OFFSET
  ?
