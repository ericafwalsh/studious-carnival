create database bamazon;

use bamazon;

create table products (
	item_id integer not null auto_increment,
    product_name varchar(50) not null,
    department_name varchar(30),
    price integer(10) not null,
    stock_quantity integer(10) not null,
    primary key (item_id)
);

INSERT INTO products (product_sales)
VALUES (0),(0),(0),(0),(0),(0),(0),(0),(0),(0),(0),(0);

use bamazon;
select * from products;

ALTER TABLE products
ADD COLUMN product_sales integer(20) default 0;

use bamazon;
create table departments (
	department_id integer not null auto_increment,
    department_name varchar(50) not null,
    over_head_costs integer(10) not null,
    primary key (department_id)
);

select department_id, d.department_name, over_head_costs, 
sum(product_sales) as Ttl_Product_Sales,
(sum(product_sales) - over_head_costs) as total_profit
from departments as d
join products as p
on d.department_name = p.department_name
group by d.department_name;


select * from products;

