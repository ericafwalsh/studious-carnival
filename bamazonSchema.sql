create database bamazon;

create table products (
	item_id integer not null auto_increment,
    product_name varchar(50) not null,
    department_name varchar(30),
    price decimal(10,2) not null,
    stock_quantity integer(10) not null,
    product_sales integer(20) default 0,
    primary key (item_id)
);

create table departments (
	department_id integer not null auto_increment,
    department_name varchar(50) not null,
    over_head_costs integer(10) not null,
    primary key (department_id)
);