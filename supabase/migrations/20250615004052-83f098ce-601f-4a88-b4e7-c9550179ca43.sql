
-- Converter o usuário brunogandrade1966@gmail.com para admin
UPDATE public.profiles 
SET user_type = 'admin'::user_type 
WHERE email = 'brunogandrade1966@gmail.com';
