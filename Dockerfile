# Etapa 1: Build do frontend (React + Vite + Tailwind)
FROM node:22 AS frontend-build
WORKDIR /app/frontend
COPY frontend/react-app/package*.json ./
RUN npm install
COPY frontend/react-app/ .
RUN npm run build

# Etapa 2: Build do backend (.NET)
# Etapa 2: Build do backend (.NET)
# Etapa 2: Build do backend (.NET)
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS backend-build
WORKDIR /src

# Copia todos os .csproj para restaurar dependências
COPY backend/src/Bran.API/Bran.API.csproj ./Bran.API/
COPY backend/src/Bran.Application/Bran.Application.csproj ./Bran.Application/
COPY backend/src/Bran.Domain/Bran.Domain.csproj ./Bran.Domain/
COPY backend/src/Bran.Infrastructure/Bran.Infrastructure.csproj ./Bran.Infrastructure/

RUN dotnet restore ./Bran.API/Bran.API.csproj

# Copia o restante do código
COPY backend/src/ ./
RUN dotnet publish ./Bran.API/Bran.API.csproj -c Release -o /app/publish


# Etapa 3: Runtime (servindo API + frontend)
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS runtime
WORKDIR /app
COPY --from=backend-build /app/publish .
# Copia o build do frontend para dentro do backend (wwwroot)
COPY --from=frontend-build /app/frontend/dist ./wwwroot
ENV ASPNETCORE_URLS=http://+:$PORT
ENTRYPOINT ["dotnet", "Bran.API.dll"]



