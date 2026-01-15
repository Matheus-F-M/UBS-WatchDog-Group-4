# Etapa 1: Build do frontend (React + Vite + Tailwind)
FROM node:18 AS frontend-build
WORKDIR /app/frontend
COPY frontend/react-app/package*.json ./
RUN npm install
COPY frontend/react-app/ .
RUN npm run build

# Etapa 2: Build do backend (.NET 10)
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS backend-build
WORKDIR /src
COPY backend/*.csproj ./backend/
RUN dotnet restore ./backend/Bran.API.csproj
COPY backend/ ./backend/
RUN dotnet publish ./backend/Bran.API.csproj -c Release -o /app/publish

# Etapa 3: Runtime (servindo API + frontend)
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS runtime
WORKDIR /app
COPY --from=backend-build /app/publish .
# Copia o build do frontend para dentro do backend (wwwroot)
COPY --from=frontend-build /app/frontend/dist ./wwwroot
ENV ASPNETCORE_URLS=http://+:$PORT
ENTRYPOINT ["dotnet", "Bran.API.dll"]
