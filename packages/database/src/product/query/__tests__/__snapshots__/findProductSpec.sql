-- [1] params: ["prod-spec-test","1","0"]
SELECT
  `main`.`Product`.`productId`,
  `main`.`Product`.`name`,
  `main`.`Product`.`price`,
  `main`.`Product`.`catchCopy`,
  `main`.`Product`.`category`,
  `main`.`Product`.`spec`
FROM
  `main`.`Product`
WHERE
  (
    `main`.`Product`.`productId` = ?
    AND 1 = 1
  )
LIMIT
  ?
OFFSET
  ?
