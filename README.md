# Microservices - Gestion des Étudiants

**Master II Informatique - Université de Ziguinchor**  
*Année académique 2025-2026*

## Description
Ce projet implémente une architecture microservices pour la gestion complète du cycle de vie des étudiants dans une université.

## Architecture
![Architecture Diagram](docs/architecture.png)

## Microservices
1. **Etudiant Service** - Gestion des étudiants
2. **Classe Service** - Gestion des classes et matières
3. **Enseignant Service** - Gestion des enseignants
4. **Note Service** - Gestion des notes et bulletins
5. **Auth Service** - Authentification (Keycloak + JWT)
6. **API Gateway** - Point d'entrée unique
7. **Service Registry** - Découverte de services (Eureka)
8. **Config Service** - Configuration centralisée

## Démarrage rapide

### Prérequis
- Java 17+
- Docker & Docker Compose
- Maven 3.8+

### Lancer le projet
```bash
docker-compose up -d