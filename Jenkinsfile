pipeline {
    agent any
    
    tools {
        maven 'Maven 3.9.6'
        nodejs 'Node 20'
    }
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
        stage('Build Backend') {
            steps {
                dir('Back-end') {
                    sh 'mvn clean package -DskipTests'
                }
            }
        }
        
        stage('Build Frontend') {
            steps {
                dir('Front-end') {
                    sh 'npm install'
                    sh 'npm run build'
                }
            }
        }
        
        stage('Build Docker Images') {
            steps {
                script {
                    docker.build("redtrack-backend:${env.BUILD_NUMBER}", "./Back-end")
                    docker.build("redtrack-frontend:${env.BUILD_NUMBER}", "./Front-end")
                }
            }
        }
        
        stage('Deploy') {
            steps {
                sh 'docker-compose up -d'
            }
        }
    }
    
    post {
        always {
            cleanWs()
        }
    }
}