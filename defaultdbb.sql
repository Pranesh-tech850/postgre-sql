SELECT column_name
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'orders'
ORDER BY ordinal_position;


ALTER TABLE public.orders
ADD COLUMN email VARCHAR(255);

UPDATE public.orders
SET email = 'user' || id || '@gmail.com';

SELECT id, email
FROM public.orders
ORDER BY id
LIMIT 10;

SELECT *
FROM orders



SELECT id, email
FROM orders
WHERE email = 'user2@gmail.com';

ALTER TABLE orders
ADD COLUMN IF NOT EXISTS email VARCHAR(255);

SELECT COUNT(*) FROM public.orders;
SELECT id, customer_name, email
FROM public.orders
LIMIT 10;