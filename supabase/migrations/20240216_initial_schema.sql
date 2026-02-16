-- Create a table for public profiles (extends auth.users)
create table profiles (
  id uuid references auth.users on delete cascade not null primary key,
  updated_at timestamp with time zone,
  username text unique,
  full_name text,
  avatar_url text,
  birth_date date,
  birth_time time,
  birth_place text,
  
  constraint username_length check (char_length(username) >= 3)
);

-- Set up Row Level Security (RLS)
alter table profiles enable row level security;

create policy "Public profiles are viewable by everyone."
  on profiles for select
  using ( true );

create policy "Users can insert their own profile."
  on profiles for insert
  with check ( auth.uid() = id );

create policy "Users can update own profile."
  on profiles for update
  using ( auth.uid() = id );

-- Table for the 72 Names of God
create table wisdom_72_names (
    id serial primary key,
    number integer not null unique,
    triad text not null, -- The 3 Hebrew letters
    transliteration text not null,
    meaning text not null,
    meditation_instruction text,
    image_url text
);

alter table wisdom_72_names enable row level security;
create policy "72 Names are readable by everyone"
    on wisdom_72_names for select using (true);

-- Table for Kabbalistic Zodiac
create table zodiac_signs (
    id serial primary key,
    hebrew_month text not null unique,
    sign_name text not null,
    hebrew_letter text not null,
    ruling_planet text not null,
    element text,
    description text
);

alter table zodiac_signs enable row level security;
create policy "Zodiac signs are readable by everyone"
    on zodiac_signs for select using (true);

-- Functions
-- Function to handle new user creation
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql security definer;

-- Trigger the function every time a user is created
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
