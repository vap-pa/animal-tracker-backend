# Use an OpenJDK base image
FROM eclipse-temurin:21-jdk-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy the jar file into the container
COPY target/*.jar app.jar

# Expose port 5006
EXPOSE 5006

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]
