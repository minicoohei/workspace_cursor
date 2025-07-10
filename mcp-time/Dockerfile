FROM python:3.11-slim-bookworm

WORKDIR /app/mcp-time

RUN apt-get update && apt-get install -y tzdata \
    && ln -sf /usr/share/zoneinfo/Asia/Tokyo /etc/localtime \
    && dpkg-reconfigure -f noninteractive tzdata

# Install poetry and uv
RUN pip install --no-cache-dir \
    poetry \
    uv 