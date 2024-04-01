# Loop over each JSON file in the current directory and import it into MongoDB
for file in *.json; do
  # Use the filename without the extension as the collection name
  COLLECTION_NAME=$(basename "$file" .json)
  # Copy the JSON file to the MongoDB pod
  kubectl cp "$file" "${MONGO_POD}:/tmp/${file}" -n development
  # Import the JSON file into the MongoDB collection
  kubectl exec -it $MONGO_POD -n development -- mongoimport --db bookstore --collection $COLLECTION_NAME --file "/tmp/${file}"
done