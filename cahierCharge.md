# Projet DevOps-M : Marketplace Multi-Vendeurs, Microservices, CI/CD et Kubernetes

**Intitulé initial :** Microservices Deployment & CI/CD Configuration in an AWS Cloud

**Application choisie :** Marketplace Multi-Vendeurs

**Environnement :** Kubernetes local (gratuit), avec possibilité de migration future vers AWS.

## 1. Objectif du projet

Développer une plateforme de commerce électronique multi-vendeurs basée sur une architecture microservices, puis automatiser ses tests, sa conteneurisation, son déploiement et sa supervision grâce aux outils DevOps.

L'application permettra aux vendeurs de gérer leurs boutiques et leurs produits, et aux clients de consulter des produits, passer des commandes et suivre leurs livraisons.

**Objectif final :** obtenir une application fonctionnelle, composée de 5 microservices, déployée sur Kubernetes local avec une pipeline CI/CD automatisée.

## 2. Architecture de l'application

La marketplace sera composée de **5 microservices développés avec Java et Spring Boot**.

| Microservice | Fonctionnalités |
|---|---|
| **1. User Service** | Gestion des utilisateurs, vendeurs, administrateurs et authentification |
| **2. Catalog Service** | Gestion des boutiques, produits, catégories et stocks |
| **3. Cart Service** | Gestion des paniers des clients |
| **4. Order Service** | Gestion des commandes, paiements simulés et livraisons |
| **5. Notification Service** | Gestion des notifications liées aux commandes et aux livraisons |

Les microservices communiqueront grâce à des API REST.

L'application comprendra également une interface web et un API Gateway permettant de centraliser les requêtes.

## 3. Technologies utilisées

| Technologie | Rôle |
|---|---|
| **Java / Spring Boot** | Développement des microservices |
| **Docker / Docker Compose** | Conteneurisation et exécution des services |
| **Git / GitHub** | Gestion du code source |
| **Jenkins** | Automatisation CI/CD |
| **Terraform** | Gestion de l'infrastructure locale avec du code |
| **Ansible** | Automatisation de la configuration |
| **Kubernetes (Minikube ou Kind)** | Déploiement et orchestration des microservices |
| **Prometheus** | Collecte des métriques |
| **Grafana** | Supervision et tableaux de bord |
| **Trivy** | Analyse des vulnérabilités |
| **SonarQube Community Build** | Analyse de la qualité et de la sécurité du code |

Les tests des microservices seront réalisés avec les outils de test Java adaptés à Spring Boot.

**Coût prévu : 0 DH**, grâce à l'utilisation d'outils gratuits dans un environnement local.

## 4. Étapes de réalisation

**Étape 1 — Développement**

Développer les cinq microservices et l'interface web de la marketplace.

**Étape 2 — Conteneurisation**

Créer les images Docker et configurer Docker Compose pour exécuter l'application en local.

**Étape 3 — Déploiement Kubernetes**

Déployer les microservices sur un cluster Kubernetes local avec Minikube ou Kind.

**Étape 4 — Automatisation CI/CD**

Configurer Jenkins pour automatiser les tests, l'analyse du code, la construction des images Docker et le déploiement.

**Étape 5 — Infrastructure**

Utiliser Terraform et Ansible pour automatiser la gestion et la configuration de l'environnement local.

**Étape 6 — Supervision et sécurité**

Configurer Prometheus, Grafana, Trivy et SonarQube pour surveiller et sécuriser l'application.

**Étape 7 — Tests et documentation**

Vérifier le fonctionnement de l'application et préparer le rapport final.

## 5. Résultats attendus

À la fin du projet, nous devons présenter :

1. Une **marketplace multi-vendeurs fonctionnelle**, avec une interface web.
2. Une architecture composée de **5 microservices Spring Boot**.
3. Des images et conteneurs Docker.
4. Une application déployée sur Kubernetes local.
5. Une pipeline CI/CD automatisée avec Jenkins.
6. Une infrastructure locale configurée avec Terraform et Ansible.
7. Un système de supervision avec Prometheus et Grafana.
8. Des tests automatisés et des analyses de sécurité avec Trivy et SonarQube.
9. Un rapport final présentant l'architecture, les configurations et les résultats.

## 6. Fonctionnement final du projet

**Modification du code → GitHub → Jenkins → Tests et sécurité → Docker → Kubernetes local → Application mise à jour.**

Prometheus et Grafana permettront de surveiller les microservices et de détecter les éventuels problèmes.

## 7. Évolution future vers AWS

Après validation du projet local, il sera possible de migrer progressivement vers AWS :

- **Kubernetes local → Amazon EKS**
- **Images Docker locales → Amazon ECR**
- **Terraform local → Infrastructure AWS**
- **Supervision locale → Intégration éventuelle d'Amazon CloudWatch**

Cette migration sera envisagée uniquement lorsqu'un environnement AWS financé sera disponible.

## 8. Conclusion

Ce projet consiste à développer une **marketplace multi-vendeurs composée de 5 microservices**, puis à mettre en place une chaîne DevOps complète pour automatiser son développement, ses tests, son déploiement, sa supervision et sa sécurité.

**La première version sera entièrement réalisée en local, avec des technologies gratuites et sans frais de cloud.**