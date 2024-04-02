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
  gcloud container clusters create "$CLUSTER_NAME" --zone "$COMPUTE_ZONE"
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

#### 4.3 Navigate to the Deployment Directory

Change to the directory where your MongoDB Kubernetes configuration files are located:

```
cd development/database/deployment
```

#### 4.4 Deploy MongoDB

Create the development namespace:

```
kubectl create namespace development
```

Apply the MongoDB deployment and service YAML files:

```
kubectl apply -f mongodb-deployment.yaml
kubectl apply -f mongodb-service.yaml
```

#### 3.5 Confirm Deployment

Verify that the MongoDB pod is up and running:

```
kubectl get pods -n development
```

```
MONGO_POD=$(kubectl get pod -l "app=mongodb-dev" -n development -o jsonpath="{.items[0].metadata.name}")
```

