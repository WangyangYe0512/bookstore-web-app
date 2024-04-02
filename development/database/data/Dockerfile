FROM mongo

# Create a directory to hold the import data
RUN mkdir /mongo_data
WORKDIR /mongo_data

# Copy the JSON files into the image
COPY /data/*.json /mongo_data/

# Copy the import script into the image
COPY import_data.sh /mongo_data/

# Make the import script executable
RUN chmod +x /mongo_data/import_data.sh

# Set the entrypoint to the import script
ENTRYPOINT ["/mongo_data/import_data.sh"]

# Fallback command to keep the container running after import
CMD ["mongod"]