FROM node:20-alpine

WORKDIR /app

# Copy project files
COPY . .

# Expose the server port
EXPOSE 8788

# Set default environments
ENV ASSET_CONTROL_PORT=8788
ENV ASSET_CONTROL_HOST=0.0.0.0

# Run the server
CMD ["node", "outputs/asset-control-server.cjs"]
