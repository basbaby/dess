cat <<EOF | kubectl apply -f -
apiVersion: apps/v1
kind: Deployment
metadata:
  creationTimestamp: null
  labels:
    app: "${projectName}"
  name: demo
spec:
  replicas: 1
  selector:
    matchLabels:
      app: "${projectName}"
  strategy: {}
  template:
    metadata:
      creationTimestamp: null
      labels:
        app: "${projectName}"
    spec:
      containers:
      - image: "${azure_container_registry_name}".azurecr.io/njccontainer:v1
        name: njccontainer
        resources: {}
      imagePullSecrets:
      - name: "${kubectl_secret_name}" 
status: {}
---
apiVersion: v1
kind: Service
metadata:
  creationTimestamp: null
  labels:
    app: "${projectName}"
  name: "${projectName}"
spec:
  ports:
  - name: 8080-8080
    port: 8080
    protocol: TCP
    targetPort: 8080
  selector:
    app: "${projectName}"
  type: ClusterIP
status:
  loadBalancer: {}
EOF