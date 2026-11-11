create table post
(
    id      integer not null
        constraint post_pk
            primary key autoincrement,
    subject text not null,
    content text not null
);

create table stuff
(
  id integer not null
    constraint stuff_pk
      primary key autoincrement,
  name text not null,
  description text not null,
  quantity integer null default 0,
  market_price decimal(6,2) null default 0.00,
  last_price_update date not null default current_date
);
