### Step 0: Create a New Project in Google Cloud Platform (GCP)

**Step 0.1:** Log in to the Google Cloud Console.

**Step 0.2:** Navigate to the project dropdown at the top of the page and click on it.

**Step 0.3:** Click on the “New Project” button.

**Step 0.4:** Enter project name, we are using `web-app` as our project name at this time . Then, click “Create.”

**Step 0.5:**After creating your project, set environment variables for your project ID, cluster name, and compute zone to simplify the CLI commands:

```
export PROJECT_ID=<YOUR_PROJECT_ID>
export CLUSTER_NAME=web-app-cluster
export COMPUTE_ZONE=us-east1-b
```

Replace `<YOUR_PROJECT_ID>` with actual project ID we just created.

### Step 1: Initialize Your GCP Project and Authentication

**Step 1.1:** If using the CLI, authenticate your Google Cloud session:

```
gcloud auth login
```

**Step 1.2:** Set your newly created project as the default for the `gcloud` CLI:

```
gcloud config set project $PROJECT_ID
```

### Step 2: Set Up Google Kubernetes Engine (GKE)

**Step 2.1:** Enable the Kubernetes Engine API for your project.

- CLI:
  
  ```
  gcloud services enable container.googleapis.com
  ```

**Step 2.2:** Create a GKE cluster.

- CLI:
  
  ```
  gcloud container clusters create "$CLUSTER_NAME" --zone "$COMPUTE_ZONE" --num-nodes=1
  ```

**Step 2.3:** Configure `kubectl` to use the cluster:

```
gcloud container clusters get-credentials "$CLUSTER_NAME" --zone "$COMPUTE_ZONE" --project "$PROJECT_ID"
```

### Step 3: Configuring GitHub Account

**Step 3.1:** Set Up Git and GitHub Account

- Open a terminal or command prompt.

- Set up your user name and email address with the following commands:
  
  ```
  git config --global user.name "Your Name"
  git config --global user.email "your_email@example.com"
  ```

- Ensure your git configuration is correctly set up by checking the configuration list:
  
  ```
  git config --list
  ```

**Step 3.2:** Clone the Repository

To clone the project repository, you can use https:

```
 git clone https://github.com/WangyangYe0512/bookstore-web-app.git
```

or SSH:

```
git@github.com:WangyangYe0512/bookstore-web-app.git
```

Then you can access to the files

```
cd bookstore-web-app
```

### Step 4: Deploy MongoDB in the Development Environment

#### 4.1 Checkout the Development Branch

Switch to the `dev` branch:

```
git checkout dev
```

#### 4.2 Update Your Local Repository

Ensure you have the latest version of your files:

```
git pull origin dev
```

#### 4.3 Deploy MongoDB

Now change direction to deployment where stored the YAML files:

```
cd deployment
```

Apply the MongoDB deployment and service YAML files:

```
kubectl apply -f mongodb-official-deployment.yaml
kubectl apply -f mongodb-official-service.yaml
```

#### 4.4 Confirm Deployment

Verify that the MongoDB pod is up and running:

```
kubectl get pods -n development
```

Now you can access to MongoDB by:

```
mongodb://mongodb-service.development.svc.cluster.local:27017/bookstore
```

### Step 5 : Deploy Web App

Build and Push the Docker Image for frontend:

```
cd ../frontend
docker build -t bookstore-frontend .
docker tag bookstore-frontend gcr.io/$PROJECT_ID/bookstore-frontend:latest
docker push gcr.io/$PROJECT_ID/bookstore-frontend:latest
kubectl rollout restart deployment web-app-deployment
```

Then build and push Docker for backend in same way:

```
cd ../backend
docker build -t bookstore-backend .
docker tag bookstore-backend gcr.io/$PROJECT_ID/bookstore-backend:latest
docker push gcr.io/$PROJECT_ID/bookstore-backend:latest
```

Finally, you can deploy your web app:

```
cd ../deployment
sed -e "s/\$REPO_NAME/${REPO_NAME}/g" -e "s/\$REPO_REGION/${REPO_REGION}/g" -e "s/\$PROJECT_ID/${PROJECT_ID}/g" web-app-deployment.yaml | kubectl apply -f -
kubectl apply -f frontend-service.yaml
```

## For Production Environment



```
export CLUSTER_NAME=web-app-production-cluster
export COMPUTE_ZONE=us-east1-b
```

### Step 1: Create Another Cluster:

```
gcloud container clusters create $CLUSTER_NAME --zone $COMPUTE_ZONE --disk-size=100 --num-nodes=3
```

may need to switch k8s context (multiple cluster)

```
gcloud container clusters get-credentials "$CLUSTER_NAME" --zone "$COMPUTE_ZONE" --project "$PROJECT_ID"
```

```
kubectl config get-contexts
```

```
kubectl config use-context YOUR_CONTEXT_NAME
```

### Step 2: deploy application

change directory "bookstore-web-app/production/deployment"

```
cd production/deployment
kubectl apply -f mongodb-official-deployment.yaml
kubectl apply -f mongodb-official-pvc.yaml
kubectl apply -f mongodb-official-service.yaml
```

"**Image**"" may need to change  in **web-app-production-deployment.yaml** file 

**frontend**: gcr.io/$PROJECT_ID/bookstore-frontend:latest

**backend**: gcr.io/$PROJECT_ID/bookstore-backend:latest

```
sed "s/\$PROJECT_ID/${PROJECT_ID}/g" web-app-production-deployment.yaml | kubectl apply -f -
kubectl apply -f web-app-production-service.yaml
```
