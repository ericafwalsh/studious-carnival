create database bamazon;

use bamazon;

create table products (
	item_id integer not null auto_increment,
    product_name varchar(50) not null,
    department_name varchar(30),
    price decimal(10,2) not null,
    stock_quantity integer(10) not null,
    primary key (item_id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("glasses","accessories",15,20),("water bottle","sporting goods",7,30),("head phones","electronics",50,10),("cell phone charger","electronics",10,32),
("running watch","sporting goods",120,13),("cat bed","pets",25,27),("slippers","accessories",22,15),("speakers","electronics",67,42),("notepad","office supplies",7,48),("chocolate bar","grocery",6,72);

use bamazon;
select * from products;

ALTER TABLE products
MODIFY COLUMN price decimal(10,2);