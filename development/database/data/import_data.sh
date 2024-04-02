#!/bin/bash

# Start MongoDB in the background
mongod --fork --logpath /var/log/mongod.log

# Wait a bit for mongod to start
sleep 5

# Import the JSON data into MongoDB
for file in /mongo_data/*.json; do
  mongoimport --db bookstore --collection $(basename "$file" .json) --file "$file" --jsonArray
done

# Now bring the foreground process to a halt
wait