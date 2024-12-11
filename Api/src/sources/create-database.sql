CREATE TABLE 'Products' (
'id' INTEGER DEFAULT NULL PRIMARY KEY AUTOINCREMENT,
'Name' VARCHAR(256) DEFAULT NULL,
'Name_ZH' VARCHAR(256) DEFAULT NULL,
'Description' VARCHAR(256) DEFAULT NULL,
'Code' VARCHAR(64) DEFAULT NULL,
'BarCode' VARCHAR(64) DEFAULT NULL,
'OriginProductId' INTEGER DEFAULT NULL REFERENCES 'OriginProducts' ('id'),
'LocationId' INTEGER DEFAULT NULL REFERENCES 'Locations' ('id'),
'Deleted' BOOLEAN DEFAULT NULL,
'ModifyDate' DATETIME DEFAULT NULL
);

CREATE TABLE 'StockProducts' (
'id' INTEGER DEFAULT NULL PRIMARY KEY AUTOINCREMENT,
'Quantity' INTEGER(10) NOT NULL  DEFAULT 0,
'ProductId' INTEGER(10) NOT NULL  DEFAULT NULL REFERENCES 'Products' ('id') ON DELETE CASCADE,
'ModifyDate' DATETIME DEFAULT NULL
);

CREATE TABLE 'OriginProducts' (
'id' INTEGER DEFAULT NULL PRIMARY KEY AUTOINCREMENT,
'Name' VARCHAR(256) DEFAULT NULL
);

CREATE TABLE 'Categories' (
'id' INTEGER DEFAULT NULL PRIMARY KEY AUTOINCREMENT,
'Name' VARCHAR(128) DEFAULT NULL,
'Name_ZH' VARCHAR(128) DEFAULT NULL
);

CREATE TABLE 'Locations' (
'id' INTEGER DEFAULT NULL PRIMARY KEY AUTOINCREMENT,
'Name' VARCHAR(256) DEFAULT NULL
);

CREATE TABLE 'CategoriesProducts' (
'id' INTEGER DEFAULT NULL PRIMARY KEY AUTOINCREMENT,
'IdProduct' INTEGER DEFAULT NULL REFERENCES 'Products' ('id') ON DELETE CASCADE,
'IdCategory' INTEGER DEFAULT NULL REFERENCES 'Categories' ('id') ON DELETE CASCADE
);

CREATE TABLE 'EntriesHeaders' (
'id' INTEGER DEFAULT NULL PRIMARY KEY AUTOINCREMENT,
'User' VARCHAR(128) DEFAULT NULL,
'Description' VARCHAR(256) DEFAULT NULL,
'Date' DATETIME DEFAULT NULL
);

CREATE TABLE 'EntriesLines' (
'id' INTEGER DEFAULT NULL PRIMARY KEY AUTOINCREMENT,
'Quantity' INTEGER DEFAULT NULL,
'Details' VARCHAR(256) DEFAULT NULL,
'ProductId' INTEGER DEFAULT NULL REFERENCES 'Products' ('id') REFERENCES 'Products' ('id'),
'EntryHeaderId' INTEGER DEFAULT NULL REFERENCES 'EntriesHeaders' ('id') REFERENCES 'EntriesHeaders' ('id'),
'ProviderId' INTEGER DEFAULT NULL REFERENCES 'Providers' ('id')
);

CREATE TABLE 'OutputsHeaders' (
'id' INTEGER DEFAULT NULL PRIMARY KEY AUTOINCREMENT,
'User' VARCHAR DEFAULT NULL,
'Description' VARCHAR(256) DEFAULT NULL,
'Date' DATETIME DEFAULT NULL
);

CREATE TABLE 'OutputsLines' (
'id' INTEGER DEFAULT NULL PRIMARY KEY AUTOINCREMENT,
'Quantity' DECIMAL(19,6) DEFAULT NULL,
'Details' VARCHAR(256) DEFAULT NULL,
'ProductId' INTEGER DEFAULT NULL REFERENCES 'Products' ('id'),
'OutputHeaderId' INTEGER DEFAULT NULL REFERENCES 'OutputsHeaders' ('id')
);

CREATE TABLE 'Providers' (
'id' INTEGER DEFAULT NULL PRIMARY KEY AUTOINCREMENT,
'Doc' VARCHAR(64) DEFAULT NULL,
'Name' VARCHAR(256) DEFAULT NULL,
'Name_ZH' VARCHAR(256) DEFAULT NULL
);

CREATE TABLE 'InventoryLog' (
'id' INTEGER DEFAULT NULL PRIMARY KEY AUTOINCREMENT,
'Date' DATETIME DEFAULT NULL,
'Type' VARCHAR(96) DEFAULT NULL
);

CREATE TABLE 'Images' (
'id' INTEGER DEFAULT NULL PRIMARY KEY AUTOINCREMENT,
'Route' INTEGER DEFAULT NULL
);

CREATE TABLE 'ProductImages' (
'id' INTEGER DEFAULT NULL PRIMARY KEY AUTOINCREMENT,
'ProductId' INTEGER DEFAULT NULL REFERENCES 'Products' ('id'),
'ImageId' INTEGER DEFAULT NULL REFERENCES 'Images' ('id')
);

CREATE TABLE 'EntriesImages' (
'id' INTEGER DEFAULT NULL PRIMARY KEY AUTOINCREMENT,
'EntryId' INTEGER DEFAULT NULL REFERENCES 'EntriesLines' ('id') ON DELETE CASCADE,
'ImageId' INTEGER DEFAULT NULL REFERENCES 'Images' ('id') ON DELETE CASCADE
);

CREATE TABLE 'OutputsImages' (
'id' INTEGER DEFAULT NULL PRIMARY KEY AUTOINCREMENT,
'OutputId' INTEGER DEFAULT NULL REFERENCES 'OutputsLines' ('id') ON DELETE CASCADE,
'ImageId' INTEGER DEFAULT NULL REFERENCES 'Images' ('id') ON DELETE CASCADE
);

CREATE TABLE 'Users' (
'id' INTEGER DEFAULT NULL PRIMARY KEY AUTOINCREMENT,
'FullName' VARCHAR(200) DEFAULT NULL,
'Username' VARCHAR(200) DEFAULT NULL,
'Password' VARCHAR(512) DEFAULT NULL
);

CREATE TABLE 'Permissions' (
'id' INTEGER DEFAULT NULL PRIMARY KEY AUTOINCREMENT,
'UniqueName' VARCHAR(128) DEFAULT NULL,
'Description' VARCHAR(128) DEFAULT NULL
);

CREATE TABLE 'UserPermissions' (
'id' INTEGER DEFAULT NULL PRIMARY KEY AUTOINCREMENT,
'IdUser' INTEGER DEFAULT NULL REFERENCES 'Users' ('id') ON DELETE CASCADE,
'IdPermission' INTEGER DEFAULT NULL REFERENCES 'Permissions' ('id') ON DELETE CASCADE,
'ToDelete' BOOLEAN DEFAULT NULL,
'ToUpdate' BOOLEAN DEFAULT NULL,
'ToInsert' BOOLEAN DEFAULT NULL,
'ToGet' BOOLEAN DEFAULT NULL
);