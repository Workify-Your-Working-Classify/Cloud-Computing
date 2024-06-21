# Gunakan image dasar dari python:3.9
FROM python:3.9

# Set working directory
WORKDIR /app

# Copy file requirements.txt
COPY requirements.txt .

# Install dependensi Python
RUN pip install -r requirements.txt

# Copy semua file proyek
COPY . .

# Install dependensi Node.js
RUN apt-get update && apt-get install -y curl
RUN curl -sL https://deb.nodesource.com/setup_18.x | bash -
RUN apt-get install -y nodejs

# Install dependensi proyek Node.js
RUN npm install

# Ekspos port yang digunakan aplikasi
EXPOSE 8080

# Set entrypoint untuk menjalankan aplikasi
CMD ["npm", "start"]
