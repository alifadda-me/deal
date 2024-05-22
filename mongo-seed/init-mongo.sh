#!/bin/bash
set -e

MONGO_URI="mongodb://localhost:27017/test"

DATA_DIR="/docker-entrypoint-initdb.d"

for FILE in $DATA_DIR/*.json; do
  # Extract the filename without the path and the .json extension
  FILENAME=$(basename "$FILE" .json)

  # Remove the database name prefix 'test.' from the filename to use as the collection name
  COLLECTION=${FILENAME#test.}  # Removes the 'test.' prefix if it exists

  echo "Importing $FILE into collection $COLLECTION"

  # Import the JSON file into MongoDB
  mongoimport --uri="$MONGO_URI" --collection="$COLLECTION" --drop --file="$FILE" --jsonArray
done
