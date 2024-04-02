#!/bin/bash

# Start MongoDB in the background
mongod --fork --logpath /var/log/mongod.log

# Wait a bit for mongod to start
sleep 10

# Import the JSON data into MongoDB
for file in /mongo_data/*.json; do
  mongoimport --db bookstore --collection $(basename "$file" .json) --file "$file" --jsonArray
done

# Stop the background MongoDB server
mongod --shutdown

# Wait a bit to ensure shutdown is complete
sleep 5

# Now start mongod in the foreground
exec mongod